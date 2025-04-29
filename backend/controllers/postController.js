const Post = require('../models/Post');
const User = require('../models/User');
const Tag = require('../models/Tag');
const Notification = require('../models/Notification');

exports.createPost = async (req, res) => {
    try {
        const { caption, tags } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';
        const tagsArray = typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : tags;

        // Get the current user first with username
        const currentUser = await User.findById(req.userId);
        if (!currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const post = new Post({
            imageUrl,
            caption,
            tags: tagsArray,
            uploader: req.userId,
        });
        await post.save();

        // Add post to user's posts array
        await User.findByIdAndUpdate(req.userId, { $push: { posts: post._id } });

        // Notify all users except the uploader
        const allUsers = await User.find({ _id: { $ne: req.userId } });
        
        // Create notifications with proper username
        const notifications = allUsers.map(user => ({
            user: user._id,
            post: post._id,
            message: `A new post was uploaded by ${currentUser.username}`,
            type: 'new_post',
            read: false
        }));

        // Create all notifications at once
        await Notification.insertMany(notifications);

        // Update tag usage and last activity
        for (const tagName of tagsArray) {
            await Tag.findOneAndUpdate(
                { name: tagName },
                { $inc: { usageCount: 1 }, lastActivity: new Date() },
                { upsert: true }
            );
        }

        res.status(201).json(post);
    } catch (err) {
        console.error('Error in createPost:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getPostsByTag = async (req, res) => {
    try {
        const { tag } = req.params;
        const posts = await Post.find({ tags: tag }).populate('uploader', 'username profilePic');
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getFeed = async (req, res) => {
    try {
        // Latest posts, can be improved to show followed users' posts
        const posts = await Post.find().sort({ createdAt: -1 }).limit(20).populate('uploader', 'username profilePic');
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        
        if (post.uploader.toString() !== req.userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await post.deleteOne();

        // Return the deleted post's ID for frontend reference
        res.json({ 
            message: 'Post deleted successfully',
            deletedPostId: req.params.id 
        });
    } catch (err) {
        console.error('Error in deletePost:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.editPost = async (req, res) => {
    try {
        const { caption, tags } = req.body;
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        if (post.uploader.toString() !== req.userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        post.caption = caption || post.caption;
        post.tags = tags ? tags.split(',').map(t => t.trim()) : post.tags;
        await post.save();
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Add this function to check trending posts and send notifications
const checkTrendingAndNotify = async (postId) => {
    try {
        const post = await Post.findById(postId).populate('uploader', 'username');
        if (!post) return;

        // Get posts from the last 3 hours with the same tags
        const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);
        
        for (const tag of post.tags) {
            const tagPosts = await Post.find({
                tags: tag,
                createdAt: { $gte: threeHoursAgo }
            }).sort({ likes: -1 }).limit(1);

            // If this post is the most liked in its tag
            if (tagPosts.length > 0 && tagPosts[0]._id.equals(post._id)) {
                await Notification.create({
                    user: post.uploader._id,
                    post: post._id,
                    type: 'trending',
                    message: `Your post is trending in #${tag}!`,
                    read: false
                });
            }
        }
    } catch (err) {
        console.error('Error checking trending posts:', err);
    }
};

// Add this to the likePost function after incrementing likes
exports.likePost = async (req, res) => {
    try {
        // ... existing like logic ...
        
        // After updating post likes
        await Post.findByIdAndUpdate(postId, { $inc: { likes: 1 } });
        
        // Check if post is trending
        await checkTrendingAndNotify(postId);

        res.status(201).json({ message: 'Post liked' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}; 
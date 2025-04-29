const Like = require('../models/Like');
const Post = require('../models/Post');
const User = require('../models/User');
const Notification = require('../models/Notification');

exports.likePost = async (req, res) => {
    try {
        const { postId } = req.body;
        
        // Check for existing like
        const existing = await Like.findOne({ user: req.userId, post: postId });
        if (existing) {
            return res.status(400).json({ message: 'Already liked' });
        }

        // Get post information
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Get voter information
        const voter = await User.findById(req.userId);
        if (!voter) {
            return res.status(404).json({ message: 'Voter not found' });
        }

        // Create the like
        const like = new Like({ user: req.userId, post: postId });
        await like.save();

        // Increment post likes
        await Post.findByIdAndUpdate(postId, { $inc: { likes: 1 } });

        // Create notification if the voter is not the post owner
        if (post.uploader.toString() !== req.userId) {
            const notification = new Notification({
                user: post.uploader,
                post: postId,
                message: `${voter.username} voted on your post`,
                type: 'vote',
                read: false
            });
            await notification.save();

            console.log('Vote notification created:', notification);
        }

        res.status(201).json({ message: 'Post liked successfully' });
    } catch (err) {
        console.error('Error in likePost:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.unlikePost = async (req, res) => {
    try {
        const { postId } = req.body;
        const like = await Like.findOneAndDelete({ user: req.userId, post: postId });
        if (!like) return res.status(404).json({ message: 'Like not found' });

        // Decrement like count on post
        await Post.findByIdAndUpdate(postId, { $inc: { likes: -1 } });

        res.json({ message: 'Post unliked' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getUserLikes = async (req, res) => {
    try {
        const likes = await Like.find({ user: req.userId });
        res.json(likes);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}; 
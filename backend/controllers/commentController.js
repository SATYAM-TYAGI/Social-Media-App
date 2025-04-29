const Comment = require('../models/Comment');
const Post = require('../models/Post');
const User = require('../models/User');
const Notification = require('../models/Notification');

exports.addComment = async (req, res) => {
  try {
    const { postId, text } = req.body;
    
    if (!postId || !text) {
      return res.status(400).json({ message: 'Post ID and text are required' });
    }

    // Get post information
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Get commenter information
    const commenter = await User.findById(req.userId);
    if (!commenter) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create the comment
    const comment = new Comment({
      post: postId,
      user: req.userId,
      text: text.trim()
    });

    await comment.save();

    // Create notification if the commenter is not the post owner
    if (post.uploader.toString() !== req.userId) {
      try {
        await Notification.create({
          user: post.uploader,
          post: postId,
          message: `${commenter.username} commented: "${text.substring(0, 30)}${text.length > 30 ? '...' : ''}"`,
          type: 'comment',
          read: false
        });
      } catch (notifError) {
        console.error('Error creating notification:', notifError);
        // Don't fail the comment creation if notification fails
      }
    }

    // Return the populated comment
    const populatedComment = await Comment.findById(comment._id)
      .populate('user', 'username profilePic');
    
    res.status(201).json(populatedComment);
  } catch (err) {
    console.error('Error in addComment:', err);
    res.status(500).json({ 
      message: 'Failed to add comment',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

exports.getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    if (!postId) {
      return res.status(400).json({ message: 'Post ID is required' });
    }

    const comments = await Comment.find({ post: postId })
      .populate('user', 'username profilePic')
      .sort({ createdAt: 1 });
    
    res.json(comments);
  } catch (err) {
    console.error('Error in getComments:', err);
    res.status(500).json({ 
      message: 'Failed to fetch comments',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}; 
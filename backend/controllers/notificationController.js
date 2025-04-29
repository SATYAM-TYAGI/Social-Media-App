const Notification = require('../models/Notification');
const Post = require('../models/Post');
const User = require('../models/User');

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.userId })
      .populate({
        path: 'post',
        populate: {
          path: 'uploader',
          select: 'username'
        }
      })
      .sort({ createdAt: -1 });

    // Format notifications if needed
    const formattedNotifications = notifications.map(notification => {
      return {
        ...notification.toObject(),
        message: notification.message
      };
    });

    res.json(formattedNotifications);
  } catch (err) {
    console.error('Error in getNotifications:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.notifyVoting = async (postId) => {
  const post = await Post.findById(postId);
  if (!post) return;
  await Notification.create({
    user: post.uploader,
    post: postId,
    message: 'Your post has entered voting!',
    type: 'voting'
  });
};

exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.userId, read: false },
      { $set: { read: true } }
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    console.error('Error in markAllAsRead:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 
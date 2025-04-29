const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const auth = require('../middleware/auth');

router.post('/add', auth, commentController.addComment);
router.get('/:postId', commentController.getComments);

module.exports = router; 
const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');
const auth = require('../middleware/auth');

router.post('/like', auth, likeController.likePost);
router.post('/unlike', auth, likeController.unlikePost);
router.get('/user', auth, likeController.getUserLikes);

module.exports = router; 
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Set up multer for local storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

router.post('/upload', auth, upload.single('image'), postController.createPost);
router.get('/tag/:tag', postController.getPostsByTag);
router.get('/feed', postController.getFeed);
router.delete('/:id', auth, postController.deletePost);
router.put('/:id', auth, postController.editPost);

module.exports = router; 
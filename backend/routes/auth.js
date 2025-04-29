const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/profile', auth, authController.getProfile);
router.post('/profile-setup', auth, upload.single('profilePic'), authController.profileSetup);

module.exports = router; 
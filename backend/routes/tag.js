const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');

router.get('/trending', tagController.getTrendingTags);

module.exports = router; 
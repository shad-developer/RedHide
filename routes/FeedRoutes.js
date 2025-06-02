const express = require('express');
const router = express.Router();
const FeedController = require('../controllers/FeedController');
const { protected, isAdmin } = require("../middleware/authMiddleware");


router.get('/all-feeds', protected, FeedController.getAllAnimalFeeds);
router.post('/add-feed', protected, FeedController.addAnimalFeed);


module.exports = router;
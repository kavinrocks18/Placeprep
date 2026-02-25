const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getOverview, getTopicProgress, getActivity } = require('../controllers/analyticsController');

router.get('/overview', protect, getOverview);
router.get('/topics', protect, getTopicProgress);
router.get('/activity', protect, getActivity);

module.exports = router;

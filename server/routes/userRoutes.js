const express = require('express');
const router = express.Router();
const { markQuestionSolved, getUserStats } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.put('/solve/:questionId', protect, markQuestionSolved);
router.get('/stats', protect, getUserStats);

module.exports = router;

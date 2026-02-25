const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { generateTest, submitTest, getReport, getHistory } = require('../controllers/mockTestController');

router.post('/generate', protect, generateTest);
router.post('/:testId/submit', protect, submitTest);
router.get('/history', protect, getHistory);
router.get('/:testId/report', protect, getReport);

module.exports = router;

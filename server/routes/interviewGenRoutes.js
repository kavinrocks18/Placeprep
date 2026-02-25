const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { generateInterviewQuestions, saveQuestions, getSavedQuestions } = require('../controllers/interviewGenController');

router.post('/generate', protect, generateInterviewQuestions);
router.post('/save', protect, saveQuestions);
router.get('/saved', protect, getSavedQuestions);

module.exports = router;

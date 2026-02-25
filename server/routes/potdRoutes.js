const express = require('express');
const router = express.Router();
const { getProblemOfTheDay, solveDailyProblem, getStreak, getPotdQuestionBySlug, seedPotdQuestions } = require('../controllers/potdController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getProblemOfTheDay);
router.post('/solve', protect, solveDailyProblem);
router.get('/streak', protect, getStreak);
router.get('/question/:slug', getPotdQuestionBySlug);
router.post('/seed', seedPotdQuestions);

module.exports = router;

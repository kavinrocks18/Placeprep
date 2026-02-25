const express = require('express');
const router = express.Router();
const { getQuestions, getQuestionBySlug, seedQuestions } = require('../controllers/questionController');

router.get('/', getQuestions);
router.get('/:slug', getQuestionBySlug);
router.post('/seed', seedQuestions);

module.exports = router;

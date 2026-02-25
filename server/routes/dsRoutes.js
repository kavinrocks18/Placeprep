const express = require('express');
const router = express.Router();
const { getDsQuestions, getDsQuestionBySlug, getDsCategories, seedDsQuestions } = require('../controllers/dsController');

router.get('/', getDsQuestions);
router.get('/categories', getDsCategories);
router.post('/seed', seedDsQuestions);
router.get('/:slug', getDsQuestionBySlug);

module.exports = router;

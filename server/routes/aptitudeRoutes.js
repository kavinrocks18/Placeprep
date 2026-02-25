const express = require('express');
const router = express.Router();
const { optionalProtect } = require('../middleware/authMiddleware');
const {
    getAptitudeQuestions,
    getAptitudeBySlug,
    submitAnswer,
    getCategories,
    getAptitudePOTD,
    seedAptitudeQuestions,
} = require('../controllers/aptitudeController');

router.get('/', getAptitudeQuestions);
router.get('/categories', getCategories);
router.get('/potd', getAptitudePOTD);
router.post('/seed', seedAptitudeQuestions);
router.get('/:slug', getAptitudeBySlug);
router.post('/:slug/submit', optionalProtect, submitAnswer);

module.exports = router;

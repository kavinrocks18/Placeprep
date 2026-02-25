const express = require('express');
const router = express.Router();
const { getResources, toggleBookmark, getBookmarks, seedResources } = require('../controllers/resourceController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getResources);
router.get('/bookmarks', protect, getBookmarks);
router.post('/bookmark/:id', protect, toggleBookmark);
router.post('/seed', seedResources);

module.exports = router;

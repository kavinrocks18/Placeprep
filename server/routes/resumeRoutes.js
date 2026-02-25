const express = require('express');
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const { analyzeResume } = require('../controllers/resumeController');

const router = express.Router();

// Configure multer for memory storage (no disk writes)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'), false);
        }
    },
});

router.post('/analyze', protect, upload.single('resume'), analyzeResume);

module.exports = router;

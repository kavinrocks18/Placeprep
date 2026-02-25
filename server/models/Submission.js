const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    questionType: {
        type: String,
        enum: ['coding', 'aptitude', 'ds'],
        required: true,
    },
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    topic: {
        type: String,
        default: 'General',
    },
    isCorrect: {
        type: Boolean,
        required: true,
    },
}, {
    timestamps: true,
});

// Compound index for efficient analytics queries
submissionSchema.index({ user: 1, createdAt: -1 });
submissionSchema.index({ user: 1, questionType: 1 });

module.exports = mongoose.model('Submission', submissionSchema);

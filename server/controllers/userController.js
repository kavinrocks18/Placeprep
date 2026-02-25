const User = require('../models/User');
const Submission = require('../models/Submission');
const Question = require('../models/Question');

// @desc    Mark question as solved
// @route   PUT /api/users/solve/:questionId
// @access  Private
const markQuestionSolved = async (req, res) => {
    const user = await User.findById(req.user.id);
    const { questionId } = req.params;

    if (!user.solvedQuestions.includes(questionId)) {
        user.solvedQuestions.push(questionId);
        await user.save();

        // Track submission for analytics
        try {
            const question = await Question.findById(questionId);
            await Submission.create({
                user: req.user.id,
                questionType: 'coding',
                questionId,
                topic: question?.tags?.[0] || 'General',
                isCorrect: true,
            });
        } catch (e) { /* silent fail */ }
    }

    res.status(200).json(user.solvedQuestions);
};

// @desc    Get user stats
// @route   GET /api/users/stats
// @access  Private
const getUserStats = async (req, res) => {
    // This could be aggregated but simple count is fine
    const user = await User.findById(req.user.id).populate('solvedQuestions');

    // We would also fetch application counts here or let the client do it
    // For now just return user data which has solved count
    res.status(200).json({
        solvedCount: user.solvedQuestions.length,
        solvedQuestions: user.solvedQuestions,
    });
};

module.exports = {
    markQuestionSolved,
    getUserStats,
};

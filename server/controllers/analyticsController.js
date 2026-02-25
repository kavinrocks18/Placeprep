const Submission = require('../models/Submission');
const Question = require('../models/Question');
const DsQuestion = require('../models/DsQuestion');
const AptitudeQuestion = require('../models/AptitudeQuestion');
const User = require('../models/User');

// @desc    Get analytics overview (summary cards)
// @route   GET /api/analytics/overview
// @access  Private
const getOverview = async (req, res) => {
    try {
        const userId = req.user.id;

        const submissions = await Submission.find({ user: userId });
        const user = await User.findById(userId);

        const totalAttempts = submissions.length;
        const correctAttempts = submissions.filter(s => s.isCorrect).length;
        const accuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;

        // Unique solved (correct) per type
        const solvedByType = { coding: new Set(), aptitude: new Set(), ds: new Set() };
        submissions.forEach(s => {
            if (s.isCorrect) solvedByType[s.questionType]?.add(s.questionId.toString());
        });

        // Total available problems
        const [codingTotal, dsTotal, aptitudeTotal] = await Promise.all([
            Question.countDocuments(),
            DsQuestion.countDocuments(),
            AptitudeQuestion.countDocuments(),
        ]);

        res.status(200).json({
            totalSolved: correctAttempts,
            totalAttempts,
            accuracy,
            currentStreak: user.currentStreak || 0,
            longestStreak: user.longestStreak || 0,
            byType: {
                coding: { solved: solvedByType.coding.size, total: codingTotal },
                ds: { solved: solvedByType.ds.size, total: dsTotal },
                aptitude: { solved: solvedByType.aptitude.size, total: aptitudeTotal },
            },
        });
    } catch (error) {
        console.error('Analytics overview error:', error);
        res.status(500).json({ message: 'Failed to fetch analytics overview' });
    }
};

// @desc    Get topic-wise progress
// @route   GET /api/analytics/topics
// @access  Private
const getTopicProgress = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get all correct submissions grouped by topic
        const submissions = await Submission.find({ user: userId, isCorrect: true });
        const solvedByTopic = {};
        submissions.forEach(s => {
            const key = `${s.questionType}::${s.topic}`;
            if (!solvedByTopic[key]) solvedByTopic[key] = new Set();
            solvedByTopic[key].add(s.questionId.toString());
        });

        // Get total counts per topic for each type
        const [codingQuestions, dsQuestions, aptitudeQuestions] = await Promise.all([
            Question.find({}).select('tags'),
            DsQuestion.find({}).select('category'),
            AptitudeQuestion.find({}).select('category topic'),
        ]);

        // Build coding topics from tags
        const codingTopics = {};
        codingQuestions.forEach(q => {
            const tag = q.tags?.[0] || 'General';
            if (!codingTopics[tag]) codingTopics[tag] = 0;
            codingTopics[tag]++;
        });

        // Build DS topics from category
        const dsTopics = {};
        dsQuestions.forEach(q => {
            if (!dsTopics[q.category]) dsTopics[q.category] = 0;
            dsTopics[q.category]++;
        });

        // Build aptitude topics from category
        const aptitudeTopics = {};
        aptitudeQuestions.forEach(q => {
            if (!aptitudeTopics[q.category]) aptitudeTopics[q.category] = 0;
            aptitudeTopics[q.category]++;
        });

        const buildProgress = (topics, type) =>
            Object.entries(topics).map(([topic, total]) => ({
                topic,
                solved: solvedByTopic[`${type}::${topic}`]?.size || 0,
                total,
            }));

        res.status(200).json({
            coding: buildProgress(codingTopics, 'coding'),
            ds: buildProgress(dsTopics, 'ds'),
            aptitude: buildProgress(aptitudeTopics, 'aptitude'),
        });
    } catch (error) {
        console.error('Analytics topics error:', error);
        res.status(500).json({ message: 'Failed to fetch topic progress' });
    }
};

// @desc    Get weekly activity heatmap (past 12 weeks)
// @route   GET /api/analytics/activity
// @access  Private
const getActivity = async (req, res) => {
    try {
        const userId = req.user.id;

        // 12 weeks = 84 days ago
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 83);
        startDate.setHours(0, 0, 0, 0);

        const submissions = await Submission.find({
            user: userId,
            createdAt: { $gte: startDate },
        }).select('createdAt isCorrect');

        // Group by date string
        const activityMap = {};
        submissions.forEach(s => {
            const dateStr = s.createdAt.toISOString().split('T')[0];
            if (!activityMap[dateStr]) activityMap[dateStr] = { count: 0, correct: 0 };
            activityMap[dateStr].count++;
            if (s.isCorrect) activityMap[dateStr].correct++;
        });

        // Build 84-day array
        const days = [];
        for (let i = 0; i < 84; i++) {
            const d = new Date(startDate);
            d.setDate(d.getDate() + i);
            const dateStr = d.toISOString().split('T')[0];
            days.push({
                date: dateStr,
                dayOfWeek: d.getDay(),
                count: activityMap[dateStr]?.count || 0,
                correct: activityMap[dateStr]?.correct || 0,
            });
        }

        res.status(200).json({ days });
    } catch (error) {
        console.error('Analytics activity error:', error);
        res.status(500).json({ message: 'Failed to fetch activity data' });
    }
};

module.exports = { getOverview, getTopicProgress, getActivity };

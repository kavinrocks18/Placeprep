const MockTest = require('../models/MockTest');
const AptitudeQuestion = require('../models/AptitudeQuestion');
const Question = require('../models/Question');
const CompanyRoadmap = require('../models/CompanyRoadmap');

// @desc    Generate a new mock test
// @route   POST /api/mock-test/generate
const generateTest = async (req, res) => {
    try {
        const { questionCount = 20, duration = 1800, testType = 'aptitude', companies = [] } = req.body;
        const count = Math.min(Math.max(parseInt(questionCount), 5), 50);
        const dur = Math.min(Math.max(parseInt(duration), 300), 7200);

        let questions = [];

        // Pull company-based interview questions if companies are selected
        if (companies.length > 0) {
            const companyDocs = await CompanyRoadmap.find({
                slug: { $in: companies },
            });

            const companyQuestions = [];
            companyDocs.forEach(company => {
                (company.previousQuestions || []).forEach(pq => {
                    companyQuestions.push({
                        questionId: company._id,
                        questionType: 'company-interview',
                        title: pq.question,
                        category: pq.tag || 'General',
                        topic: company.companyName,
                        difficulty: pq.difficulty || 'Medium',
                        options: [],
                        correctAnswer: -1,
                        explanation: `Frequently asked at ${company.companyName} (${pq.frequency || 'Common'})`,
                        selectedAnswer: -1,
                        isCorrect: false,
                        isAttempted: false,
                        timeTaken: 0,
                    });
                });
            });

            // Shuffle company questions and take a portion
            for (let i = companyQuestions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [companyQuestions[i], companyQuestions[j]] = [companyQuestions[j], companyQuestions[i]];
            }

            // Take up to 30% of total count from company questions
            const companySlice = Math.min(Math.ceil(count * 0.3), companyQuestions.length);
            questions.push(...companyQuestions.slice(0, companySlice));
        }

        const remainingCount = count - questions.length;

        if (testType === 'aptitude' || testType === 'mixed') {
            const aptitudeCount = testType === 'mixed' ? Math.ceil(remainingCount * 0.7) : remainingCount;
            if (aptitudeCount > 0) {
                const aptitudeQs = await AptitudeQuestion.aggregate([{ $sample: { size: aptitudeCount } }]);

                aptitudeQs.forEach(q => {
                    questions.push({
                        questionId: q._id,
                        questionType: 'aptitude',
                        title: q.question || q.title,
                        category: q.category || '',
                        topic: q.topic || '',
                        difficulty: q.difficulty || 'Medium',
                        options: q.options || [],
                        correctAnswer: q.correctAnswer,
                        explanation: q.explanation || '',
                        selectedAnswer: -1,
                        isCorrect: false,
                        isAttempted: false,
                        timeTaken: 0,
                    });
                });
            }
        }

        if (testType === 'mixed') {
            const codingCount = count - questions.length;
            if (codingCount > 0) {
                const codingQs = await Question.aggregate([{ $sample: { size: codingCount } }]);

                codingQs.forEach(q => {
                    questions.push({
                        questionId: q._id,
                        questionType: 'coding',
                        title: q.title,
                        category: 'Coding',
                        topic: (q.tags && q.tags[0]) || 'General',
                        difficulty: q.difficulty || 'Medium',
                        options: [],
                        correctAnswer: -1,
                        selectedAnswer: -1,
                        isCorrect: false,
                        isAttempted: false,
                        timeTaken: 0,
                    });
                });
            }
        }

        // Shuffle questions
        for (let i = questions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [questions[i], questions[j]] = [questions[j], questions[i]];
        }

        const mockTest = await MockTest.create({
            user: req.user.id,
            testType,
            totalQuestions: questions.length,
            duration: dur,
            questions,
            status: 'in-progress',
            startedAt: new Date(),
        });

        // Return test without correct answers
        const safeQuestions = mockTest.questions.map(q => ({
            questionId: q.questionId,
            questionType: q.questionType,
            title: q.title,
            category: q.category,
            topic: q.topic,
            difficulty: q.difficulty,
            options: q.options,
            selectedAnswer: q.selectedAnswer,
            isAttempted: q.isAttempted,
        }));

        res.status(201).json({
            testId: mockTest._id,
            testType: mockTest.testType,
            totalQuestions: mockTest.totalQuestions,
            duration: mockTest.duration,
            questions: safeQuestions,
            startedAt: mockTest.startedAt,
        });
    } catch (error) {
        console.error('Generate test error:', error);
        res.status(500).json({ message: 'Failed to generate test' });
    }
};

// @desc    Submit mock test answers
// @route   POST /api/mock-test/:testId/submit
const submitTest = async (req, res) => {
    try {
        const mockTest = await MockTest.findOne({ _id: req.params.testId, user: req.user.id });
        if (!mockTest) return res.status(404).json({ message: 'Test not found' });
        if (mockTest.status !== 'in-progress') return res.status(400).json({ message: 'Test already submitted' });

        const { answers, timedOut } = req.body;
        // answers: [{ questionIndex, selectedAnswer, timeTaken }]

        let totalCorrect = 0;
        let totalAttempted = 0;
        const topicStats = {};
        const categoryStats = {};

        mockTest.questions.forEach((q, idx) => {
            const ans = answers?.find(a => a.questionIndex === idx);
            if (ans && ans.selectedAnswer !== undefined && ans.selectedAnswer !== -1) {
                q.selectedAnswer = ans.selectedAnswer;
                q.isAttempted = true;
                q.timeTaken = ans.timeTaken || 0;
                totalAttempted++;

                if (q.questionType === 'aptitude' && ans.selectedAnswer === q.correctAnswer) {
                    q.isCorrect = true;
                    totalCorrect++;
                }
            }

            // Track topic stats
            const topicKey = `${q.category}|${q.topic}`;
            if (!topicStats[topicKey]) {
                topicStats[topicKey] = { topic: q.topic, category: q.category, correct: 0, total: 0 };
            }
            topicStats[topicKey].total++;
            if (q.isCorrect) topicStats[topicKey].correct++;

            // Track category stats
            if (!categoryStats[q.category]) {
                categoryStats[q.category] = { category: q.category, total: 0, attempted: 0, correct: 0 };
            }
            categoryStats[q.category].total++;
            if (q.isAttempted) categoryStats[q.category].attempted++;
            if (q.isCorrect) categoryStats[q.category].correct++;
        });

        const accuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;
        const score = Math.round((totalCorrect / mockTest.totalQuestions) * 100);

        // Weakness & strength analysis
        const topicArray = Object.values(topicStats).map(t => ({
            ...t,
            accuracy: t.total > 0 ? Math.round((t.correct / t.total) * 100) : 0,
        }));

        const weakTopics = topicArray
            .filter(t => t.total >= 1 && t.accuracy < 50)
            .sort((a, b) => a.accuracy - b.accuracy)
            .slice(0, 5);

        const strongTopics = topicArray
            .filter(t => t.total >= 1 && t.accuracy >= 70)
            .sort((a, b) => b.accuracy - a.accuracy)
            .slice(0, 5);

        const categoryBreakdown = Object.values(categoryStats).map(c => ({
            ...c,
            accuracy: c.attempted > 0 ? Math.round((c.correct / c.attempted) * 100) : 0,
        }));

        mockTest.status = timedOut ? 'timed-out' : 'completed';
        mockTest.score = score;
        mockTest.totalAttempted = totalAttempted;
        mockTest.totalCorrect = totalCorrect;
        mockTest.accuracy = accuracy;
        mockTest.weakTopics = weakTopics;
        mockTest.strongTopics = strongTopics;
        mockTest.categoryBreakdown = categoryBreakdown;
        mockTest.completedAt = new Date();

        await mockTest.save();

        res.json({
            testId: mockTest._id,
            status: mockTest.status,
            score,
            totalQuestions: mockTest.totalQuestions,
            totalAttempted,
            totalCorrect,
            accuracy,
            weakTopics,
            strongTopics,
            categoryBreakdown,
        });
    } catch (error) {
        console.error('Submit test error:', error);
        res.status(500).json({ message: 'Failed to submit test' });
    }
};

// @desc    Get test report by ID
// @route   GET /api/mock-test/:testId/report
const getReport = async (req, res) => {
    try {
        const mockTest = await MockTest.findOne({ _id: req.params.testId, user: req.user.id });
        if (!mockTest) return res.status(404).json({ message: 'Test not found' });

        res.json({
            testId: mockTest._id,
            testType: mockTest.testType,
            status: mockTest.status,
            totalQuestions: mockTest.totalQuestions,
            duration: mockTest.duration,
            score: mockTest.score,
            totalAttempted: mockTest.totalAttempted,
            totalCorrect: mockTest.totalCorrect,
            accuracy: mockTest.accuracy,
            weakTopics: mockTest.weakTopics,
            strongTopics: mockTest.strongTopics,
            categoryBreakdown: mockTest.categoryBreakdown,
            questions: mockTest.questions,
            startedAt: mockTest.startedAt,
            completedAt: mockTest.completedAt,
        });
    } catch (error) {
        console.error('Get report error:', error);
        res.status(500).json({ message: 'Failed to fetch report' });
    }
};

// @desc    Get user's test history
// @route   GET /api/mock-test/history
const getHistory = async (req, res) => {
    try {
        const tests = await MockTest.find({ user: req.user.id, status: { $ne: 'in-progress' } })
            .select('testType totalQuestions score accuracy totalCorrect totalAttempted status startedAt completedAt duration')
            .sort({ createdAt: -1 })
            .limit(20);

        res.json(tests);
    } catch (error) {
        console.error('Get history error:', error);
        res.status(500).json({ message: 'Failed to fetch history' });
    }
};

module.exports = { generateTest, submitTest, getReport, getHistory };

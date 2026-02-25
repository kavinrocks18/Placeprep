const CompanyRoadmap = require('../models/CompanyRoadmap');

// Comprehensive rule-based question bank organized by tag, difficulty, and role
const QUESTION_BANK = {
    technical: {
        // DSA Questions
        DSA: {
            Easy: {
                SDE: [
                    'How would you reverse a linked list? Walk me through the iterative approach.',
                    'Explain the difference between a stack and a queue with real-world examples.',
                    'Given an array of integers, find the two numbers that add up to a target. What is the optimal approach?',
                    'Describe the difference between BFS and DFS. When would you use each?',
                    'What is a hash map? How does it handle collisions?',
                    'How would you check if a string is a palindrome?',
                    'Explain the time complexity of common sorting algorithms.',
                    'What is binary search? When can it be applied?',
                ],
                Frontend: [
                    'How does the virtual DOM work in React? Why is it faster than direct DOM manipulation?',
                    'Explain the concept of closures in JavaScript with an example.',
                    'What is the difference between == and === in JavaScript?',
                    'How does event delegation work in the DOM?',
                    'Explain the CSS box model and its components.',
                    'What are the different data types in JavaScript?',
                ],
                Backend: [
                    'Explain the difference between SQL and NoSQL databases.',
                    'What is an API? How does REST differ from GraphQL?',
                    'Describe how indexing works in databases.',
                    'What is middleware in Express.js?',
                    'Explain CRUD operations with examples.',
                    'What is the difference between authentication and authorization?',
                ],
                DataScience: [
                    'What is the difference between supervised and unsupervised learning?',
                    'Explain what a confusion matrix is.',
                    'What is overfitting and how do you prevent it?',
                    'Describe the bias-variance tradeoff.',
                    'What is a normal distribution?',
                ],
            },
            Medium: {
                SDE: [
                    'Design an LRU Cache. What data structures would you use?',
                    'How would you detect a cycle in a linked list? Prove your approach works.',
                    'Explain dynamic programming with the coin change problem.',
                    'Implement a function to find the lowest common ancestor of two nodes in a BST.',
                    'How would you find the kth largest element in an unsorted array?',
                    'Explain the sliding window technique with an example problem.',
                    'How would you serialize and deserialize a binary tree?',
                    'Describe Dijkstra\'s algorithm and its time complexity.',
                ],
                Frontend: [
                    'Explain React\'s reconciliation algorithm. How does key prop optimization work?',
                    'What are Web Workers? How would you use them for heavy computations?',
                    'How do you implement infinite scrolling efficiently?',
                    'Explain the difference between useCallback and useMemo in React.',
                    'How would you optimize the performance of a large list rendering?',
                    'What is tree shaking and how does it reduce bundle size?',
                ],
                Backend: [
                    'Design a rate limiter for an API. What algorithm would you use?',
                    'Explain database normalization vs denormalization trade-offs.',
                    'How do you handle database transactions? What is ACID?',
                    'Describe the N+1 query problem and how to solve it.',
                    'What are database indexes and when should you NOT use them?',
                    'Explain connection pooling and its benefits.',
                ],
                DataScience: [
                    'Explain the difference between bagging and boosting.',
                    'How does a Random Forest work? When would you choose it over a single decision tree?',
                    'What is feature engineering? Give examples of useful feature transformations.',
                    'Explain cross-validation and why it\'s important.',
                    'How do you handle imbalanced datasets?',
                ],
            },
            Hard: {
                SDE: [
                    'Design a system to find the median of a stream of integers in O(log n) time.',
                    'Implement a solution for the Word Break II problem. Explain your approach.',
                    'How would you solve the Trapping Rain Water problem? Analyze its complexity.',
                    'Design an algorithm to find the shortest path in a weighted graph with negative edges.',
                    'Implement a concurrent hash map. How do you handle thread safety?',
                    'Solve the Maximum Rectangle in a histogram problem.',
                    'How would you implement a text editor\'s undo/redo functionality efficiently?',
                ],
                Frontend: [
                    'Design a micro-frontend architecture. How do you handle shared state?',
                    'Implement a real-time collaborative editor like Google Docs. What are the challenges?',
                    'How would you build a custom React renderer for a non-DOM target?',
                    'Design a client-side caching strategy for a large-scale SPA.',
                    'How would you implement optimistic UI updates with rollback?',
                ],
                Backend: [
                    'Design a distributed message queue from scratch. How do you ensure exactly-once delivery?',
                    'Explain the CAP theorem with real-world trade-off examples.',
                    'How would you design a database sharding strategy for a billion-user application?',
                    'Implement eventual consistency in a microservices architecture.',
                    'Design a search engine indexing pipeline. What data structures would you use?',
                ],
                DataScience: [
                    'Explain the transformer architecture. How does self-attention work?',
                    'Design an A/B testing framework. How do you determine statistical significance?',
                    'How would you build a recommendation system for a million users?',
                    'Explain LSTM networks and their advantage over vanilla RNNs.',
                    'Design a real-time anomaly detection system.',
                ],
            },
        },
        // Core CS Questions
        Core: {
            Easy: {
                SDE: ['What are the four pillars of OOP? Give examples.', 'Explain the difference between process and thread.', 'What is deadlock? How can it be prevented?', 'Describe the ACID properties of database transactions.', 'What is normalization in DBMS?'],
                Frontend: ['What is the difference between local storage and session storage?', 'How does the browser render a web page?', 'What is CORS and why does it exist?', 'Explain the HTTP request-response cycle.', 'What are cookies and how do they work?'],
                Backend: ['Explain TCP vs UDP. When would you use each?', 'What is DNS and how does it resolve domain names?', 'What are HTTP status codes? Give examples of each category.', 'What is a RESTful API?', 'Explain what HTTPS does differently from HTTP.'],
                DataScience: ['What is a relational database?', 'Explain the map-reduce paradigm.', 'What are the different types of joins in SQL?', 'What is ETL?', 'Explain data normalization vs standardization.'],
            },
            Medium: {
                SDE: ['Explain virtual memory and page replacement algorithms.', 'Describe the different CPU scheduling algorithms.', 'What is a semaphore? How does it differ from a mutex?', 'Explain B-trees and their use in databases.', 'What is garbage collection? Compare different GC strategies.'],
                Frontend: ['How does HTTP/2 differ from HTTP/1.1? What about HTTP/3?', 'Explain service workers and their role in PWAs.', 'What is WebSocket? How does it differ from HTTP polling?', 'How does browser caching work? Explain Cache-Control headers.', 'What is Content Security Policy?'],
                Backend: ['Explain the event loop in Node.js.', 'How does connection pooling work in databases?', 'What is the difference between horizontal and vertical scaling?', 'Explain message queues and their use cases.', 'What is a reverse proxy? How does Nginx work?'],
                DataScience: ['Explain the difference between OLTP and OLAP.', 'What is data warehousing?', 'How does Hadoop work?', 'Explain CAP theorem in the context of distributed data systems.', 'What is Apache Spark and how does it differ from MapReduce?'],
            },
            Hard: {
                SDE: ['Design a garbage collector. What algorithms would you consider?', 'Explain the Raft consensus algorithm.', 'How does a compiler optimize code? Give examples of optimization passes.', 'Explain memory-mapped I/O and its advantages.', 'Describe how a JIT compiler works.'],
                Frontend: ['How would you implement server-side rendering from scratch?', 'Design a browser rendering engine architecture.', 'Explain how V8 engine optimizes JavaScript execution.', 'How does CSS containment improve rendering performance?', 'Design a framework-agnostic state management library.'],
                Backend: ['Design a distributed lock service.', 'Explain Paxos vs Raft. When would you choose each?', 'How would you implement a write-ahead log for crash recovery?', 'Design a multi-region database replication strategy.', 'Explain how LSM trees work in databases like Cassandra.'],
                DataScience: ['Explain the internals of gradient descent optimization.', 'How does federated learning work?', 'Design a real-time feature store for ML models.', 'Explain the theory behind kernel methods in SVMs.', 'How would you design a distributed training pipeline?'],
            },
        },
        'System Design': {
            Easy: {
                SDE: ['Design a URL shortener like bit.ly.', 'How would you design a simple chat application?', 'Design a file storage service like Google Drive.'],
                Frontend: ['Design a responsive dashboard layout system.', 'How would you architect a multi-step form wizard?', 'Design a notification system for a web app.'],
                Backend: ['Design a basic authentication system.', 'How would you design a logging service?', 'Design a cron job scheduler.'],
                DataScience: ['Design a data pipeline for collecting user events.', 'How would you design a simple recommendation engine?', 'Design a dashboard for tracking ML model performance.'],
            },
            Medium: {
                SDE: ['Design Twitter/X. Focus on the timeline feature.', 'How would you design a rate limiter?', 'Design an e-commerce platform focusing on the ordering system.'],
                Frontend: ['Design a design system with theming support.', 'How would you build a drag-and-drop page builder?', 'Design a real-time collaborative document editor.'],
                Backend: ['Design a notification service that supports email, SMS, and push.', 'How would you design a payment processing system?', 'Design an API gateway for a microservices architecture.'],
                DataScience: ['Design an A/B testing platform.', 'How would you design a fraud detection system?', 'Design a search ranking algorithm.'],
            },
            Hard: {
                SDE: ['Design YouTube/Netflix video streaming at scale.', 'How would you design Google Maps?', 'Design a distributed search engine like Google.'],
                Frontend: ['Design a micro-frontend architecture for a large organization.', 'How would you build a browser-based IDE like VS Code?', 'Design a real-time multiplayer game engine in the browser.'],
                Backend: ['Design a globally distributed database.', 'How would you design WhatsApp for 2 billion users?', 'Design a stock trading platform with sub-millisecond latency.'],
                DataScience: ['Design a self-driving car perception pipeline.', 'How would you build a large language model training infrastructure?', 'Design a real-time bidding system for ad tech.'],
            },
        },
    },
    hr: {
        Easy: [
            'Tell me about yourself.',
            'Why do you want to join {company}?',
            'What are your strengths and weaknesses?',
            'Where do you see yourself in 5 years?',
            'Why should we hire you?',
            'Tell me about a time you worked in a team.',
            'How do you handle stress?',
            'What motivates you?',
        ],
        Medium: [
            'Tell me about a time you failed. What did you learn?',
            'How do you handle disagreements with team members?',
            'Describe a situation where you had to meet a tight deadline.',
            'Tell me about a time you showed leadership.',
            'How do you prioritize tasks when everything seems urgent?',
            'Describe a situation where you had to adapt to a major change.',
            'Tell me about a time you went above and beyond.',
            'How do you handle constructive criticism?',
        ],
        Hard: [
            'Tell me about a time you had to make a difficult ethical decision at work.',
            'Describe a situation where you had to influence someone without authority.',
            'How would you handle a situation where your manager asks you to do something you disagree with?',
            'Tell me about a time you had to deliver bad news to a stakeholder.',
            'Describe your approach to resolving a conflict between two senior team members.',
            'How do you handle a project that is failing?',
            'Tell me about a time you took an unpopular decision that turned out right.',
        ],
    },
    puzzles: {
        Easy: [
            'You have 8 balls. One is heavier. You have a balance scale. What is the minimum number of weighings to find the heavier ball?',
            'A farmer has to cross a river with a fox, a chicken, and a sack of grain. How does he do it?',
            'You have two ropes that each take exactly 1 hour to burn. How do you measure 45 minutes?',
            'There are 100 doors, all closed. You make 100 passes. In the kth pass, you toggle every kth door. Which doors are open after 100 passes?',
        ],
        Medium: [
            'You have 25 horses. You can race 5 at a time. What is the minimum number of races needed to find the top 3 fastest?',
            'A bug is at one corner of a cube and wants to reach the opposite corner. What is the shortest path along the surface?',
            'You\'re blindfolded with 100 coins on a table. 10 are heads up. Divide them into 2 groups such that each group has the same number of heads-up coins.',
            'You have a 5-gallon jug and a 3-gallon jug. How do you measure exactly 4 gallons?',
        ],
        Hard: [
            'There are 1000 lockers and 1000 students. Student 1 opens every locker. Student 2 toggles every 2nd locker. Student k toggles every kth. How many lockers are open?',
            'You drop two eggs from a 100-floor building. Find the minimum number of drops to determine the critical floor.',
            'Three ants are at three corners of an equilateral triangle. Each moves toward a random adjacent corner. What\'s the probability they don\'t collide?',
            'You have a 3x3 grid of lights, all off. Pressing a light toggles it and its adjacent lights. How do you turn all lights on?',
        ],
    },
};

// Get questions based on parameters
function pickRandom(arr, count) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, shuffled.length));
}

function generateQuestions(company, role, difficulty) {
    const technicalQuestions = [];
    const hrQuestions = [];
    const puzzleQuestions = [];

    // Role mapping
    const roleKey = role === 'Frontend Developer' ? 'Frontend'
        : role === 'Backend Developer' ? 'Backend'
            : role === 'Data Scientist' ? 'DataScience'
                : 'SDE';

    // Collect technical questions from multiple tags
    const tags = ['DSA', 'Core', 'System Design'];
    for (const tag of tags) {
        const pool = QUESTION_BANK.technical[tag]?.[difficulty]?.[roleKey] || QUESTION_BANK.technical[tag]?.[difficulty]?.SDE || [];
        if (pool.length > 0) {
            const count = tag === 'DSA' ? 3 : 1;
            technicalQuestions.push(...pickRandom(pool, count));
        }
    }

    // Ensure we have exactly 5 technical questions
    while (technicalQuestions.length < 5) {
        const fallbackPool = QUESTION_BANK.technical.DSA[difficulty]?.[roleKey] || QUESTION_BANK.technical.DSA[difficulty]?.SDE || [];
        const remaining = fallbackPool.filter(q => !technicalQuestions.includes(q));
        if (remaining.length > 0) technicalQuestions.push(remaining[Math.floor(Math.random() * remaining.length)]);
        else break;
    }

    // HR questions
    const hrPool = QUESTION_BANK.hr[difficulty] || QUESTION_BANK.hr.Medium;
    hrQuestions.push(...pickRandom(hrPool, 2).map(q => q.replace('{company}', company)));

    // Puzzle
    const puzzlePool = QUESTION_BANK.puzzles[difficulty] || QUESTION_BANK.puzzles.Medium;
    puzzleQuestions.push(...pickRandom(puzzlePool, 1));

    return {
        technical: technicalQuestions.slice(0, 5).map((q, i) => ({
            id: `tech-${i + 1}`,
            question: q,
            type: 'technical',
            tag: i < 3 ? 'DSA' : i < 4 ? 'Core CS' : 'System Design',
        })),
        hr: hrQuestions.map((q, i) => ({
            id: `hr-${i + 1}`,
            question: q,
            type: 'hr',
            tag: 'Behavioral',
        })),
        puzzles: puzzleQuestions.map((q, i) => ({
            id: `puzzle-${i + 1}`,
            question: q,
            type: 'puzzle',
            tag: 'Puzzle',
        })),
    };
}

// @desc    Generate interview questions
// @route   POST /api/interview-gen/generate
const generateInterviewQuestions = async (req, res) => {
    try {
        const { company, role, difficulty } = req.body;

        if (!company || !role || !difficulty) {
            return res.status(400).json({ message: 'Company, role, and difficulty are required' });
        }

        // Also fetch company-specific previous questions if available
        let companyQuestions = [];
        const companyDoc = await CompanyRoadmap.findOne({
            companyName: { $regex: new RegExp(company, 'i') },
        });

        if (companyDoc && companyDoc.previousQuestions?.length > 0) {
            const filtered = companyDoc.previousQuestions.filter(
                pq => pq.difficulty === difficulty || difficulty === 'Medium'
            );
            const pool = filtered.length > 0 ? filtered : companyDoc.previousQuestions;
            companyQuestions = pickRandom(pool, 3).map((pq, i) => ({
                id: `company-${i + 1}`,
                question: pq.question,
                type: 'company-specific',
                tag: pq.tag,
                frequency: pq.frequency,
                source: companyDoc.companyName,
            }));
        }

        const generated = generateQuestions(company, role, difficulty);

        res.json({
            company,
            role,
            difficulty,
            questions: {
                technical: generated.technical,
                hr: generated.hr,
                puzzles: generated.puzzles,
                companySpecific: companyQuestions,
            },
            totalQuestions: generated.technical.length + generated.hr.length + generated.puzzles.length + companyQuestions.length,
            generatedAt: new Date(),
        });
    } catch (error) {
        console.error('Generate questions error:', error);
        res.status(500).json({ message: 'Failed to generate questions' });
    }
};

// @desc    Save generated questions to user profile
// @route   POST /api/interview-gen/save
const User = require('../models/User');

const saveQuestions = async (req, res) => {
    try {
        const { company, role, difficulty, questions } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Initialize savedInterviewSets array if not present
        if (!user.savedInterviewSets) user.savedInterviewSets = [];

        user.savedInterviewSets.push({
            company,
            role,
            difficulty,
            questions,
            savedAt: new Date(),
        });

        // Keep only last 20 sets
        if (user.savedInterviewSets.length > 20) {
            user.savedInterviewSets = user.savedInterviewSets.slice(-20);
        }

        await user.save();
        res.json({ message: 'Questions saved to profile', count: user.savedInterviewSets.length });
    } catch (error) {
        console.error('Save questions error:', error);
        res.status(500).json({ message: 'Failed to save questions' });
    }
};

// @desc    Get saved question sets
// @route   GET /api/interview-gen/saved
const getSavedQuestions = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user.savedInterviewSets || []);
    } catch (error) {
        console.error('Get saved questions error:', error);
        res.status(500).json({ message: 'Failed to fetch saved questions' });
    }
};

module.exports = { generateInterviewQuestions, saveQuestions, getSavedQuestions };

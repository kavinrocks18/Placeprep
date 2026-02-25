const Resource = require('../models/Resource');
const User = require('../models/User');

// @desc    Get all resources
// @route   GET /api/resources
// @access  Public
const getResources = async (req, res) => {
    try {
        const resources = await Resource.find({}).sort({ category: 1, topicName: 1 });
        res.status(200).json(resources);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch resources' });
    }
};

// @desc    Toggle bookmark a resource
// @route   POST /api/resources/bookmark/:id
// @access  Private
const toggleBookmark = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const resourceId = req.params.id;

        const index = user.bookmarkedResources.indexOf(resourceId);
        if (index > -1) {
            user.bookmarkedResources.splice(index, 1);
        } else {
            user.bookmarkedResources.push(resourceId);
        }

        await user.save();
        res.status(200).json({ bookmarks: user.bookmarkedResources });
    } catch (error) {
        res.status(500).json({ message: 'Failed to toggle bookmark' });
    }
};

// @desc    Get user bookmarks
// @route   GET /api/resources/bookmarks
// @access  Private
const getBookmarks = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('bookmarkedResources');
        res.status(200).json({ bookmarks: user.bookmarkedResources });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get bookmarks' });
    }
};

// @desc    Seed resources (Dev only)
// @route   POST /api/resources/seed
// @access  Public
const seedResources = async (req, res) => {
    await Resource.deleteMany({});

    const resources = [
        {
            topicName: 'Arrays',
            description: 'Learn about array data structures, operations, and common interview patterns like sliding window, two pointers, and prefix sums.',
            difficulty: 'Beginner',
            category: 'DSA',
            icon: '📊',
            videoLinks: [
                { title: 'Arrays in Data Structures', url: 'https://www.youtube.com/embed/QJNwK2uJyGs' },
                { title: 'Sliding Window Technique', url: 'https://www.youtube.com/embed/MK-NZ4hN7rs' },
                { title: 'Two Pointer Technique', url: 'https://www.youtube.com/embed/On03HWe2tZM' },
                { title: 'Kadane\'s Algorithm', url: 'https://www.youtube.com/embed/86CQq3pKSUw' },
            ],
        },
        {
            topicName: 'Strings',
            description: 'Master string manipulation, pattern matching, and common algorithms like KMP, Rabin-Karp, and Z-algorithm.',
            difficulty: 'Beginner',
            category: 'DSA',
            icon: '🔤',
            videoLinks: [
                { title: 'String Data Structure', url: 'https://www.youtube.com/embed/9GdesVhtjsY' },
                { title: 'String Matching Algorithms', url: 'https://www.youtube.com/embed/BRO7mVIFt08' },
                { title: 'Anagram & Palindrome Problems', url: 'https://www.youtube.com/embed/xvNwoz-ufXA' },
            ],
        },
        {
            topicName: 'Linked List',
            description: 'Understand singly and doubly linked lists, cycle detection, reversal, merging, and advanced techniques.',
            difficulty: 'Intermediate',
            category: 'DSA',
            icon: '🔗',
            videoLinks: [
                { title: 'Linked List Introduction', url: 'https://www.youtube.com/embed/R9PTBwOzceo' },
                { title: 'Reverse a Linked List', url: 'https://www.youtube.com/embed/iRtLEoL-r-g' },
                { title: 'Cycle Detection (Floyd\'s)', url: 'https://www.youtube.com/embed/gBTe7lFR3vc' },
                { title: 'Merge Two Sorted Lists', url: 'https://www.youtube.com/embed/XIdigk956u0' },
            ],
        },
        {
            topicName: 'Stack',
            description: 'Learn stack operations, applications in expression evaluation, parenthesis matching, and monotonic stack patterns.',
            difficulty: 'Beginner',
            category: 'DSA',
            icon: '📚',
            videoLinks: [
                { title: 'Stack Data Structure', url: 'https://www.youtube.com/embed/bxRVz8zklWM' },
                { title: 'Next Greater Element', url: 'https://www.youtube.com/embed/Du881K7Jtk8' },
                { title: 'Valid Parentheses Problem', url: 'https://www.youtube.com/embed/WTzjTskDFMg' },
            ],
        },
        {
            topicName: 'Queue',
            description: 'Explore queue implementations, circular queue, deque, priority queue, and BFS applications.',
            difficulty: 'Beginner',
            category: 'DSA',
            icon: '🚶',
            videoLinks: [
                { title: 'Queue Data Structure', url: 'https://www.youtube.com/embed/zp6pBNbUB2U' },
                { title: 'Priority Queue & Heaps', url: 'https://www.youtube.com/embed/HqPJF2L5h9U' },
                { title: 'BFS Using Queue', url: 'https://www.youtube.com/embed/oDqjPvD54Ss' },
            ],
        },
        {
            topicName: 'Recursion',
            description: 'Master recursive thinking, base cases, recursion tree, backtracking, and converting recursion to iteration.',
            difficulty: 'Intermediate',
            category: 'DSA',
            icon: '🔄',
            videoLinks: [
                { title: 'Recursion Basics', url: 'https://www.youtube.com/embed/kHi1DUhp9kM' },
                { title: 'Backtracking Explained', url: 'https://www.youtube.com/embed/DKCbsiDBN6c' },
                { title: 'Recursion vs Iteration', url: 'https://www.youtube.com/embed/HXNhEYqFo0o' },
                { title: 'N-Queens Problem', url: 'https://www.youtube.com/embed/i05Ju7AftcM' },
            ],
        },
        {
            topicName: 'Sorting',
            description: 'Compare and implement sorting algorithms: Bubble, Merge, Quick, Heap Sort, and understand time complexities.',
            difficulty: 'Beginner',
            category: 'DSA',
            icon: '📈',
            videoLinks: [
                { title: 'Sorting Algorithms Visualized', url: 'https://www.youtube.com/embed/kPRA0W1kECg' },
                { title: 'Merge Sort Explained', url: 'https://www.youtube.com/embed/4VqmGXwpLqc' },
                { title: 'Quick Sort Algorithm', url: 'https://www.youtube.com/embed/Hoixgm4-P4M' },
            ],
        },
        {
            topicName: 'Trees',
            description: 'Learn binary trees, BST, AVL trees, tree traversals (inorder, preorder, postorder), and tree-based interview problems.',
            difficulty: 'Intermediate',
            category: 'DSA',
            icon: '🌳',
            videoLinks: [
                { title: 'Binary Tree Introduction', url: 'https://www.youtube.com/embed/H5JubkIy_p8' },
                { title: 'Tree Traversals', url: 'https://www.youtube.com/embed/WLvU5EQVZqY' },
                { title: 'Binary Search Tree', url: 'https://www.youtube.com/embed/cySVml6e_Fc' },
                { title: 'Lowest Common Ancestor', url: 'https://www.youtube.com/embed/py3R23aAPCA' },
            ],
        },
        {
            topicName: 'Graphs',
            description: 'Explore graph representations, BFS, DFS, shortest path algorithms (Dijkstra, Bellman-Ford), and topological sort.',
            difficulty: 'Advanced',
            category: 'DSA',
            icon: '🕸️',
            videoLinks: [
                { title: 'Graph Theory Introduction', url: 'https://www.youtube.com/embed/tWVWeAqZ0WU' },
                { title: 'BFS and DFS', url: 'https://www.youtube.com/embed/pcKY4hjDrxk' },
                { title: 'Dijkstra\'s Algorithm', url: 'https://www.youtube.com/embed/pSqmAO-m7Lk' },
                { title: 'Topological Sort', url: 'https://www.youtube.com/embed/dis_c84ejhQ' },
            ],
        },
        {
            topicName: 'DBMS',
            description: 'Database management fundamentals: ER diagrams, normalization, SQL queries, transactions, ACID properties, and indexing.',
            difficulty: 'Intermediate',
            category: 'Core CS',
            icon: '🗄️',
            videoLinks: [
                { title: 'DBMS Complete Course', url: 'https://www.youtube.com/embed/kBdlM6hNDAE' },
                { title: 'SQL Tutorial for Beginners', url: 'https://www.youtube.com/embed/hlGoQC332VM' },
                { title: 'Normalization in DBMS', url: 'https://www.youtube.com/embed/UrYLYV7WSHM' },
            ],
        },
        {
            topicName: 'Operating Systems',
            description: 'Core OS concepts: process management, threading, memory management, deadlocks, scheduling, and file systems.',
            difficulty: 'Intermediate',
            category: 'Core CS',
            icon: '⚙️',
            videoLinks: [
                { title: 'OS Concepts Overview', url: 'https://www.youtube.com/embed/vBURTt97EkA' },
                { title: 'Process vs Thread', url: 'https://www.youtube.com/embed/4rLW7zg21gI' },
                { title: 'Deadlock in OS', url: 'https://www.youtube.com/embed/UVo9mGARkhQ' },
                { title: 'Memory Management', url: 'https://www.youtube.com/embed/p9yZNLeOj4s' },
            ],
        },
        {
            topicName: 'Computer Networks',
            description: 'Networking essentials: OSI model, TCP/IP, HTTP, DNS, subnetting, routing protocols, and network security basics.',
            difficulty: 'Intermediate',
            category: 'Core CS',
            icon: '🌐',
            videoLinks: [
                { title: 'Computer Networks Basics', url: 'https://www.youtube.com/embed/VwN91x5i25g' },
                { title: 'OSI Model Explained', url: 'https://www.youtube.com/embed/vv4y_uOneC0' },
                { title: 'TCP vs UDP', url: 'https://www.youtube.com/embed/uwoD5YsGACg' },
                { title: 'DNS Explained', url: 'https://www.youtube.com/embed/Wj0od2ag5sk' },
            ],
        },
    ];

    await Resource.insertMany(resources);
    res.status(201).json({ message: `${resources.length} resources seeded successfully` });
};

module.exports = { getResources, toggleBookmark, getBookmarks, seedResources };

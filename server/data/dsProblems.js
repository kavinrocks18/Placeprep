const dsProblems = [
    // ═══════════════════════════════════════
    //  LINKED LIST
    // ═══════════════════════════════════════
    {
        title: 'Reverse a Linked List', slug: 'ds-reverse-linked-list', difficulty: 'Easy', category: 'Linked List',
        tags: ['Linked List', 'Recursion'],
        description: 'Given the head of a singly linked list, reverse the list and return the reversed list.',
        constraints: '0 <= number of nodes <= 5000\n-5000 <= Node.val <= 5000',
        examples: [{ input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]', explanation: '' }],
        starterCode: 'function reverseList(head) {\n  // your code here\n}',
        testCases: [
            { input: '[1,2,3,4,5]', output: '[5,4,3,2,1]' },
            { input: '[1,2]', output: '[2,1]' },
            { input: '[]', output: '[]' },
            { input: '[1]', output: '[1]' },
            { input: '[1,2,3]', output: '[3,2,1]' },
        ],
    },
    {
        title: 'Detect Cycle in Linked List', slug: 'ds-detect-cycle', difficulty: 'Easy', category: 'Linked List',
        tags: ['Linked List', 'Two Pointers', 'Floyd\'s Cycle'],
        description: 'Given head of a linked list, determine if the linked list has a cycle. A cycle exists if some node can be reached again by continuously following the next pointer.',
        constraints: '0 <= number of nodes <= 10^4',
        examples: [{ input: 'head = [3,2,0,-4], pos = 1', output: 'true', explanation: 'Tail connects to node at index 1' }],
        starterCode: 'function hasCycle(head) {\n  // your code here\n}',
        testCases: [
            { input: '[3,2,0,-4]\n1', output: 'true' },
            { input: '[1,2]\n0', output: 'true' },
            { input: '[1]\n-1', output: 'false' },
            { input: '[]\n-1', output: 'false' },
            { input: '[1,2,3,4]\n-1', output: 'false' },
        ],
    },
    {
        title: 'Merge Two Sorted Lists', slug: 'ds-merge-sorted-lists', difficulty: 'Easy', category: 'Linked List',
        tags: ['Linked List', 'Recursion'],
        description: 'Merge two sorted linked lists and return it as a sorted list. The list should be made by splicing together the nodes of the first two lists.',
        constraints: '0 <= list length <= 50',
        examples: [{ input: 'l1 = [1,2,4], l2 = [1,3,4]', output: '[1,1,2,3,4,4]', explanation: '' }],
        starterCode: 'function mergeTwoLists(l1, l2) {\n  // your code here\n}',
        testCases: [
            { input: '[1,2,4]\n[1,3,4]', output: '[1,1,2,3,4,4]' },
            { input: '[]\n[]', output: '[]' },
            { input: '[]\n[0]', output: '[0]' },
            { input: '[5]\n[1,2,4]', output: '[1,2,4,5]' },
            { input: '[1,3,5]\n[2,4,6]', output: '[1,2,3,4,5,6]' },
        ],
    },
    {
        title: 'Remove Nth Node From End', slug: 'ds-remove-nth-from-end', difficulty: 'Medium', category: 'Linked List',
        tags: ['Linked List', 'Two Pointers'],
        description: 'Given the head of a linked list, remove the nth node from the end of the list and return its head.',
        constraints: '1 <= sz <= 30\n1 <= n <= sz',
        examples: [{ input: 'head = [1,2,3,4,5], n = 2', output: '[1,2,3,5]', explanation: '' }],
        starterCode: 'function removeNthFromEnd(head, n) {\n  // your code here\n}',
        testCases: [
            { input: '[1,2,3,4,5]\n2', output: '[1,2,3,5]' },
            { input: '[1]\n1', output: '[]' },
            { input: '[1,2]\n1', output: '[1]' },
            { input: '[1,2]\n2', output: '[2]' },
            { input: '[1,2,3]\n3', output: '[2,3]' },
        ],
    },
    {
        title: 'Flatten a Multilevel Doubly Linked List', slug: 'ds-flatten-multilevel-list', difficulty: 'Medium', category: 'Linked List',
        tags: ['Linked List', 'DFS'],
        description: 'You are given a doubly linked list where nodes may have a child pointer pointing to a separate doubly linked list. Flatten it so all nodes appear in a single-level doubly linked list.',
        constraints: '0 <= number of nodes <= 1000',
        examples: [{ input: 'head = [1,2,3,4,5,6,null,null,null,7,8,9,10,null,null,11,12]', output: '[1,2,3,7,8,11,12,9,10,4,5,6]', explanation: '' }],
        starterCode: 'function flatten(head) {\n  // your code here\n}',
        testCases: [
            { input: '[1,2,3,4,5,6,null,null,null,7,8,9,10,null,null,11,12]', output: '[1,2,3,7,8,11,12,9,10,4,5,6]' },
            { input: '[1,2,null,3]', output: '[1,3,2]' },
            { input: '[]', output: '[]' },
            { input: '[1]', output: '[1]' },
            { input: '[1,null,2,null,3]', output: '[1,2,3]' },
        ],
    },
    {
        title: 'Copy List with Random Pointer', slug: 'ds-copy-random-list', difficulty: 'Hard', category: 'Linked List',
        tags: ['Linked List', 'Hash Table'],
        description: 'A linked list is given where each node has an additional random pointer which could point to any node or null. Construct a deep copy of the list.',
        constraints: '0 <= n <= 1000',
        examples: [{ input: 'head = [[7,null],[13,0],[11,4],[10,2],[1,0]]', output: '[[7,null],[13,0],[11,4],[10,2],[1,0]]', explanation: '' }],
        starterCode: 'function copyRandomList(head) {\n  // your code here\n}',
        testCases: [
            { input: '[[7,null],[13,0],[11,4],[10,2],[1,0]]', output: '[[7,null],[13,0],[11,4],[10,2],[1,0]]' },
            { input: '[[1,1],[2,1]]', output: '[[1,1],[2,1]]' },
            { input: '[[3,null],[3,0],[3,null]]', output: '[[3,null],[3,0],[3,null]]' },
            { input: '[]', output: '[]' },
            { input: '[[1,null]]', output: '[[1,null]]' },
        ],
    },

    // ═══════════════════════════════════════
    //  STACK
    // ═══════════════════════════════════════
    {
        title: 'Valid Parentheses', slug: 'ds-valid-parentheses', difficulty: 'Easy', category: 'Stack',
        tags: ['Stack', 'String'],
        description: 'Given a string s containing just the characters ( ) { } [ ], determine if the input string is valid. An input string is valid if open brackets are closed by the same type and in the correct order.',
        constraints: '1 <= s.length <= 10^4',
        examples: [{ input: 's = "()"', output: 'true', explanation: '' }],
        starterCode: 'function isValid(s) {\n  // your code here\n}',
        testCases: [
            { input: '()', output: 'true' },
            { input: '()[]{}', output: 'true' },
            { input: '(]', output: 'false' },
            { input: '([)]', output: 'false' },
            { input: '{[]}', output: 'true' },
        ],
    },
    {
        title: 'Min Stack', slug: 'ds-min-stack', difficulty: 'Medium', category: 'Stack',
        tags: ['Stack', 'Design'],
        description: 'Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.',
        constraints: '-2^31 <= val <= 2^31 - 1',
        examples: [{ input: 'push(-2), push(0), push(-3), getMin(), pop(), top(), getMin()', output: '-3, 0, -2', explanation: '' }],
        starterCode: 'class MinStack {\n  constructor() {\n    // your code here\n  }\n  push(val) {}\n  pop() {}\n  top() {}\n  getMin() {}\n}',
        testCases: [
            { input: 'push(-2),push(0),push(-3),getMin,pop,top,getMin', output: '-3,0,-2' },
            { input: 'push(1),push(2),top,getMin', output: '2,1' },
            { input: 'push(0),push(0),getMin,pop,getMin', output: '0,0' },
            { input: 'push(5),push(3),push(7),getMin', output: '3' },
            { input: 'push(-1),top,getMin', output: '-1,-1' },
        ],
    },
    {
        title: 'Evaluate Reverse Polish Notation', slug: 'ds-eval-rpn', difficulty: 'Medium', category: 'Stack',
        tags: ['Stack', 'Array', 'Math'],
        description: 'Evaluate the value of an arithmetic expression in Reverse Polish Notation. Valid operators are +, -, *, /. Each operand may be an integer or another expression.',
        constraints: '1 <= tokens.length <= 10^4',
        examples: [{ input: 'tokens = ["2","1","+","3","*"]', output: '9', explanation: '((2 + 1) * 3) = 9' }],
        starterCode: 'function evalRPN(tokens) {\n  // your code here\n}',
        testCases: [
            { input: '["2","1","+","3","*"]', output: '9' },
            { input: '["4","13","5","/","+"]', output: '6' },
            { input: '["10","6","9","3","+","-11","*","/","*","17","+","5","+"]', output: '22' },
            { input: '["3"]', output: '3' },
            { input: '["5","1","-"]', output: '4' },
        ],
    },
    {
        title: 'Daily Temperatures', slug: 'ds-daily-temperatures', difficulty: 'Medium', category: 'Stack',
        tags: ['Stack', 'Array', 'Monotonic Stack'],
        description: 'Given an array of integers temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature. If no future day, answer[i] = 0.',
        constraints: '1 <= temperatures.length <= 10^5',
        examples: [{ input: 'temperatures = [73,74,75,71,69,72,76,73]', output: '[1,1,4,2,1,1,0,0]', explanation: '' }],
        starterCode: 'function dailyTemperatures(temperatures) {\n  // your code here\n}',
        testCases: [
            { input: '[73,74,75,71,69,72,76,73]', output: '[1,1,4,2,1,1,0,0]' },
            { input: '[30,40,50,60]', output: '[1,1,1,0]' },
            { input: '[30,60,90]', output: '[1,1,0]' },
            { input: '[90]', output: '[0]' },
            { input: '[55,55,55]', output: '[0,0,0]' },
        ],
    },

    // ═══════════════════════════════════════
    //  QUEUE
    // ═══════════════════════════════════════
    {
        title: 'Implement Queue using Stacks', slug: 'ds-queue-using-stacks', difficulty: 'Easy', category: 'Queue',
        tags: ['Stack', 'Queue', 'Design'],
        description: 'Implement a first-in-first-out (FIFO) queue using only two stacks. The implemented queue should support push, peek, pop, and empty.',
        constraints: '1 <= x <= 9\nAt most 100 calls',
        examples: [{ input: 'push(1), push(2), peek(), pop(), empty()', output: '1, 1, false', explanation: '' }],
        starterCode: 'class MyQueue {\n  constructor() {\n    // your code here\n  }\n  push(x) {}\n  pop() {}\n  peek() {}\n  empty() {}\n}',
        testCases: [
            { input: 'push(1),push(2),peek,pop,empty', output: '1,1,false' },
            { input: 'push(1),pop,empty', output: '1,true' },
            { input: 'push(1),push(2),push(3),pop,pop,pop', output: '1,2,3' },
            { input: 'empty', output: 'true' },
            { input: 'push(5),peek,push(6),peek', output: '5,5' },
        ],
    },
    {
        title: 'Design Circular Queue', slug: 'ds-circular-queue', difficulty: 'Medium', category: 'Queue',
        tags: ['Queue', 'Array', 'Design'],
        description: 'Design a circular queue implementation with a fixed size. It should support: enQueue, deQueue, Front, Rear, isEmpty, isFull.',
        constraints: '1 <= k <= 1000',
        examples: [{ input: 'MyCircularQueue(3), enQueue(1), enQueue(2), enQueue(3), enQueue(4), Rear(), isFull(), deQueue(), enQueue(4), Rear()', output: 'true,true,true,false,3,true,true,true,4', explanation: '' }],
        starterCode: 'class MyCircularQueue {\n  constructor(k) {\n    // your code here\n  }\n  enQueue(value) {}\n  deQueue() {}\n  Front() {}\n  Rear() {}\n  isEmpty() {}\n  isFull() {}\n}',
        testCases: [
            { input: 'MyCircularQueue(3),enQueue(1),enQueue(2),enQueue(3),enQueue(4),Rear,isFull,deQueue,enQueue(4),Rear', output: 'true,true,true,false,3,true,true,true,4' },
            { input: 'MyCircularQueue(1),enQueue(1),deQueue,enQueue(2),Front', output: 'true,true,true,2' },
            { input: 'MyCircularQueue(2),isEmpty', output: 'true' },
            { input: 'MyCircularQueue(2),enQueue(1),enQueue(2),isFull', output: 'true,true,true' },
            { input: 'MyCircularQueue(3),enQueue(1),Front,Rear', output: 'true,1,1' },
        ],
    },

    // ═══════════════════════════════════════
    //  BINARY TREE
    // ═══════════════════════════════════════
    {
        title: 'Inorder Traversal', slug: 'ds-inorder-traversal', difficulty: 'Easy', category: 'Binary Tree',
        tags: ['Tree', 'DFS', 'Stack'],
        description: 'Given the root of a binary tree, return the inorder traversal of its nodes\' values.',
        constraints: '0 <= number of nodes <= 100',
        examples: [{ input: 'root = [1,null,2,3]', output: '[1,3,2]', explanation: '' }],
        starterCode: 'function inorderTraversal(root) {\n  // your code here\n}',
        testCases: [
            { input: '[1,null,2,3]', output: '[1,3,2]' },
            { input: '[]', output: '[]' },
            { input: '[1]', output: '[1]' },
            { input: '[1,2,3,4,5]', output: '[4,2,5,1,3]' },
            { input: '[3,1,2]', output: '[1,3,2]' },
        ],
    },
    {
        title: 'Maximum Depth of Binary Tree', slug: 'ds-max-depth-tree', difficulty: 'Easy', category: 'Binary Tree',
        tags: ['Tree', 'DFS', 'BFS'],
        description: 'Given the root of a binary tree, return its maximum depth. Maximum depth is the number of nodes along the longest path from root to the farthest leaf.',
        constraints: '0 <= number of nodes <= 10^4',
        examples: [{ input: 'root = [3,9,20,null,null,15,7]', output: '3', explanation: '' }],
        starterCode: 'function maxDepth(root) {\n  // your code here\n}',
        testCases: [
            { input: '[3,9,20,null,null,15,7]', output: '3' },
            { input: '[1,null,2]', output: '2' },
            { input: '[]', output: '0' },
            { input: '[0]', output: '1' },
            { input: '[1,2,3,4,null,null,5]', output: '3' },
        ],
    },
    {
        title: 'Symmetric Tree', slug: 'ds-symmetric-tree', difficulty: 'Easy', category: 'Binary Tree',
        tags: ['Tree', 'DFS', 'BFS'],
        description: 'Given the root of a binary tree, check whether it is a mirror of itself (i.e. symmetric around its center).',
        constraints: '1 <= number of nodes <= 1000',
        examples: [{ input: 'root = [1,2,2,3,4,4,3]', output: 'true', explanation: '' }],
        starterCode: 'function isSymmetric(root) {\n  // your code here\n}',
        testCases: [
            { input: '[1,2,2,3,4,4,3]', output: 'true' },
            { input: '[1,2,2,null,3,null,3]', output: 'false' },
            { input: '[1]', output: 'true' },
            { input: '[1,2,2]', output: 'true' },
            { input: '[1,2,3]', output: 'false' },
        ],
    },
    {
        title: 'Lowest Common Ancestor', slug: 'ds-lca-binary-tree', difficulty: 'Medium', category: 'Binary Tree',
        tags: ['Tree', 'DFS'],
        description: 'Given a binary tree, find the lowest common ancestor (LCA) of two given nodes. The LCA of nodes p and q is the lowest node that has both as descendants.',
        constraints: '2 <= number of nodes <= 10^5',
        examples: [{ input: 'root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1', output: '3', explanation: 'LCA of 5 and 1 is 3' }],
        starterCode: 'function lowestCommonAncestor(root, p, q) {\n  // your code here\n}',
        testCases: [
            { input: '[3,5,1,6,2,0,8,null,null,7,4]\n5\n1', output: '3' },
            { input: '[3,5,1,6,2,0,8,null,null,7,4]\n5\n4', output: '5' },
            { input: '[1,2]\n1\n2', output: '1' },
            { input: '[3,5,1]\n5\n1', output: '3' },
            { input: '[1,2,3,4,5]\n4\n5', output: '2' },
        ],
    },
    {
        title: 'Binary Tree Level Order Traversal', slug: 'ds-level-order-traversal', difficulty: 'Medium', category: 'Binary Tree',
        tags: ['Tree', 'BFS'],
        description: 'Given the root of a binary tree, return the level order traversal of its nodes\' values (i.e., from left to right, level by level).',
        constraints: '0 <= number of nodes <= 2000',
        examples: [{ input: 'root = [3,9,20,null,null,15,7]', output: '[[3],[9,20],[15,7]]', explanation: '' }],
        starterCode: 'function levelOrder(root) {\n  // your code here\n}',
        testCases: [
            { input: '[3,9,20,null,null,15,7]', output: '[[3],[9,20],[15,7]]' },
            { input: '[1]', output: '[[1]]' },
            { input: '[]', output: '[]' },
            { input: '[1,2,3,4,5]', output: '[[1],[2,3],[4,5]]' },
            { input: '[1,null,2,null,3]', output: '[[1],[2],[3]]' },
        ],
    },
    {
        title: 'Construct Binary Tree from Preorder and Inorder', slug: 'ds-build-tree-preorder-inorder', difficulty: 'Medium', category: 'Binary Tree',
        tags: ['Tree', 'Array', 'Divide and Conquer'],
        description: 'Given two integer arrays preorder and inorder where preorder is the preorder traversal and inorder is the inorder traversal of the same tree, construct and return the binary tree.',
        constraints: '1 <= preorder.length <= 3000\npreorder.length == inorder.length',
        examples: [{ input: 'preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]', output: '[3,9,20,null,null,15,7]', explanation: '' }],
        starterCode: 'function buildTree(preorder, inorder) {\n  // your code here\n}',
        testCases: [
            { input: '[3,9,20,15,7]\n[9,3,15,20,7]', output: '[3,9,20,null,null,15,7]' },
            { input: '[-1]\n[-1]', output: '[-1]' },
            { input: '[1,2]\n[2,1]', output: '[1,2]' },
            { input: '[1,2,3]\n[2,1,3]', output: '[1,2,3]' },
            { input: '[1,2,4,5,3]\n[4,2,5,1,3]', output: '[1,2,3,4,5]' },
        ],
    },

    // ═══════════════════════════════════════
    //  BST (Binary Search Tree)
    // ═══════════════════════════════════════
    {
        title: 'Validate Binary Search Tree', slug: 'ds-validate-bst', difficulty: 'Medium', category: 'BST',
        tags: ['Tree', 'DFS', 'BST'],
        description: 'Given the root of a binary tree, determine if it is a valid binary search tree. A valid BST means the left subtree has only smaller values and the right subtree has only larger values.',
        constraints: '1 <= number of nodes <= 10^4',
        examples: [{ input: 'root = [2,1,3]', output: 'true', explanation: '' }],
        starterCode: 'function isValidBST(root) {\n  // your code here\n}',
        testCases: [
            { input: '[2,1,3]', output: 'true' },
            { input: '[5,1,4,null,null,3,6]', output: 'false' },
            { input: '[1]', output: 'true' },
            { input: '[2,2,2]', output: 'false' },
            { input: '[5,4,6,null,null,3,7]', output: 'false' },
        ],
    },
    {
        title: 'Kth Smallest Element in BST', slug: 'ds-kth-smallest-bst', difficulty: 'Medium', category: 'BST',
        tags: ['Tree', 'DFS', 'BST'],
        description: 'Given the root of a binary search tree, and an integer k, return the kth smallest value (1-indexed) in the tree.',
        constraints: '1 <= k <= n <= 10^4',
        examples: [{ input: 'root = [3,1,4,null,2], k = 1', output: '1', explanation: '' }],
        starterCode: 'function kthSmallest(root, k) {\n  // your code here\n}',
        testCases: [
            { input: '[3,1,4,null,2]\n1', output: '1' },
            { input: '[5,3,6,2,4,null,null,1]\n3', output: '3' },
            { input: '[1]\n1', output: '1' },
            { input: '[2,1,3]\n2', output: '2' },
            { input: '[3,1,4,null,2]\n4', output: '4' },
        ],
    },

    // ═══════════════════════════════════════
    //  HEAP / PRIORITY QUEUE
    // ═══════════════════════════════════════
    {
        title: 'Kth Largest Element in Array', slug: 'ds-kth-largest', difficulty: 'Medium', category: 'Heap',
        tags: ['Array', 'Heap', 'Sorting', 'Quickselect'],
        description: 'Given an integer array nums and an integer k, return the kth largest element. Note it is the kth largest in sorted order, not the kth distinct.',
        constraints: '1 <= k <= nums.length <= 10^5',
        examples: [{ input: 'nums = [3,2,1,5,6,4], k = 2', output: '5', explanation: '' }],
        starterCode: 'function findKthLargest(nums, k) {\n  // your code here\n}',
        testCases: [
            { input: '[3,2,1,5,6,4]\n2', output: '5' },
            { input: '[3,2,3,1,2,4,5,5,6]\n4', output: '4' },
            { input: '[1]\n1', output: '1' },
            { input: '[7,6,5,4,3,2,1]\n5', output: '3' },
            { input: '[2,1]\n2', output: '1' },
        ],
    },
    {
        title: 'Top K Frequent Elements', slug: 'ds-top-k-frequent', difficulty: 'Medium', category: 'Heap',
        tags: ['Array', 'Hash Table', 'Heap', 'Bucket Sort'],
        description: 'Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.',
        constraints: '1 <= nums.length <= 10^5\n1 <= k <= unique elements',
        examples: [{ input: 'nums = [1,1,1,2,2,3], k = 2', output: '[1,2]', explanation: '' }],
        starterCode: 'function topKFrequent(nums, k) {\n  // your code here\n}',
        testCases: [
            { input: '[1,1,1,2,2,3]\n2', output: '[1,2]' },
            { input: '[1]\n1', output: '[1]' },
            { input: '[4,1,-1,2,-1,2,3]\n2', output: '[-1,2]' },
            { input: '[1,2]\n2', output: '[1,2]' },
            { input: '[5,5,5,5]\n1', output: '[5]' },
        ],
    },
    {
        title: 'Find Median from Data Stream', slug: 'ds-median-data-stream', difficulty: 'Hard', category: 'Heap',
        tags: ['Heap', 'Design', 'Sorting'],
        description: 'Design a data structure that supports adding integers and finding the median of all elements so far. Implement addNum and findMedian.',
        constraints: '-10^5 <= num <= 10^5',
        examples: [{ input: 'addNum(1), addNum(2), findMedian(), addNum(3), findMedian()', output: '1.5, 2.0', explanation: '' }],
        starterCode: 'class MedianFinder {\n  constructor() {\n    // your code here\n  }\n  addNum(num) {}\n  findMedian() {}\n}',
        testCases: [
            { input: 'addNum(1),addNum(2),findMedian,addNum(3),findMedian', output: '1.5,2.0' },
            { input: 'addNum(6),findMedian', output: '6.0' },
            { input: 'addNum(1),addNum(2),addNum(3),addNum(4),findMedian', output: '2.5' },
            { input: 'addNum(-1),addNum(-2),findMedian', output: '-1.5' },
            { input: 'addNum(5),addNum(5),addNum(5),findMedian', output: '5.0' },
        ],
    },

    // ═══════════════════════════════════════
    //  HASH MAP / HASH SET
    // ═══════════════════════════════════════
    {
        title: 'Two Sum (Hash Map)', slug: 'ds-two-sum-hashmap', difficulty: 'Easy', category: 'Hash Map',
        tags: ['Array', 'Hash Table'],
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may not use the same element twice.',
        constraints: '2 <= nums.length <= 10^4',
        examples: [{ input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] = 2 + 7 = 9' }],
        starterCode: 'function twoSum(nums, target) {\n  // your code here\n}',
        testCases: [
            { input: '[2,7,11,15]\n9', output: '[0,1]' },
            { input: '[3,2,4]\n6', output: '[1,2]' },
            { input: '[3,3]\n6', output: '[0,1]' },
            { input: '[1,5,3,7]\n8', output: '[1,2]' },
            { input: '[-1,0,1,2]\n1', output: '[0,2]' },
        ],
    },
    {
        title: 'Group Anagrams', slug: 'ds-group-anagrams', difficulty: 'Medium', category: 'Hash Map',
        tags: ['Array', 'Hash Table', 'String', 'Sorting'],
        description: 'Given an array of strings strs, group the anagrams together. An anagram is a word formed by rearranging the letters of another.',
        constraints: '1 <= strs.length <= 10^4',
        examples: [{ input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]', explanation: '' }],
        starterCode: 'function groupAnagrams(strs) {\n  // your code here\n}',
        testCases: [
            { input: '["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]' },
            { input: '[""]', output: '[[""]]' },
            { input: '["a"]', output: '[["a"]]' },
            { input: '["ab","ba","abc","bca","cab"]', output: '[["ab","ba"],["abc","bca","cab"]]' },
            { input: '["",""]', output: '[["",""]]' },
        ],
    },
    {
        title: 'Design HashMap', slug: 'ds-design-hashmap', difficulty: 'Easy', category: 'Hash Map',
        tags: ['Hash Table', 'Design'],
        description: 'Design a HashMap without using any built-in hash table libraries. Implement put, get, and remove functions.',
        constraints: '0 <= key, value <= 10^6',
        examples: [{ input: 'put(1,1), put(2,2), get(1), get(3), put(2,1), get(2), remove(2), get(2)', output: '1,-1,1,-1', explanation: '' }],
        starterCode: 'class MyHashMap {\n  constructor() {\n    // your code here\n  }\n  put(key, value) {}\n  get(key) {}\n  remove(key) {}\n}',
        testCases: [
            { input: 'put(1,1),put(2,2),get(1),get(3),put(2,1),get(2),remove(2),get(2)', output: '1,-1,1,-1' },
            { input: 'put(1,100),get(1)', output: '100' },
            { input: 'get(5)', output: '-1' },
            { input: 'put(1,1),remove(1),get(1)', output: '-1' },
            { input: 'put(1,1),put(1,2),get(1)', output: '2' },
        ],
    },

    // ═══════════════════════════════════════
    //  GRAPH
    // ═══════════════════════════════════════
    {
        title: 'Number of Islands', slug: 'ds-number-of-islands', difficulty: 'Medium', category: 'Graph',
        tags: ['Array', 'DFS', 'BFS', 'Union Find', 'Matrix'],
        description: 'Given an m x n 2D grid map of 1s (land) and 0s (water), return the number of islands. An island is surrounded by water and formed by connecting adjacent lands horizontally or vertically.',
        constraints: 'm == grid.length\nn == grid[i].length\n1 <= m, n <= 300',
        examples: [{ input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', output: '3', explanation: '' }],
        starterCode: 'function numIslands(grid) {\n  // your code here\n}',
        testCases: [
            { input: '[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', output: '1' },
            { input: '[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', output: '3' },
            { input: '[["0"]]', output: '0' },
            { input: '[["1"]]', output: '1' },
            { input: '[["1","0","1"],["0","1","0"],["1","0","1"]]', output: '5' },
        ],
    },
    {
        title: 'Clone Graph', slug: 'ds-clone-graph', difficulty: 'Medium', category: 'Graph',
        tags: ['Graph', 'BFS', 'DFS', 'Hash Table'],
        description: 'Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph.',
        constraints: '1 <= number of nodes <= 100',
        examples: [{ input: 'adjList = [[2,4],[1,3],[2,4],[1,3]]', output: '[[2,4],[1,3],[2,4],[1,3]]', explanation: '' }],
        starterCode: 'function cloneGraph(node) {\n  // your code here\n}',
        testCases: [
            { input: '[[2,4],[1,3],[2,4],[1,3]]', output: '[[2,4],[1,3],[2,4],[1,3]]' },
            { input: '[[]]', output: '[[]]' },
            { input: '[]', output: '[]' },
            { input: '[[2],[1]]', output: '[[2],[1]]' },
            { input: '[[2,3],[1,3],[1,2]]', output: '[[2,3],[1,3],[1,2]]' },
        ],
    },
    {
        title: 'Course Schedule (Cycle Detection)', slug: 'ds-course-schedule', difficulty: 'Medium', category: 'Graph',
        tags: ['Graph', 'DFS', 'BFS', 'Topological Sort'],
        description: 'There are numCourses courses you have to take. Some courses have prerequisites. Determine if it is possible to finish all courses (i.e. no cycle in prerequisite graph).',
        constraints: '1 <= numCourses <= 2000',
        examples: [{ input: 'numCourses = 2, prerequisites = [[1,0]]', output: 'true', explanation: 'Take course 0, then 1' }],
        starterCode: 'function canFinish(numCourses, prerequisites) {\n  // your code here\n}',
        testCases: [
            { input: '2\n[[1,0]]', output: 'true' },
            { input: '2\n[[1,0],[0,1]]', output: 'false' },
            { input: '1\n[]', output: 'true' },
            { input: '3\n[[1,0],[2,1]]', output: 'true' },
            { input: '4\n[[0,1],[1,2],[2,3],[3,1]]', output: 'false' },
        ],
    },
    {
        title: 'Dijkstra Shortest Path', slug: 'ds-dijkstra-shortest-path', difficulty: 'Medium', category: 'Graph',
        tags: ['Graph', 'Heap', 'Shortest Path'],
        description: 'Given a graph of n nodes and weighted edges, find the shortest path from node 0 to all other nodes. Return an array of shortest distances (-1 if unreachable).',
        constraints: '1 <= n <= 10^4',
        examples: [{ input: 'n = 4, edges = [[0,1,1],[0,2,4],[1,2,2],[2,3,1]], source = 0', output: '[0,1,3,4]', explanation: '0→1 = 1, 0→1→2 = 3, 0→1→2→3 = 4' }],
        starterCode: 'function dijkstra(n, edges, source) {\n  // your code here\n}',
        testCases: [
            { input: '4\n[[0,1,1],[0,2,4],[1,2,2],[2,3,1]]\n0', output: '[0,1,3,4]' },
            { input: '3\n[[0,1,5],[1,2,3]]\n0', output: '[0,5,8]' },
            { input: '2\n[]\n0', output: '[0,-1]' },
            { input: '1\n[]\n0', output: '[0]' },
            { input: '3\n[[0,1,1],[0,2,10],[1,2,2]]\n0', output: '[0,1,3]' },
        ],
    },

    // ═══════════════════════════════════════
    //  TRIE
    // ═══════════════════════════════════════
    {
        title: 'Implement Trie (Prefix Tree)', slug: 'ds-implement-trie', difficulty: 'Medium', category: 'Trie',
        tags: ['Trie', 'String', 'Design'],
        description: 'Implement a trie with insert, search, and startsWith methods.',
        constraints: '1 <= word.length, prefix.length <= 2000',
        examples: [{ input: 'insert("apple"), search("apple"), search("app"), startsWith("app"), insert("app"), search("app")', output: 'true,false,true,true', explanation: '' }],
        starterCode: 'class Trie {\n  constructor() {\n    // your code here\n  }\n  insert(word) {}\n  search(word) {}\n  startsWith(prefix) {}\n}',
        testCases: [
            { input: 'insert(apple),search(apple),search(app),startsWith(app),insert(app),search(app)', output: 'true,false,true,true' },
            { input: 'insert(hello),search(hello),search(hell)', output: 'true,false' },
            { input: 'startsWith(a)', output: 'false' },
            { input: 'insert(abc),insert(abd),search(abc),search(abd)', output: 'true,true' },
            { input: 'insert(a),search(a),startsWith(a)', output: 'true,true' },
        ],
    },
    {
        title: 'Design Add and Search Words', slug: 'ds-word-dictionary', difficulty: 'Medium', category: 'Trie',
        tags: ['Trie', 'String', 'DFS', 'Design'],
        description: 'Design a data structure that supports adding new words and finding if a string matches any previously added string. The search word may contain dots "." which can match any letter.',
        constraints: '1 <= word.length <= 25',
        examples: [{ input: 'addWord("bad"), addWord("dad"), search("pad"), search(".ad"), search("b..")', output: 'false,true,true', explanation: '' }],
        starterCode: 'class WordDictionary {\n  constructor() {\n    // your code here\n  }\n  addWord(word) {}\n  search(word) {}\n}',
        testCases: [
            { input: 'addWord(bad),addWord(dad),addWord(mad),search(pad),search(bad),search(.ad),search(b..)', output: 'false,true,true,true' },
            { input: 'addWord(a),search(.)', output: 'true' },
            { input: 'addWord(abc),search(a.c),search(..c)', output: 'true,true' },
            { input: 'search(abc)', output: 'false' },
            { input: 'addWord(at),addWord(and),search(a),search(.at)', output: 'false,false' },
        ],
    },

    // ═══════════════════════════════════════
    //  ARRAY / MATRIX
    // ═══════════════════════════════════════
    {
        title: 'Rotate Matrix 90 Degrees', slug: 'ds-rotate-matrix', difficulty: 'Medium', category: 'Array',
        tags: ['Array', 'Matrix', 'Math'],
        description: 'You are given an n x n 2D matrix representing an image. Rotate the image by 90 degrees clockwise. You must rotate in place.',
        constraints: 'n == matrix.length == matrix[i].length\n1 <= n <= 20',
        examples: [{ input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]', output: '[[7,4,1],[8,5,2],[9,6,3]]', explanation: '' }],
        starterCode: 'function rotate(matrix) {\n  // your code here\n}',
        testCases: [
            { input: '[[1,2,3],[4,5,6],[7,8,9]]', output: '[[7,4,1],[8,5,2],[9,6,3]]' },
            { input: '[[1,2],[3,4]]', output: '[[3,1],[4,2]]' },
            { input: '[[1]]', output: '[[1]]' },
            { input: '[[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]', output: '[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]' },
            { input: '[[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16]]', output: '[[13,9,5,1],[14,10,6,2],[15,11,7,3],[16,12,8,4]]' },
        ],
    },
    {
        title: 'Spiral Matrix', slug: 'ds-spiral-matrix', difficulty: 'Medium', category: 'Array',
        tags: ['Array', 'Matrix', 'Simulation'],
        description: 'Given an m x n matrix, return all elements of the matrix in spiral order.',
        constraints: 'm == matrix.length\nn == matrix[i].length\n1 <= m, n <= 10',
        examples: [{ input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]', output: '[1,2,3,6,9,8,7,4,5]', explanation: '' }],
        starterCode: 'function spiralOrder(matrix) {\n  // your code here\n}',
        testCases: [
            { input: '[[1,2,3],[4,5,6],[7,8,9]]', output: '[1,2,3,6,9,8,7,4,5]' },
            { input: '[[1,2,3,4],[5,6,7,8],[9,10,11,12]]', output: '[1,2,3,4,8,12,11,10,9,5,6,7]' },
            { input: '[[1]]', output: '[1]' },
            { input: '[[1,2],[3,4]]', output: '[1,2,4,3]' },
            { input: '[[1,2,3]]', output: '[1,2,3]' },
        ],
    },

    // ═══════════════════════════════════════
    //  UNION FIND
    // ═══════════════════════════════════════
    {
        title: 'Implement Union Find', slug: 'ds-union-find', difficulty: 'Medium', category: 'Union Find',
        tags: ['Union Find', 'Design', 'Graph'],
        description: 'Implement a Union-Find (Disjoint Set Union) data structure that supports union and find operations with path compression and union by rank.',
        constraints: '1 <= n <= 10^5',
        examples: [{ input: 'n=5, union(0,1), union(2,3), find(0)==find(1), find(0)==find(2), union(1,3), find(0)==find(3)', output: 'true,false,true', explanation: '' }],
        starterCode: 'class UnionFind {\n  constructor(n) {\n    // your code here\n  }\n  find(x) {}\n  union(x, y) {}\n  connected(x, y) {}\n}',
        testCases: [
            { input: '5\nunion(0,1),union(2,3),connected(0,1),connected(0,2),union(1,3),connected(0,3)', output: 'true,false,true' },
            { input: '3\nconnected(0,1),union(0,1),connected(0,1)', output: 'false,true' },
            { input: '1\nfind(0)', output: '0' },
            { input: '4\nunion(0,1),union(1,2),union(2,3),connected(0,3)', output: 'true' },
            { input: '3\nunion(0,2),connected(0,1),connected(0,2)', output: 'false,true' },
        ],
    },
];

module.exports = dsProblems;

import { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/axios';
import { motion } from 'framer-motion';
import {
    Layers, Search, Filter, ChevronRight, ChevronDown, ChevronUp,
    CheckCircle, Circle, Database,
    Binary, GitBranch, Hash, Network, Boxes, TreeDeciduous, LayoutList
} from 'lucide-react';

const CATEGORY_ICONS = {
    'Linked List': LayoutList,
    'Stack': Layers,
    'Queue': Boxes,
    'Binary Tree': TreeDeciduous,
    'BST': GitBranch,
    'Heap': Database,
    'Hash Map': Hash,
    'Graph': Network,
    'Trie': Binary,
    'Array': Layers,
    'Union Find': GitBranch,
};

const CATEGORY_COLORS = {
    'Linked List': 'from-blue-500/15 to-blue-600/5 border-blue-500/20 text-blue-400',
    'Stack': 'from-amber-500/15 to-amber-600/5 border-amber-500/20 text-amber-400',
    'Queue': 'from-purple-500/15 to-purple-600/5 border-purple-500/20 text-purple-400',
    'Binary Tree': 'from-emerald-500/15 to-emerald-600/5 border-emerald-500/20 text-emerald-400',
    'BST': 'from-cyan-500/15 to-cyan-600/5 border-cyan-500/20 text-cyan-400',
    'Heap': 'from-rose-500/15 to-rose-600/5 border-rose-500/20 text-rose-400',
    'Hash Map': 'from-indigo-500/15 to-indigo-600/5 border-indigo-500/20 text-indigo-400',
    'Graph': 'from-orange-500/15 to-orange-600/5 border-orange-500/20 text-orange-400',
    'Trie': 'from-teal-500/15 to-teal-600/5 border-teal-500/20 text-teal-400',
    'Array': 'from-lime-500/15 to-lime-600/5 border-lime-500/20 text-lime-400',
    'Union Find': 'from-pink-500/15 to-pink-600/5 border-pink-500/20 text-pink-400',
};

const DataStructures = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedDifficulty, setSelectedDifficulty] = useState('All');
    const [diffDropdownOpen, setDiffDropdownOpen] = useState(false);
    const diffDropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (diffDropdownRef.current && !diffDropdownRef.current.contains(e.target)) {
                setDiffDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const { data } = await api.get('/ds');
                setQuestions(data);
            } catch (error) {
                console.error('Error fetching DS questions:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, []);

    const categories = useMemo(() => {
        const cats = [...new Set(questions.map(q => q.category))];
        return ['All', ...cats.sort()];
    }, [questions]);

    const difficultyCounts = useMemo(() => ({
        Easy: questions.filter(q => q.difficulty === 'Easy').length,
        Medium: questions.filter(q => q.difficulty === 'Medium').length,
        Hard: questions.filter(q => q.difficulty === 'Hard').length,
    }), [questions]);

    const filteredQuestions = useMemo(() => {
        return questions.filter(q => {
            const matchSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                q.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchCategory = selectedCategory === 'All' || q.category === selectedCategory;
            const matchDifficulty = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
            return matchSearch && matchCategory && matchDifficulty;
        });
    }, [questions, searchQuery, selectedCategory, selectedDifficulty]);

    const getDifficultyStyle = (diff) => {
        switch (diff) {
            case 'Easy': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'Medium': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'Hard': return 'bg-red-500/10 text-red-400 border-red-500/20';
            default: return '';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto animate-fade-in-up">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/10">
                        <Database className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Data Structures</h1>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            Master core data structures with hands-on coding problems
                        </p>
                    </div>
                </div>
            </div>

            {/* Category Cards */}
            <div className="mb-6">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Categories</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    {categories.map(cat => {
                        const Icon = CATEGORY_ICONS[cat] || Layers;
                        const colors = CATEGORY_COLORS[cat] || 'from-gray-500/15 to-gray-600/5 border-gray-500/20 text-gray-400';
                        const count = cat === 'All' ? questions.length : questions.filter(q => q.category === cat).length;

                        return (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`p-3 rounded-xl border text-left transition-all duration-200 ${selectedCategory === cat
                                    ? `bg-gradient-to-br ${colors} ring-1 ring-current`
                                    : 'bg-card border-border/30 hover:border-border/50'
                                    }`}
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    {cat !== 'All' && <Icon className="h-3.5 w-3.5" />}
                                    <span className="text-xs font-semibold truncate">{cat}</span>
                                </div>
                                <div className={`text-lg font-bold ${selectedCategory !== cat ? 'text-foreground' : ''}`}>
                                    {count}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Search + Difficulty Dropdown Row */}
            <div className="flex gap-3 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search problems by title or tag..."
                        className="w-full pl-10 pr-4 py-3 bg-card border border-border/30 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/40 transition-all placeholder:text-muted-foreground/40"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground/50 bg-accent/30 px-2 py-0.5 rounded">
                        {filteredQuestions.length}
                    </span>
                </div>
                <div className="relative" ref={diffDropdownRef}>
                    <button
                        onClick={() => setDiffDropdownOpen(!diffDropdownOpen)}
                        className="flex items-center gap-2 px-4 py-3 bg-card border border-border/30 rounded-xl text-sm font-medium cursor-pointer min-w-[160px] justify-between hover:border-border/50 transition-all"
                    >
                        <span>{selectedDifficulty === 'All' ? 'All Difficulty' : selectedDifficulty}</span>
                        {diffDropdownOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                    </button>
                    {diffDropdownOpen && (
                        <div className="absolute top-full left-0 mt-1 w-full bg-[#1a1a1e] border border-border/30 rounded-xl overflow-hidden z-50 shadow-xl shadow-black/40">
                            {[{ label: 'All Difficulty', value: 'All' }, { label: 'Easy', value: 'Easy' }, { label: 'Medium', value: 'Medium' }, { label: 'Hard', value: 'Hard' }].map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => { setSelectedDifficulty(opt.value); setDiffDropdownOpen(false); }}
                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${selectedDifficulty === opt.value
                                            ? 'text-primary bg-primary/10 font-medium'
                                            : 'text-foreground hover:bg-accent/20'
                                        }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Problem List */}
            <div className="space-y-2">
                {filteredQuestions.length === 0 ? (
                    <div className="text-center py-16">
                        <Filter className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
                        <p className="text-muted-foreground text-sm">No problems match your filters.</p>
                    </div>
                ) : (
                    filteredQuestions.map((q, idx) => {
                        const catColors = CATEGORY_COLORS[q.category] || '';
                        return (
                            <motion.div
                                key={q._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2, delay: idx * 0.015 }}
                            >
                                <Link
                                    to={`/ds/${q.slug}`}
                                    className="group flex items-center gap-4 p-4 bg-card border border-border/30 rounded-xl hover:border-primary/25 hover:bg-accent/15 transition-all duration-200"
                                >
                                    {/* Number */}
                                    <span className="text-xs font-mono text-muted-foreground/40 w-6 text-center flex-shrink-0">
                                        {idx + 1}
                                    </span>

                                    {/* Status icon */}
                                    <Circle className="h-4 w-4 text-muted-foreground/20 flex-shrink-0" />

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-sm font-semibold group-hover:text-primary transition-colors truncate">
                                                {q.title}
                                            </h3>
                                        </div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium border ${getDifficultyStyle(q.difficulty)}`}>
                                                {q.difficulty}
                                            </span>
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium bg-gradient-to-r ${catColors.split(' ').slice(0, 2).join(' ')} border ${catColors.split(' ').find(c => c.startsWith('border'))}`}>
                                                {q.category}
                                            </span>
                                            {q.tags?.slice(0, 2).map(tag => (
                                                <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-accent/30 text-muted-foreground/60 border border-border/15">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Arrow */}
                                    <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary transition-colors flex-shrink-0" />
                                </Link>
                            </motion.div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default DataStructures;

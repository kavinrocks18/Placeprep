import { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Brain, Search, ChevronRight, ChevronDown, ChevronUp, Circle,
    Calculator, BookOpen, BarChart3, Lightbulb, Filter,
    Play, ExternalLink
} from 'lucide-react';

const CATEGORY_CONFIG = {
    'Quantitative': { icon: Calculator, accent: 'blue', gradient: 'from-blue-500/15 to-blue-600/5', border: 'border-blue-500/20', text: 'text-blue-400', bg: 'bg-blue-500', ring: 'ring-blue-500/30' },
    'Logical Reasoning': { icon: Lightbulb, accent: 'amber', gradient: 'from-amber-500/15 to-amber-600/5', border: 'border-amber-500/20', text: 'text-amber-400', bg: 'bg-amber-500', ring: 'ring-amber-500/30' },
    'Verbal': { icon: BookOpen, accent: 'emerald', gradient: 'from-emerald-500/15 to-emerald-600/5', border: 'border-emerald-500/20', text: 'text-emerald-400', bg: 'bg-emerald-500', ring: 'ring-emerald-500/30' },
    'Data Interpretation': { icon: BarChart3, accent: 'purple', gradient: 'from-purple-500/15 to-purple-600/5', border: 'border-purple-500/20', text: 'text-purple-400', bg: 'bg-purple-500', ring: 'ring-purple-500/30' },
};

const REFERENCE_VIDEOS = {
    'Quantitative': [
        { title: 'Percentage Tricks & Shortcuts', channel: 'YouTube', url: 'https://www.youtube.com/results?search_query=percentage+tricks+shortcuts+aptitude+placement' },
        { title: 'Profit & Loss — All Concepts', channel: 'YouTube', url: 'https://www.youtube.com/results?search_query=profit+and+loss+aptitude+tricks+placement+preparation' },
        { title: 'Time, Speed & Distance Made Easy', channel: 'YouTube', url: 'https://www.youtube.com/results?search_query=time+speed+distance+aptitude+tricks+placement' },
        { title: 'Time & Work — Complete Tutorial', channel: 'YouTube', url: 'https://www.youtube.com/results?search_query=time+and+work+aptitude+tricks+placement+preparation' },
        { title: 'Ratio & Proportion in One Shot', channel: 'YouTube', url: 'https://www.youtube.com/results?search_query=ratio+and+proportion+aptitude+placement+tricks' },
        { title: 'Probability & Combinatorics', channel: 'YouTube', url: 'https://www.youtube.com/results?search_query=probability+combinatorics+aptitude+placement+preparation' },
    ],
    'Logical Reasoning': [
        { title: 'Number Series — Pattern Tricks', channel: 'YouTube', url: 'https://www.youtube.com/results?search_query=number+series+pattern+tricks+logical+reasoning+placement' },
        { title: 'Coding & Decoding — All Types', channel: 'YouTube', url: 'https://www.youtube.com/results?search_query=coding+and+decoding+reasoning+tricks+placement' },
        { title: 'Blood Relations Made Simple', channel: 'YouTube', url: 'https://www.youtube.com/results?search_query=blood+relations+logical+reasoning+tricks+placement' },
        { title: 'Seating Arrangement Masterclass', channel: 'YouTube', url: 'https://www.youtube.com/results?search_query=seating+arrangement+puzzles+reasoning+placement' },
        { title: 'Syllogism — Venn Diagram Method', channel: 'YouTube', url: 'https://www.youtube.com/results?search_query=syllogism+venn+diagram+tricks+logical+reasoning' },
        { title: 'Direction Sense & Ranking', channel: 'YouTube', url: 'https://www.youtube.com/results?search_query=direction+sense+ranking+reasoning+placement+tricks' },
    ],
    'Verbal': [
        { title: 'Complete English Grammar', channel: 'YouTube', url: 'https://www.youtube.com/results?search_query=english+grammar+complete+tutorial+placement+preparation' },
        { title: 'Sentence Correction Techniques', channel: 'YouTube', url: 'https://www.youtube.com/results?search_query=sentence+correction+verbal+ability+placement+tricks' },
        { title: 'Reading Comprehension Strategies', channel: 'YouTube', url: 'https://www.youtube.com/results?search_query=reading+comprehension+tricks+placement+aptitude' },
        { title: 'Vocabulary Building Tips', channel: 'YouTube', url: 'https://www.youtube.com/results?search_query=vocabulary+building+tips+placement+exam+preparation' },
        { title: 'Idioms & Phrases for Placements', channel: 'YouTube', url: 'https://www.youtube.com/results?search_query=idioms+and+phrases+verbal+ability+placement' },
    ],
    'Data Interpretation': [
        { title: 'Bar & Line Charts — DI Practice', channel: 'YouTube', url: 'https://www.youtube.com/results?search_query=bar+chart+line+chart+data+interpretation+aptitude' },
        { title: 'Pie Chart Questions Solved', channel: 'YouTube', url: 'https://www.youtube.com/results?search_query=pie+chart+data+interpretation+tricks+placement' },
        { title: 'Table-Based DI — Quick Tricks', channel: 'YouTube', url: 'https://www.youtube.com/results?search_query=table+data+interpretation+tricks+aptitude+placement' },
        { title: 'Data Interpretation Full Course', channel: 'YouTube', url: 'https://www.youtube.com/results?search_query=data+interpretation+full+course+aptitude+placement' },
    ],
};

const getDifficultyStyle = (diff) => {
    switch (diff) {
        case 'Easy': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
        case 'Medium': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
        case 'Hard': return 'bg-red-500/10 text-red-400 border-red-500/20';
        default: return '';
    }
};

const Aptitude = () => {
    const [questions, setQuestions] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedDifficulty, setSelectedDifficulty] = useState('All');
    const [expandedTopics, setExpandedTopics] = useState({});
    const [diffDropdownOpen, setDiffDropdownOpen] = useState(false);
    const diffDropdownRef = useRef(null);

    // Close dropdown on outside click
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
        const fetchData = async () => {
            try {
                const [qRes, cRes] = await Promise.all([
                    api.get('/aptitude'),
                    api.get('/aptitude/categories'),
                ]);
                setQuestions(qRes.data);
                setCategoryData(cRes.data);

                // Auto-expand all topics initially
                const expanded = {};
                cRes.data.forEach(cat => {
                    cat.topics.forEach(t => {
                        expanded[`${cat.category}|${t.topic}`] = true;
                    });
                });
                setExpandedTopics(expanded);
            } catch (error) {
                console.error('Error fetching aptitude data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const difficultyCounts = useMemo(() => ({
        Easy: questions.filter(q => q.difficulty === 'Easy').length,
        Medium: questions.filter(q => q.difficulty === 'Medium').length,
        Hard: questions.filter(q => q.difficulty === 'Hard').length,
    }), [questions]);

    const filteredQuestions = useMemo(() => {
        return questions.filter(q => {
            const matchSearch = !searchQuery || q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                q.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchCategory = selectedCategory === 'All' || q.category === selectedCategory;
            const matchDifficulty = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
            return matchSearch && matchCategory && matchDifficulty;
        });
    }, [questions, searchQuery, selectedCategory, selectedDifficulty]);

    // Group filtered questions by category → topic
    const groupedQuestions = useMemo(() => {
        const groups = {};
        filteredQuestions.forEach(q => {
            if (!groups[q.category]) groups[q.category] = {};
            if (!groups[q.category][q.topic]) groups[q.category][q.topic] = [];
            groups[q.category][q.topic].push(q);
        });
        return groups;
    }, [filteredQuestions]);

    const toggleTopic = (key) => {
        setExpandedTopics(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const categoryOrder = ['Quantitative', 'Logical Reasoning', 'Verbal', 'Data Interpretation'];

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
                        <Brain className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Aptitude Practice</h1>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            {questions.length} problems · {categoryData.length} categories · {categoryData.reduce((s, c) => s + c.topics.length, 0)} topics
                        </p>
                    </div>
                </div>
            </div>

            {/* Category Filter Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                <button
                    onClick={() => setSelectedCategory('All')}
                    className={`p-4 rounded-xl border text-left transition-all duration-200 ${selectedCategory === 'All'
                        ? 'bg-gradient-to-br from-primary/15 to-primary/5 border-primary/20 text-primary ring-1 ring-primary/30'
                        : 'bg-card border-border/30 hover:border-border/50'
                        }`}
                >
                    <div className="text-xs font-semibold mb-1">All Topics</div>
                    <div className="text-xl font-bold">{questions.length}</div>
                </button>
                {categoryOrder.map(catName => {
                    const config = CATEGORY_CONFIG[catName];
                    const catData = categoryData.find(c => c.category === catName);
                    if (!catData || !config) return null;
                    const Icon = config.icon;
                    return (
                        <button
                            key={catName}
                            onClick={() => setSelectedCategory(selectedCategory === catName ? 'All' : catName)}
                            className={`p-4 rounded-xl border text-left transition-all duration-200 ${selectedCategory === catName
                                ? `bg-gradient-to-br ${config.gradient} ${config.border} ${config.text} ring-1 ${config.ring}`
                                : 'bg-card border-border/30 hover:border-border/50'
                                }`}
                        >
                            <div className="flex items-center gap-1.5 mb-1">
                                <Icon className="h-3.5 w-3.5" />
                                <span className="text-xs font-semibold truncate">{catName}</span>
                            </div>
                            <div className={`text-xl font-bold ${selectedCategory !== catName ? 'text-foreground' : ''}`}>
                                {catData.totalCount}
                            </div>
                            <div className="text-[10px] text-muted-foreground/60 mt-0.5">
                                {catData.topics.length} topics
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Search + Difficulty Dropdown Row */}
            <div className="flex gap-3 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by title or tag..."
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

            {/* Topic-Grouped Problem List */}
            {Object.keys(groupedQuestions).length === 0 ? (
                <div className="text-center py-16">
                    <Filter className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">No problems match your filters.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {categoryOrder.filter(cat => groupedQuestions[cat]).map(catName => {
                        const config = CATEGORY_CONFIG[catName];
                        const Icon = config.icon;
                        const topics = groupedQuestions[catName];

                        return (
                            <div key={catName}>
                                {/* Category Header */}
                                <div className="flex items-center gap-3 mb-3">
                                    <div className={`p-1.5 rounded-lg bg-gradient-to-br ${config.gradient} ${config.border} border`}>
                                        <Icon className={`h-4 w-4 ${config.text}`} />
                                    </div>
                                    <h2 className={`text-lg font-bold ${config.text}`}>{catName}</h2>
                                    <span className="text-xs text-muted-foreground bg-accent/30 px-2 py-0.5 rounded-full">
                                        {Object.values(topics).reduce((s, arr) => s + arr.length, 0)} problems
                                    </span>
                                </div>

                                {/* Topics */}
                                <div className="space-y-2 ml-2">
                                    {Object.entries(topics).map(([topicName, topicProblems]) => {
                                        const topicKey = `${catName}|${topicName}`;
                                        const isExpanded = expandedTopics[topicKey];
                                        const easy = topicProblems.filter(p => p.difficulty === 'Easy').length;
                                        const med = topicProblems.filter(p => p.difficulty === 'Medium').length;
                                        const hard = topicProblems.filter(p => p.difficulty === 'Hard').length;

                                        return (
                                            <div key={topicKey} className="bg-card border border-border/30 rounded-xl overflow-hidden">
                                                {/* Topic Header (collapsible) */}
                                                <button
                                                    onClick={() => toggleTopic(topicKey)}
                                                    className="w-full flex items-center justify-between p-3.5 hover:bg-accent/10 transition-colors"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <ChevronDown
                                                            className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isExpanded ? '' : '-rotate-90'
                                                                }`}
                                                        />
                                                        <span className="text-sm font-semibold">{topicName}</span>
                                                        <span className="text-[10px] text-muted-foreground bg-accent/30 px-1.5 py-0.5 rounded">
                                                            {topicProblems.length}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {easy > 0 && <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{easy} Easy</span>}
                                                        {med > 0 && <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">{med} Med</span>}
                                                        {hard > 0 && <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">{hard} Hard</span>}
                                                    </div>
                                                </button>

                                                {/* Topic Problems */}
                                                <AnimatePresence>
                                                    {isExpanded && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="border-t border-border/20"
                                                        >
                                                            <div className="divide-y divide-border/15">
                                                                {topicProblems.map((q, idx) => (
                                                                    <Link
                                                                        key={q._id}
                                                                        to={`/aptitude/${q.slug}`}
                                                                        className="group flex items-center gap-3 px-4 py-3 hover:bg-accent/10 transition-colors"
                                                                    >
                                                                        <span className="text-[10px] font-mono text-muted-foreground/40 w-5 text-center flex-shrink-0">
                                                                            {idx + 1}
                                                                        </span>
                                                                        <Circle className="h-3.5 w-3.5 text-muted-foreground/20 flex-shrink-0" />
                                                                        <div className="flex-1 min-w-0">
                                                                            <span className="text-sm group-hover:text-primary transition-colors">
                                                                                {q.title}
                                                                            </span>
                                                                        </div>
                                                                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/20 group-hover:text-primary transition-colors flex-shrink-0" />
                                                                    </Link>
                                                                ))}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Reference Videos Section */}
            <div className="mt-12">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-primary/10 border border-primary/10">
                        <Play className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Reference Videos</h2>
                        <p className="text-xs text-muted-foreground">Curated video tutorials to strengthen your concepts</p>
                    </div>
                </div>

                <div className="space-y-8">
                    {categoryOrder.map(catName => {
                        const config = CATEGORY_CONFIG[catName];
                        const videos = REFERENCE_VIDEOS[catName];
                        if (!videos || videos.length === 0) return null;
                        const Icon = config.icon;

                        return (
                            <div key={catName}>
                                <div className="flex items-center gap-2 mb-3">
                                    <Icon className={`h-4 w-4 ${config.text}`} />
                                    <h3 className={`text-sm font-bold uppercase tracking-wider ${config.text}`}>{catName}</h3>
                                </div>
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {videos.map((video, idx) => (
                                        <a
                                            key={idx}
                                            href={video.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`group flex items-start gap-3 p-4 bg-card border border-border/30 rounded-xl hover:${config.border} hover:bg-accent/10 transition-all duration-200`}
                                        >
                                            <div className={`p-2 rounded-lg bg-gradient-to-br ${config.gradient} border ${config.border} flex-shrink-0 mt-0.5`}>
                                                <Play className={`h-3.5 w-3.5 ${config.text}`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-medium group-hover:text-primary transition-colors leading-snug">
                                                    {video.title}
                                                </h4>
                                                <div className="flex items-center gap-2 mt-1.5">
                                                    <span className="text-[10px] text-muted-foreground/60">Search on YouTube</span>
                                                </div>
                                            </div>
                                            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/20 group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Aptitude;

import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/axios';
import { Code, Search, Filter, Brain, ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const getDifficultyStyle = (diff) => {
    switch (diff) {
        case 'Easy': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
        case 'Medium': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
        case 'Hard': return 'bg-red-500/10 text-red-400 border-red-500/20';
        default: return 'bg-muted text-muted-foreground';
    }
};

/* ─── Coding Sub-tab ───────────────────────────────────────── */
const CodingSection = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDifficulty, setFilterDifficulty] = useState('All');
    const [filterTag, setFilterTag] = useState('All');

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const { data } = await api.get('/questions');
                if (data.length === 0) {
                    await api.post('/questions/seed');
                    const seeded = await api.get('/questions');
                    setQuestions(seeded.data);
                } else {
                    setQuestions(data);
                }
            } catch (error) {
                console.error('Error fetching questions:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, []);

    const allTags = [...new Set(questions.flatMap(q => q.tags || []))].sort();
    const easyCount = questions.filter(q => q.difficulty === 'Easy').length;
    const mediumCount = questions.filter(q => q.difficulty === 'Medium').length;
    const hardCount = questions.filter(q => q.difficulty === 'Hard').length;

    const filteredQuestions = questions.filter(q => {
        const matchesSearch = q.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDifficulty = filterDifficulty === 'All' || q.difficulty === filterDifficulty;
        const matchesTag = filterTag === 'All' || (q.tags && q.tags.includes(filterTag));
        return matchesSearch && matchesDifficulty && matchesTag;
    });

    if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;

    return (
        <div className="space-y-5">
            {/* Difficulty Stats */}
            <div className="grid grid-cols-3 gap-3">
                {[
                    { label: 'Easy', count: easyCount, color: 'emerald' },
                    { label: 'Medium', count: mediumCount, color: 'amber' },
                    { label: 'Hard', count: hardCount, color: 'red' },
                ].map(({ label, count, color }) => (
                    <button
                        key={label}
                        onClick={() => setFilterDifficulty(filterDifficulty === label ? 'All' : label)}
                        className={`p-4 rounded-xl border transition-all duration-200 text-center ${filterDifficulty === label
                                ? `bg-${color}-500/10 border-${color}-500/30`
                                : `bg-card border-border/30 hover:border-${color}-500/20`
                            }`}
                    >
                        <div className={`text-2xl font-bold text-${color}-400`}>{count}</div>
                        <div className="text-xs text-muted-foreground mt-1">{label}</div>
                    </button>
                ))}
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search coding problems..."
                        className="w-full pl-10 pr-4 py-2.5 border border-border/30 rounded-xl bg-card focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <select className="border border-border/30 rounded-xl px-3 py-2.5 bg-card focus:ring-2 focus:ring-primary/30 text-sm" value={filterDifficulty} onChange={(e) => setFilterDifficulty(e.target.value)}>
                        <option value="All">All Levels</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                    <select className="border border-border/30 rounded-xl px-3 py-2.5 bg-card focus:ring-2 focus:ring-primary/30 text-sm" value={filterTag} onChange={(e) => setFilterTag(e.target.value)}>
                        <option value="All">All Tags</option>
                        {allTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
                    </select>
                </div>
            </div>

            <div className="text-xs text-muted-foreground">Showing {filteredQuestions.length} of {questions.length} problems</div>

            {filteredQuestions.length === 0 ? (
                <div className="text-center py-20 bg-card rounded-xl border border-dashed border-border/30">
                    <Code className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground">No problems found.</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {filteredQuestions.map((q, idx) => (
                        <motion.div key={q._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(idx * 0.02, 0.5) }}>
                            <Link to={`/practice/${q.slug}`} className="block bg-card border border-border/30 rounded-xl p-4 hover:border-primary/20 transition-all duration-300 group">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-primary/8 border border-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                                            <Code className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{q.title}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium border ${getDifficultyStyle(q.difficulty)}`}>{q.difficulty}</span>
                                                {q.tags && q.tags.slice(0, 2).map(tag => <span key={tag} className="text-[10px] text-muted-foreground/60">{tag}</span>)}
                                            </div>
                                        </div>
                                    </div>
                                    <svg className="h-5 w-5 text-muted-foreground/30 group-hover:text-primary/50 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

/* ─── Aptitude Sub-tab ─────────────────────────────────────── */
const AptitudeSection = () => {
    const [questions, setQuestions] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedDifficulty, setSelectedDifficulty] = useState('All');
    const [expandedTopics, setExpandedTopics] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [qRes, cRes] = await Promise.all([
                    api.get('/aptitude'),
                    api.get('/aptitude/categories'),
                ]);
                setQuestions(qRes.data);
                setCategoryData(cRes.data);
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

    const filteredQuestions = useMemo(() => {
        return questions.filter(q => {
            const matchSearch = !searchQuery || q.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchCategory = selectedCategory === 'All' || q.category === selectedCategory;
            const matchDifficulty = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
            return matchSearch && matchCategory && matchDifficulty;
        });
    }, [questions, searchQuery, selectedCategory, selectedDifficulty]);

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

    if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;

    return (
        <div className="space-y-5">
            {/* Category Filter */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <button
                    onClick={() => setSelectedCategory('All')}
                    className={`p-3 rounded-xl border text-left transition-all duration-200 ${selectedCategory === 'All'
                        ? 'bg-gradient-to-br from-primary/15 to-primary/5 border-primary/20 text-primary ring-1 ring-primary/30'
                        : 'bg-card border-border/30 hover:border-border/50'
                        }`}
                >
                    <div className="text-xs font-semibold mb-1">All Topics</div>
                    <div className="text-xl font-bold">{questions.length}</div>
                </button>
                {categoryOrder.map(catName => {
                    const catData = categoryData.find(c => c.category === catName);
                    if (!catData) return null;
                    return (
                        <button
                            key={catName}
                            onClick={() => setSelectedCategory(selectedCategory === catName ? 'All' : catName)}
                            className={`p-3 rounded-xl border text-left transition-all duration-200 ${selectedCategory === catName
                                ? 'bg-gradient-to-br from-primary/15 to-primary/5 border-primary/20 text-primary ring-1 ring-primary/30'
                                : 'bg-card border-border/30 hover:border-border/50'
                                }`}
                        >
                            <div className="text-xs font-semibold mb-1 truncate">{catName}</div>
                            <div className="text-xl font-bold">{catData.totalCount}</div>
                            <div className="text-[10px] text-muted-foreground/60">{catData.topics.length} topics</div>
                        </button>
                    );
                })}
            </div>

            {/* Search & Difficulty */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search aptitude questions..."
                        className="w-full pl-10 pr-4 py-2.5 border border-border/30 rounded-xl bg-card focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <select
                    className="border border-border/30 rounded-xl px-3 py-2.5 bg-card focus:ring-2 focus:ring-primary/30 text-sm"
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                >
                    <option value="All">All Levels</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                </select>
            </div>

            <div className="text-xs text-muted-foreground">Showing {filteredQuestions.length} of {questions.length} questions</div>

            {/* Grouped Questions */}
            {filteredQuestions.length === 0 ? (
                <div className="text-center py-20 bg-card rounded-xl border border-dashed border-border/30">
                    <Brain className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground">No questions found.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {categoryOrder.map(catName => {
                        if (!groupedQuestions[catName]) return null;
                        const topics = Object.entries(groupedQuestions[catName]);
                        return (
                            <div key={catName} className="space-y-2">
                                <h3 className="text-sm font-semibold text-primary/80 px-1">{catName}</h3>
                                {topics.map(([topic, qs]) => {
                                    const key = `${catName}|${topic}`;
                                    const isExpanded = expandedTopics[key];
                                    return (
                                        <div key={key} className="bg-card border border-border/30 rounded-xl overflow-hidden">
                                            <button
                                                onClick={() => toggleTopic(key)}
                                                className="w-full flex items-center justify-between px-4 py-3 hover:bg-accent/30 transition-colors"
                                            >
                                                <div className="flex items-center gap-2">
                                                    {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                                                    <span className="text-sm font-medium">{topic}</span>
                                                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent/50 text-muted-foreground">{qs.length}</span>
                                                </div>
                                            </button>
                                            <AnimatePresence>
                                                {isExpanded && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="border-t border-border/20">
                                                            {qs.map(q => (
                                                                <Link
                                                                    key={q._id}
                                                                    to={`/aptitude/${q.slug}`}
                                                                    className="flex items-center justify-between px-4 py-2.5 hover:bg-accent/20 transition-colors group border-b border-border/10 last:border-b-0"
                                                                >
                                                                    <span className="text-sm group-hover:text-primary transition-colors">{q.title}</span>
                                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getDifficultyStyle(q.difficulty)}`}>{q.difficulty}</span>
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
                        );
                    })}
                </div>
            )}
        </div>
    );
};

/* ─── Main Practice Page ───────────────────────────────────── */
const Practice = () => {
    const [activeTab, setActiveTab] = useState('coding');

    return (
        <div className="max-w-4xl mx-auto animate-fade-in-up">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-1">Practice</h1>
                <p className="text-muted-foreground text-sm">Sharpen your coding and aptitude skills in one place.</p>
            </div>

            {/* Tab Switcher */}
            <div className="flex gap-2 mb-6 p-1 bg-card border border-border/30 rounded-xl w-fit">
                <button
                    onClick={() => setActiveTab('coding')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'coding'
                            ? 'bg-primary text-black shadow-md shadow-primary/20'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                        }`}
                >
                    <Code className="h-4 w-4" />
                    Coding
                </button>
                <button
                    onClick={() => setActiveTab('aptitude')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'aptitude'
                            ? 'bg-primary text-black shadow-md shadow-primary/20'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                        }`}
                >
                    <Brain className="h-4 w-4" />
                    Aptitude
                </button>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'coding' ? <CodingSection /> : <AptitudeSection />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default Practice;

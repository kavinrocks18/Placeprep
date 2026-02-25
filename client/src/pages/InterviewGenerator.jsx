import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Brain, Sparkles, Building2, Briefcase, BarChart3,
    ChevronDown, ChevronRight, Code, Users, Puzzle,
    Save, CheckCircle2, History, Trash2, BookOpen
} from 'lucide-react';
import api from '../lib/axios';

const COMPANIES = [
    'Google', 'Amazon', 'Microsoft', 'Apple', 'Meta',
    'Netflix', 'TCS', 'Infosys', 'Wipro', 'HCL',
    'Flipkart', 'Paytm', 'Zomato', 'Swiggy', 'Razorpay',
    'Atlassian', 'Adobe', 'Oracle', 'Samsung', 'Goldman Sachs',
    'Morgan Stanley', 'JP Morgan', 'Uber', 'Airbnb', 'Stripe',
];

const ROLES = [
    'Software Engineer (SDE)',
    'Frontend Developer',
    'Backend Developer',
    'Data Scientist',
];

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

const TYPE_CONFIG = {
    technical: { icon: Code, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/15', label: 'Technical' },
    hr: { icon: Users, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/15', label: 'HR / Behavioral' },
    puzzles: { icon: Puzzle, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/15', label: 'Puzzles' },
    companySpecific: { icon: Building2, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/15', label: 'Company-Specific' },
};

const InterviewGenerator = () => {
    const [company, setCompany] = useState('');
    const [role, setRole] = useState('');
    const [difficulty, setDifficulty] = useState('Medium');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [savedSets, setSavedSets] = useState([]);
    const [showSaved, setShowSaved] = useState(false);
    const [expandedSections, setExpandedSections] = useState({
        technical: true, hr: true, puzzles: true, companySpecific: true,
    });

    useEffect(() => {
        api.get('/interview-gen/saved')
            .then(res => setSavedSets(res.data))
            .catch(() => { });
    }, []);

    const generate = async () => {
        if (!company || !role) return;
        setLoading(true);
        setResult(null);
        setSaved(false);
        try {
            const { data } = await api.post('/interview-gen/generate', { company, role, difficulty });
            setResult(data);
        } catch (err) {
            console.error('Generate error:', err);
        } finally {
            setLoading(false);
        }
    };

    const saveToProfile = async () => {
        if (!result || saving) return;
        setSaving(true);
        try {
            await api.post('/interview-gen/save', {
                company: result.company,
                role: result.role,
                difficulty: result.difficulty,
                questions: result.questions,
            });
            setSaved(true);
            // Refresh saved sets
            const { data } = await api.get('/interview-gen/saved');
            setSavedSets(data);
        } catch (err) {
            console.error('Save error:', err);
        } finally {
            setSaving(false);
        }
    };

    const toggleSection = (key) => {
        setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const getDiffColor = (d) => {
        if (d === 'Easy') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
        if (d === 'Medium') return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
        return 'text-red-400 bg-red-500/10 border-red-500/20';
    };

    const renderQuestionSection = (key, questions) => {
        if (!questions || questions.length === 0) return null;
        const config = TYPE_CONFIG[key];
        const Icon = config.icon;
        const isExpanded = expandedSections[key];

        return (
            <div className="rounded-xl bg-card border border-border/30 overflow-hidden">
                <button
                    onClick={() => toggleSection(key)}
                    className="w-full flex items-center justify-between p-4 hover:bg-accent/10 transition-colors"
                >
                    <div className="flex items-center gap-2.5">
                        <div className={`p-1.5 rounded-lg ${config.bg} border ${config.border}`}>
                            <Icon className={`h-4 w-4 ${config.color}`} />
                        </div>
                        <span className="text-sm font-semibold">{config.label}</span>
                        <span className="text-[10px] text-muted-foreground px-2 py-0.5 rounded-full bg-accent/30 border border-border/20">
                            {questions.length} {questions.length === 1 ? 'question' : 'questions'}
                        </span>
                    </div>
                    {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
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
                            <div className="border-t border-border/20 p-4 space-y-3">
                                {questions.map((q, i) => (
                                    <motion.div
                                        key={q.id || i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="flex gap-3 p-3 rounded-lg hover:bg-accent/10 transition-colors group"
                                    >
                                        <span className={`flex-shrink-0 w-6 h-6 rounded-full ${config.bg} border ${config.border} flex items-center justify-center text-[10px] font-bold ${config.color}`}>
                                            {i + 1}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm leading-relaxed">{q.question}</p>
                                            <div className="flex items-center gap-2 mt-1.5">
                                                {q.tag && (
                                                    <span className="text-[10px] text-muted-foreground/60 px-1.5 py-0.5 rounded bg-accent/20 border border-border/10">
                                                        {q.tag}
                                                    </span>
                                                )}
                                                {q.frequency && (
                                                    <span className="text-[10px] text-primary/50">
                                                        📊 {q.frequency}
                                                    </span>
                                                )}
                                                {q.source && (
                                                    <span className="text-[10px] text-emerald-400/50">
                                                        🏢 {q.source}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in-up space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/15">
                    <Brain className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold">Interview Q Generator</h1>
                    <p className="text-sm text-muted-foreground">Generate personalized interview questions for any company & role</p>
                </div>
            </div>

            {/* Input Form */}
            <div className="p-5 rounded-xl bg-card border border-border/30 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Company Dropdown */}
                    <div>
                        <label className="text-xs text-muted-foreground mb-1.5 block flex items-center gap-1.5">
                            <Building2 className="h-3.5 w-3.5" /> Company
                        </label>
                        <select
                            value={company}
                            onChange={e => setCompany(e.target.value)}
                            className="w-full p-2.5 rounded-lg bg-background border border-border/30 text-sm focus:outline-none focus:border-primary/30 focus:ring-1 focus:ring-primary/15 appearance-none cursor-pointer"
                        >
                            <option value="">Select company...</option>
                            {COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    {/* Role Dropdown */}
                    <div>
                        <label className="text-xs text-muted-foreground mb-1.5 block flex items-center gap-1.5">
                            <Briefcase className="h-3.5 w-3.5" /> Role
                        </label>
                        <select
                            value={role}
                            onChange={e => setRole(e.target.value)}
                            className="w-full p-2.5 rounded-lg bg-background border border-border/30 text-sm focus:outline-none focus:border-primary/30 focus:ring-1 focus:ring-primary/15 appearance-none cursor-pointer"
                        >
                            <option value="">Select role...</option>
                            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>

                    {/* Difficulty */}
                    <div>
                        <label className="text-xs text-muted-foreground mb-1.5 block flex items-center gap-1.5">
                            <BarChart3 className="h-3.5 w-3.5" /> Difficulty
                        </label>
                        <div className="flex gap-1.5">
                            {DIFFICULTIES.map(d => (
                                <button
                                    key={d}
                                    onClick={() => setDifficulty(d)}
                                    className={`flex-1 py-2.5 rounded-lg text-xs font-medium border transition-all ${difficulty === d
                                            ? getDiffColor(d)
                                            : 'bg-accent/20 border-border/25 text-muted-foreground hover:text-foreground'
                                        }`}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <button
                    onClick={generate}
                    disabled={loading || !company || !role}
                    className="w-full py-3 bg-primary text-black rounded-xl font-semibold text-sm hover:bg-lime-400 transition-all duration-300 shadow-lg shadow-primary/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> Generating Questions...</>
                    ) : (
                        <><Sparkles className="h-4 w-4" /> Generate Questions</>
                    )}
                </button>
            </div>

            {/* Results */}
            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        {/* Summary strip */}
                        <div className="flex items-center justify-between p-4 rounded-xl bg-card border border-border/30">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="px-2 py-1 rounded-lg bg-accent/30 border border-border/20 font-medium">{result.company}</span>
                                    <span className="text-muted-foreground">·</span>
                                    <span className="text-muted-foreground">{result.role}</span>
                                    <span className="text-muted-foreground">·</span>
                                    <span className={`px-2 py-0.5 rounded-full border ${getDiffColor(result.difficulty)}`}>{result.difficulty}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">{result.totalQuestions} questions</span>
                                <button
                                    onClick={saveToProfile}
                                    disabled={saving || saved}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${saved
                                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                            : 'bg-primary/15 text-primary border border-primary/20 hover:bg-primary/25'
                                        }`}
                                >
                                    {saved ? <><CheckCircle2 className="h-3.5 w-3.5" /> Saved</> :
                                        saving ? <><div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" /> Saving</> :
                                            <><Save className="h-3.5 w-3.5" /> Save to Profile</>}
                                </button>
                            </div>
                        </div>

                        {/* Question Sections */}
                        {renderQuestionSection('technical', result.questions.technical)}
                        {renderQuestionSection('companySpecific', result.questions.companySpecific)}
                        {renderQuestionSection('hr', result.questions.hr)}
                        {renderQuestionSection('puzzles', result.questions.puzzles)}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Saved Sets */}
            {savedSets.length > 0 && (
                <div className="rounded-xl bg-card border border-border/30 overflow-hidden">
                    <button
                        onClick={() => setShowSaved(!showSaved)}
                        className="w-full flex items-center justify-between p-4 hover:bg-accent/10 transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            <History className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-semibold">Saved Question Sets</span>
                            <span className="text-[10px] text-muted-foreground px-2 py-0.5 rounded-full bg-accent/30 border border-border/20">
                                {savedSets.length}
                            </span>
                        </div>
                        {showSaved ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                    </button>
                    {showSaved && (
                        <div className="border-t border-border/20 p-4 space-y-2">
                            {savedSets.map((set, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        setResult({
                                            company: set.company,
                                            role: set.role,
                                            difficulty: set.difficulty,
                                            questions: set.questions,
                                            totalQuestions: Object.values(set.questions).flat().length,
                                        });
                                        setSaved(true);
                                    }}
                                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-accent/10 transition-colors text-left"
                                >
                                    <div className="flex items-center gap-2">
                                        <BookOpen className="h-4 w-4 text-primary/50" />
                                        <div>
                                            <p className="text-xs font-medium">{set.company} — {set.role}</p>
                                            <p className="text-[10px] text-muted-foreground">
                                                {set.difficulty} · Saved {new Date(set.savedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/30" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default InterviewGenerator;

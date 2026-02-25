import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Clock, Zap, Trophy, ChevronRight, History, BarChart3, Building2, Check } from 'lucide-react';
import api from '../lib/axios';

const PRESETS = [
    { label: 'Quick Test', questions: 10, duration: 600, desc: '10 questions · 10 min' },
    { label: 'Standard', questions: 20, duration: 1800, desc: '20 questions · 30 min' },
    { label: 'Full Mock', questions: 30, duration: 2700, desc: '30 questions · 45 min' },
];

const MockTestStart = () => {
    const navigate = useNavigate();
    const [questionCount, setQuestionCount] = useState(20);
    const [duration, setDuration] = useState(1800);
    const [testType, setTestType] = useState('aptitude');
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(true);
    const [companies, setCompanies] = useState([]);
    const [selectedCompanies, setSelectedCompanies] = useState([]);
    const [companiesLoading, setCompaniesLoading] = useState(true);

    useEffect(() => {
        api.get('/mock-test/history')
            .then(res => setHistory(res.data))
            .catch(() => { })
            .finally(() => setHistoryLoading(false));

        api.get('/companies')
            .then(res => setCompanies(res.data))
            .catch(() => { })
            .finally(() => setCompaniesLoading(false));
    }, []);

    const toggleCompany = (slug) => {
        setSelectedCompanies(prev =>
            prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
        );
    };

    const startTest = async () => {
        setLoading(true);
        try {
            const { data } = await api.post('/mock-test/generate', {
                questionCount,
                duration,
                testType,
                companies: selectedCompanies,
            });
            navigate(`/mock-test/${data.testId}`, { state: data });
        } catch (err) {
            console.error('Failed to start test:', err);
            alert('Failed to generate test. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const formatDuration = (sec) => {
        const m = Math.floor(sec / 60);
        return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m} min`;
    };

    const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    const getDiffColor = (level) => {
        if (level === 'Easy') return 'text-emerald-400';
        if (level === 'Medium') return 'text-amber-400';
        return 'text-red-400';
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in-up space-y-8">
            {/* Header */}
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/15">
                        <Brain className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Mock Interview</h1>
                        <p className="text-sm text-muted-foreground">Simulate a real placement test environment</p>
                    </div>
                </div>
            </div>

            {/* Quick Presets */}
            <div>
                <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Quick Start</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {PRESETS.map((preset, i) => (
                        <motion.button
                            key={preset.label}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            onClick={() => { setQuestionCount(preset.questions); setDuration(preset.duration); }}
                            className={`p-5 rounded-xl border text-left transition-all duration-200 group ${questionCount === preset.questions && duration === preset.duration
                                    ? 'bg-primary/10 border-primary/25 ring-1 ring-primary/20'
                                    : 'bg-card border-border/30 hover:border-primary/15'
                                }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold text-sm">{preset.label}</span>
                                <Zap className={`h-4 w-4 transition-colors ${questionCount === preset.questions && duration === preset.duration ? 'text-primary' : 'text-muted-foreground/30'
                                    }`} />
                            </div>
                            <p className="text-xs text-muted-foreground">{preset.desc}</p>
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Company Selection */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-5 rounded-xl bg-card border border-border/30">
                <div className="flex items-center gap-2 mb-3">
                    <Building2 className="h-4 w-4 text-primary" />
                    <h2 className="text-sm font-semibold">Company Focus</h2>
                    <span className="text-[10px] text-muted-foreground ml-1">
                        (Optional — includes real interview questions from selected companies)
                    </span>
                </div>
                {companiesLoading ? (
                    <div className="flex justify-center py-4"><div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {companies.map(company => {
                            const isSelected = selectedCompanies.includes(company.slug);
                            return (
                                <button
                                    key={company.slug}
                                    onClick={() => toggleCompany(company.slug)}
                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-all duration-200 ${isSelected
                                            ? 'bg-primary/15 border-primary/30 text-primary ring-1 ring-primary/15'
                                            : 'bg-accent/15 border-border/25 text-muted-foreground hover:text-foreground hover:border-border/40'
                                        }`}
                                >
                                    {isSelected && <Check className="h-3 w-3" />}
                                    <span>{company.companyName}</span>
                                    <span className={`text-[10px] ${getDiffColor(company.difficultyLevel)}`}>
                                        {company.difficultyLevel}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                )}
                {selectedCompanies.length > 0 && (
                    <p className="text-[10px] text-primary/60 mt-2">
                        ✓ ~{Math.ceil(questionCount * 0.3)} company interview questions will be mixed into your test
                    </p>
                )}
            </motion.div>

            {/* Custom Config */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-6 rounded-xl bg-card border border-border/30 space-y-5">
                <h2 className="text-sm font-semibold">Customize Your Test</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <label className="text-xs text-muted-foreground mb-1.5 block">Number of Questions</label>
                        <input
                            type="range" min="5" max="50" step="5"
                            value={questionCount}
                            onChange={e => setQuestionCount(Number(e.target.value))}
                            className="w-full accent-primary"
                        />
                        <div className="text-sm font-medium mt-1">{questionCount} questions</div>
                    </div>
                    <div>
                        <label className="text-xs text-muted-foreground mb-1.5 block">Time Limit</label>
                        <input
                            type="range" min="300" max="5400" step="300"
                            value={duration}
                            onChange={e => setDuration(Number(e.target.value))}
                            className="w-full accent-primary"
                        />
                        <div className="text-sm font-medium mt-1">{formatDuration(duration)}</div>
                    </div>
                </div>

                <div>
                    <label className="text-xs text-muted-foreground mb-2 block">Test Type</label>
                    <div className="flex gap-2">
                        {[
                            { value: 'aptitude', label: 'Aptitude Only' },
                            { value: 'mixed', label: 'Mixed (Aptitude + Coding)' },
                        ].map(t => (
                            <button
                                key={t.value}
                                onClick={() => setTestType(t.value)}
                                className={`px-4 py-2 rounded-lg text-xs font-medium border transition-all ${testType === t.value
                                        ? 'bg-primary/15 border-primary/30 text-primary'
                                        : 'bg-accent/20 border-border/30 text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    onClick={startTest}
                    disabled={loading}
                    className="w-full py-3 bg-primary text-black rounded-xl font-semibold text-sm hover:bg-lime-400 transition-all duration-300 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> Generating...</>
                    ) : (
                        <>Start Mock Test <ChevronRight className="h-4 w-4" /></>
                    )}
                </button>
            </motion.div>

            {/* Past Tests */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <History className="h-4 w-4 text-muted-foreground" />
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Recent Tests</h2>
                </div>
                {historyLoading ? (
                    <div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
                ) : history.length === 0 ? (
                    <div className="text-center py-10 bg-card rounded-xl border border-dashed border-border/30">
                        <Trophy className="h-10 w-10 text-muted-foreground/20 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No tests taken yet. Start your first mock test!</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {history.map((test, i) => (
                            <motion.div key={test._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                                <Link
                                    to={`/mock-test/${test._id}/report`}
                                    className="flex items-center justify-between p-4 bg-card border border-border/30 rounded-xl hover:border-primary/20 transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${test.score >= 70 ? 'bg-emerald-500/15 text-emerald-400' :
                                                test.score >= 40 ? 'bg-amber-500/15 text-amber-400' :
                                                    'bg-red-500/15 text-red-400'
                                            }`}>
                                            {test.score}%
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">
                                                {test.testType === 'mixed' ? 'Mixed' : 'Aptitude'} · {test.totalQuestions} questions
                                            </p>
                                            <p className="text-[10px] text-muted-foreground">
                                                {formatDate(test.startedAt)} · {test.totalCorrect}/{test.totalAttempted} correct · {test.accuracy}% accuracy
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${test.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                            }`}>{test.status === 'completed' ? 'Completed' : 'Timed Out'}</span>
                                        <BarChart3 className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MockTestStart;

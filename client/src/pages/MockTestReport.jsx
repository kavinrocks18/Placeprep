import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Trophy, Target, Brain, TrendingUp, TrendingDown,
    CheckCircle2, XCircle, Clock, ArrowLeft, BarChart3,
    AlertTriangle, Zap, ChevronDown, ChevronRight
} from 'lucide-react';
import api from '../lib/axios';

const MockTestReport = () => {
    const { testId } = useParams();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showQuestions, setShowQuestions] = useState(false);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const { data } = await api.get(`/mock-test/${testId}/report`);
                setReport(data);
            } catch (err) {
                console.error('Failed to fetch report:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, [testId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-muted-foreground">Loading report...</p>
                </div>
            </div>
        );
    }

    if (!report) {
        return (
            <div className="text-center py-16">
                <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground">Report not found</p>
                <Link to="/mock-test" className="text-primary text-sm mt-2 inline-block hover:underline">← Back to Mock Test</Link>
            </div>
        );
    }

    const { score, accuracy, totalQuestions, totalAttempted, totalCorrect, weakTopics, strongTopics, categoryBreakdown, questions, status } = report;
    const unanswered = totalQuestions - totalAttempted;
    const incorrect = totalAttempted - totalCorrect;

    const getScoreColor = () => {
        if (score >= 75) return 'text-emerald-400';
        if (score >= 50) return 'text-amber-400';
        return 'text-red-400';
    };

    const getScoreGrade = () => {
        if (score >= 90) return { grade: 'Excellent', emoji: '🏆', color: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/20' };
        if (score >= 75) return { grade: 'Great', emoji: '🌟', color: 'from-emerald-500/15 to-emerald-600/5 border-emerald-500/15' };
        if (score >= 50) return { grade: 'Good', emoji: '👍', color: 'from-amber-500/15 to-amber-600/5 border-amber-500/15' };
        if (score >= 30) return { grade: 'Needs Work', emoji: '📖', color: 'from-amber-500/10 to-amber-600/5 border-amber-500/10' };
        return { grade: 'Keep Practicing', emoji: '💪', color: 'from-red-500/10 to-red-600/5 border-red-500/10' };
    };

    const gradeInfo = getScoreGrade();

    return (
        <div className="max-w-4xl mx-auto animate-fade-in-up space-y-6">
            {/* Back */}
            <Link to="/mock-test" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="h-4 w-4" /> Back to Mock Tests
            </Link>

            {/* Score Hero */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`p-8 rounded-2xl bg-gradient-to-br ${gradeInfo.color} border text-center`}>
                <p className="text-4xl mb-2">{gradeInfo.emoji}</p>
                <div className={`text-6xl font-bold mb-2 ${getScoreColor()}`}>{score}%</div>
                <p className="text-lg font-semibold mb-1">{gradeInfo.grade}</p>
                <p className="text-sm text-muted-foreground">
                    {status === 'timed-out' && <span className="text-amber-400">⏱ Timed Out · </span>}
                    {totalCorrect} correct out of {totalAttempted} attempted ({totalQuestions} total)
                </p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { label: 'Score', value: `${score}%`, icon: Trophy, color: 'text-primary' },
                    { label: 'Accuracy', value: `${accuracy}%`, icon: Target, color: 'text-emerald-400' },
                    { label: 'Attempted', value: `${totalAttempted}/${totalQuestions}`, icon: Brain, color: 'text-blue-400' },
                    { label: 'Unanswered', value: unanswered, icon: Clock, color: 'text-amber-400' },
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.05 }}
                        className="p-4 rounded-xl bg-card border border-border/30 text-center"
                    >
                        <stat.icon className={`h-5 w-5 mx-auto mb-2 ${stat.color}`} />
                        <div className="text-xl font-bold">{stat.value}</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">{stat.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* Category Breakdown */}
            {categoryBreakdown && categoryBreakdown.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-5 rounded-xl bg-card border border-border/30">
                    <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-primary" /> Category Performance
                    </h3>
                    <div className="space-y-3">
                        {categoryBreakdown.map(cat => (
                            <div key={cat.category}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-medium">{cat.category}</span>
                                    <span className="text-xs text-muted-foreground">{cat.correct}/{cat.attempted} correct · {cat.accuracy}%</span>
                                </div>
                                <div className="w-full bg-accent/30 rounded-full h-2.5 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${cat.accuracy}%` }}
                                        transition={{ duration: 0.8, delay: 0.5 }}
                                        className={`h-full rounded-full ${cat.accuracy >= 70 ? 'bg-emerald-500' :
                                                cat.accuracy >= 40 ? 'bg-amber-500' : 'bg-red-500'
                                            }`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Weakness & Strength Analysis */}
            <div className="grid md:grid-cols-2 gap-4">
                {/* Weak Topics */}
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="p-5 rounded-xl bg-card border border-border/30">
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-red-400" /> Areas to Improve
                    </h3>
                    {weakTopics?.length > 0 ? (
                        <div className="space-y-2">
                            {weakTopics.map((t, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                                    <div>
                                        <p className="text-xs font-medium">{t.topic}</p>
                                        <p className="text-[10px] text-muted-foreground">{t.category}</p>
                                    </div>
                                    <span className="text-xs font-bold text-red-400">{t.accuracy}%</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-muted-foreground py-4 text-center">No weak areas identified 🎉</p>
                    )}
                </motion.div>

                {/* Strong Topics */}
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="p-5 rounded-xl bg-card border border-border/30">
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-emerald-400" /> Strong Areas
                    </h3>
                    {strongTopics?.length > 0 ? (
                        <div className="space-y-2">
                            {strongTopics.map((t, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                                    <div>
                                        <p className="text-xs font-medium">{t.topic}</p>
                                        <p className="text-[10px] text-muted-foreground">{t.category}</p>
                                    </div>
                                    <span className="text-xs font-bold text-emerald-400">{t.accuracy}%</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-muted-foreground py-4 text-center">Keep practicing to build strengths!</p>
                    )}
                </motion.div>
            </div>

            {/* Question Review */}
            <div className="rounded-xl bg-card border border-border/30 overflow-hidden">
                <button
                    onClick={() => setShowQuestions(!showQuestions)}
                    className="w-full flex items-center justify-between p-5 hover:bg-accent/20 transition-colors"
                >
                    <h3 className="text-sm font-semibold flex items-center gap-2">
                        <Zap className="h-4 w-4 text-primary" /> Question Review
                    </h3>
                    {showQuestions ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                </button>
                {showQuestions && (
                    <div className="border-t border-border/20">
                        {questions?.map((q, i) => (
                            <div key={i} className={`flex items-start gap-3 px-5 py-3.5 border-b border-border/10 last:border-b-0 ${!q.isAttempted ? 'opacity-50' : ''
                                }`}>
                                <div className="flex-shrink-0 mt-0.5">
                                    {q.isCorrect ? (
                                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                    ) : q.isAttempted ? (
                                        <XCircle className="h-4 w-4 text-red-400" />
                                    ) : (
                                        <Clock className="h-4 w-4 text-muted-foreground/30" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium leading-relaxed">{q.title}</p>
                                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${q.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                q.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                    'bg-red-500/10 text-red-400 border-red-500/20'
                                            }`}>{q.difficulty}</span>
                                        {q.category && <span className="text-[10px] text-muted-foreground">{q.category}</span>}
                                        {q.isAttempted && q.questionType === 'aptitude' && (
                                            <span className="text-[10px] text-muted-foreground/50">
                                                Your: {q.options?.[q.selectedAnswer] || 'N/A'} {q.isCorrect ? '✓' : `· Correct: ${q.options?.[q.correctAnswer] || 'N/A'}`}
                                            </span>
                                        )}
                                    </div>
                                    {q.explanation && !q.isCorrect && q.isAttempted && (
                                        <p className="text-[10px] text-muted-foreground/60 mt-1 italic">💡 {q.explanation}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
                <Link
                    to="/mock-test"
                    className="flex-1 py-3 text-center bg-primary text-black rounded-xl font-semibold text-sm hover:bg-lime-400 transition-all shadow-lg shadow-primary/20"
                >
                    Take Another Test
                </Link>
                <Link
                    to="/practice"
                    className="flex-1 py-3 text-center bg-card border border-border/30 rounded-xl text-sm font-medium hover:bg-accent/30 transition-all"
                >
                    Practice Problems
                </Link>
            </div>
        </div>
    );
};

export default MockTestReport;

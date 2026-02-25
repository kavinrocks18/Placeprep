import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChevronLeft, ChevronRight, Flag, AlertTriangle, CheckCircle2 } from 'lucide-react';
import api from '../lib/axios';

const MockTestSession = () => {
    const { testId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [testData, setTestData] = useState(location.state || null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [timeLeft, setTimeLeft] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [questionStartTime, setQuestionStartTime] = useState(Date.now());
    const timerRef = useRef(null);
    const initialized = useRef(false);

    // Initialize from location state or redirect
    useEffect(() => {
        if (!testData) {
            navigate('/mock-test');
            return;
        }
        setTimeLeft(testData.duration);
        setAnswers(testData.questions.map(() => ({ selectedAnswer: -1, timeTaken: 0 })));
        // Mark initialized AFTER setting timeLeft so the timer won't auto-submit on mount
        setTimeout(() => { initialized.current = true; }, 100);
    }, [testData, navigate]);

    // Countdown timer
    useEffect(() => {
        // Only auto-submit if timer was initialized and has actually counted down to 0
        if (timeLeft <= 0 && initialized.current) {
            handleSubmit(true);
            return;
        }
        if (timeLeft <= 0) return; // Not initialized yet, skip
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, [timeLeft > 0]);

    const formatTime = (sec) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    const selectAnswer = (optionIndex) => {
        setAnswers(prev => {
            const updated = [...prev];
            updated[currentIndex] = {
                ...updated[currentIndex],
                selectedAnswer: optionIndex,
            };
            return updated;
        });
    };

    const goToQuestion = useCallback((idx) => {
        // Track time for current question
        const elapsed = Math.round((Date.now() - questionStartTime) / 1000);
        setAnswers(prev => {
            const updated = [...prev];
            if (updated[currentIndex]) {
                updated[currentIndex] = { ...updated[currentIndex], timeTaken: (updated[currentIndex].timeTaken || 0) + elapsed };
            }
            return updated;
        });
        setCurrentIndex(idx);
        setQuestionStartTime(Date.now());
    }, [currentIndex, questionStartTime]);

    const handleSubmit = async (timedOut = false) => {
        if (submitting) return;
        setSubmitting(true);
        clearInterval(timerRef.current);

        // Record time for last question
        const elapsed = Math.round((Date.now() - questionStartTime) / 1000);
        const finalAnswers = answers.map((a, i) => ({
            questionIndex: i,
            selectedAnswer: a.selectedAnswer,
            timeTaken: i === currentIndex ? (a.timeTaken || 0) + elapsed : a.timeTaken || 0,
        }));

        try {
            await api.post(`/mock-test/${testId}/submit`, { answers: finalAnswers, timedOut });
            navigate(`/mock-test/${testId}/report`, { replace: true });
        } catch (err) {
            console.error('Submit error:', err);
            alert('Failed to submit. Please try again.');
            setSubmitting(false);
        }
    };

    if (!testData) return null;

    const questions = testData.questions;
    const current = questions[currentIndex];
    const answered = answers.filter(a => a.selectedAnswer !== -1).length;
    const isUrgent = timeLeft <= 60;
    const isWarning = timeLeft <= 300 && !isUrgent;

    return (
        <div className="max-w-4xl mx-auto animate-fade-in-up">
            {/* Top Bar */}
            <div className="sticky top-16 z-40 -mx-4 px-4 py-3 bg-background/90 backdrop-blur-lg border-b border-border/30 mb-6">
                <div className="flex items-center justify-between max-w-4xl mx-auto">
                    <div className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">Q {currentIndex + 1}</span> / {questions.length}
                        <span className="ml-3 text-xs">({answered} answered)</span>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-sm font-bold ${isUrgent ? 'bg-red-500/15 text-red-400 animate-pulse' :
                        isWarning ? 'bg-amber-500/15 text-amber-400' :
                            'bg-card border border-border/30 text-foreground'
                        }`}>
                        <Clock className="h-4 w-4" />
                        {formatTime(timeLeft)}
                    </div>
                    <button
                        onClick={() => setShowConfirm(true)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-primary text-black rounded-lg text-xs font-semibold hover:bg-lime-400 transition-all shadow-md shadow-primary/15"
                    >
                        <Flag className="h-3.5 w-3.5" /> Submit
                    </button>
                </div>
            </div>

            {/* Question Navigation Grid */}
            <div className="mb-6 p-4 bg-card border border-border/30 rounded-xl">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Question Navigator</p>
                <div className="flex flex-wrap gap-1.5">
                    {questions.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goToQuestion(i)}
                            className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${i === currentIndex
                                ? 'bg-primary text-black shadow-md shadow-primary/20'
                                : answers[i]?.selectedAnswer !== -1
                                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                                    : 'bg-accent/30 text-muted-foreground border border-border/20 hover:border-border/40'
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-4 mt-3 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-primary inline-block" /> Current</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-500/30 inline-block" /> Answered</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-accent/30 border border-border/30 inline-block" /> Unanswered</span>
                </div>
            </div>

            {/* Question Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.15 }}
                    className="p-6 bg-card border border-border/30 rounded-xl mb-6"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${current.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            current.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                'bg-red-500/10 text-red-400 border-red-500/20'
                            }`}>{current.difficulty}</span>
                        {current.category && <span className="text-[10px] text-muted-foreground">{current.category}</span>}
                        {current.topic && <span className="text-[10px] text-muted-foreground/50">· {current.topic}</span>}
                        {current.questionType === 'company-interview' && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 ml-1">🏢 Company Q</span>
                        )}
                    </div>

                    <h2 className="text-base font-medium leading-relaxed mb-6">{current.title}</h2>

                    {current.questionType === 'aptitude' && current.options?.length > 0 ? (
                        <div className="space-y-2.5">
                            {current.options.map((opt, oi) => (
                                <button
                                    key={oi}
                                    onClick={() => selectAnswer(oi)}
                                    className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left text-sm transition-all duration-200 ${answers[currentIndex]?.selectedAnswer === oi
                                        ? 'bg-primary/10 border-primary/30 text-primary ring-1 ring-primary/20'
                                        : 'bg-accent/10 border-border/20 hover:border-primary/15 hover:bg-accent/20'
                                        }`}
                                >
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 flex-shrink-0 ${answers[currentIndex]?.selectedAnswer === oi
                                        ? 'border-primary bg-primary text-black'
                                        : 'border-border/40 text-muted-foreground'
                                        }`}>
                                        {String.fromCharCode(65 + oi)}
                                    </div>
                                    <span>{opt}</span>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="p-6 bg-accent/20 rounded-xl border border-border/20 text-center">
                            <p className="text-sm text-muted-foreground">
                                {current.questionType === 'company-interview'
                                    ? `This is a real interview question from ${current.topic}. Think about how you would answer this in an actual interview.`
                                    : 'This is a coding question. In a real interview, you would write code to solve this.'}
                            </p>
                            <p className="text-xs text-muted-foreground/60 mt-2">Mark your confidence level:</p>
                            <div className="flex gap-2 justify-center mt-3">
                                {['Can Solve', 'Partially', 'Cannot Solve'].map((label, ci) => (
                                    <button
                                        key={ci}
                                        onClick={() => selectAnswer(ci)}
                                        className={`px-4 py-2 rounded-lg text-xs font-medium border transition-all ${answers[currentIndex]?.selectedAnswer === ci
                                            ? 'bg-primary/15 border-primary/30 text-primary'
                                            : 'border-border/30 text-muted-foreground hover:text-foreground'
                                            }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between">
                <button
                    onClick={() => goToQuestion(Math.max(0, currentIndex - 1))}
                    disabled={currentIndex === 0}
                    className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm bg-card border border-border/30 hover:border-border/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronLeft className="h-4 w-4" /> Previous
                </button>
                {currentIndex < questions.length - 1 ? (
                    <button
                        onClick={() => goToQuestion(currentIndex + 1)}
                        className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm bg-primary/15 border border-primary/20 text-primary hover:bg-primary/25 transition-all"
                    >
                        Next <ChevronRight className="h-4 w-4" />
                    </button>
                ) : (
                    <button
                        onClick={() => setShowConfirm(true)}
                        className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm bg-primary text-black font-semibold hover:bg-lime-400 transition-all shadow-md shadow-primary/15"
                    >
                        <Flag className="h-4 w-4" /> Finish Test
                    </button>
                )}
            </div>

            {/* Submit Confirmation Modal */}
            <AnimatePresence>
                {showConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setShowConfirm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            className="w-full max-w-sm p-6 bg-card border border-border/30 rounded-2xl shadow-2xl"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/20">
                                    <AlertTriangle className="h-5 w-5 text-amber-400" />
                                </div>
                                <h3 className="font-semibold">Submit Test?</h3>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                                You have answered <span className="font-bold text-foreground">{answered}</span> out of <span className="font-bold text-foreground">{questions.length}</span> questions.
                            </p>
                            {answered < questions.length && (
                                <p className="text-xs text-amber-400 mb-4">
                                    ⚠ {questions.length - answered} questions are unanswered.
                                </p>
                            )}
                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    className="flex-1 py-2.5 rounded-xl text-sm border border-border/30 hover:bg-accent/30 transition-all"
                                >
                                    Continue Test
                                </button>
                                <button
                                    onClick={() => { setShowConfirm(false); handleSubmit(false); }}
                                    disabled={submitting}
                                    className="flex-1 py-2.5 rounded-xl text-sm bg-primary text-black font-semibold hover:bg-lime-400 transition-all disabled:opacity-50"
                                >
                                    {submitting ? 'Submitting...' : 'Submit Now'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MockTestSession;

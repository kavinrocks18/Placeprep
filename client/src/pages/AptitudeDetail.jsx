import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../lib/axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Brain, Clock, CheckCircle, XCircle,
    ChevronRight, RotateCcw, Lightbulb
} from 'lucide-react';

const AptitudeDetail = () => {
    const { slug } = useParams();
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [result, setResult] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [timerActive, setTimerActive] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const { data } = await api.get(`/aptitude/${slug}`);
                setQuestion(data);
                setTimeLeft(data.timeLimit || 120);
                setTimerActive(true);
            } catch (error) {
                console.error('Error fetching question:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuestion();

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [slug]);

    useEffect(() => {
        if (timerActive && timeLeft > 0 && !result) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        setTimerActive(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [timerActive, result]);

    const handleSubmit = async () => {
        if (selectedAnswer === null || result) return;
        setSubmitting(true);
        try {
            const { data } = await api.post(`/aptitude/${slug}/submit`, { selectedAnswer });
            setResult(data);
            setTimerActive(false);
        } catch (error) {
            console.error('Error submitting answer:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleReset = () => {
        setSelectedAnswer(null);
        setResult(null);
        setTimeLeft(question?.timeLimit || 120);
        setTimerActive(true);
    };

    const formatTime = (s) => {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const getDifficultyStyle = (diff) => {
        switch (diff) {
            case 'Easy': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'Medium': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'Hard': return 'bg-red-500/10 text-red-400 border-red-500/20';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    const getOptionStyle = (idx) => {
        if (!result) {
            return selectedAnswer === idx
                ? 'border-primary bg-primary/10 ring-1 ring-primary/30'
                : 'border-border/30 hover:border-primary/25 hover:bg-accent/15';
        }
        // After submission
        if (idx === result.correctAnswer) {
            return 'border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500/30';
        }
        if (idx === selectedAnswer && !result.isCorrect) {
            return 'border-red-500 bg-red-500/10 ring-1 ring-red-500/30';
        }
        return 'border-border/20 opacity-50';
    };

    const getOptionIcon = (idx) => {
        if (!result) return null;
        if (idx === result.correctAnswer) {
            return <CheckCircle className="h-5 w-5 text-emerald-400" />;
        }
        if (idx === selectedAnswer && !result.isCorrect) {
            return <XCircle className="h-5 w-5 text-red-400" />;
        }
        return null;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!question) {
        return (
            <div className="text-center py-20">
                <p className="text-muted-foreground">Question not found</p>
                <Link to="/aptitude" className="text-primary hover:underline text-sm mt-2 inline-block">← Back to Aptitude</Link>
            </div>
        );
    }

    const timerColor = timeLeft > 30 ? 'text-foreground' : timeLeft > 10 ? 'text-amber-400' : 'text-red-400';
    const timerBg = timeLeft > 30 ? 'bg-accent/20' : timeLeft > 10 ? 'bg-amber-500/10' : 'bg-red-500/10';

    return (
        <div className="max-w-3xl mx-auto animate-fade-in-up">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <Link to="/aptitude" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back to Aptitude
                </Link>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg bg-primary/8 border border-primary/15 text-primary font-medium">
                        <Brain className="h-3 w-3" />
                        {question.category}
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getDifficultyStyle(question.difficulty)}`}>
                        {question.difficulty}
                    </span>
                </div>
            </div>

            {/* Timer */}
            <div className={`flex items-center justify-center gap-2 mb-6 p-3 rounded-xl border border-border/20 ${timerBg}`}>
                <Clock className={`h-4 w-4 ${timerColor}`} />
                <span className={`font-mono text-lg font-bold ${timerColor}`}>
                    {formatTime(timeLeft)}
                </span>
                {timeLeft === 0 && !result && (
                    <span className="text-xs text-red-400 ml-2">Time's up!</span>
                )}
            </div>

            {/* Question Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border/30 rounded-2xl overflow-hidden"
            >
                {/* Title & Tags */}
                <div className="p-6 pb-0">
                    <h1 className="text-xl font-bold mb-3">{question.title}</h1>
                    {question.tags && question.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                            {question.tags.map(tag => (
                                <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-primary/6 text-primary/70 border border-primary/10">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Question Text */}
                <div className="px-6 pb-4">
                    <div className="bg-accent/25 border border-border/20 rounded-xl p-5">
                        <p className="text-foreground leading-relaxed whitespace-pre-line">{question.question}</p>
                    </div>
                </div>

                {/* Options */}
                <div className="px-6 pb-6 space-y-3">
                    {question.options.map((option, idx) => (
                        <motion.button
                            key={idx}
                            whileHover={!result ? { scale: 1.005 } : {}}
                            whileTap={!result ? { scale: 0.995 } : {}}
                            onClick={() => !result && setSelectedAnswer(idx)}
                            disabled={!!result}
                            className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 text-left ${getOptionStyle(idx)}`}
                        >
                            {/* Option Letter */}
                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${selectedAnswer === idx && !result
                                    ? 'bg-primary text-black'
                                    : result && idx === result.correctAnswer
                                        ? 'bg-emerald-500 text-white'
                                        : result && idx === selectedAnswer && !result.isCorrect
                                            ? 'bg-red-500 text-white'
                                            : 'bg-accent/40 text-muted-foreground'
                                }`}>
                                {String.fromCharCode(65 + idx)}
                            </span>

                            {/* Option Text */}
                            <span className="flex-1 text-sm">{option}</span>

                            {/* Result Icon */}
                            {getOptionIcon(idx)}
                        </motion.button>
                    ))}
                </div>

                {/* Actions */}
                <div className="px-6 pb-6">
                    {!result ? (
                        <button
                            onClick={handleSubmit}
                            disabled={selectedAnswer === null || submitting}
                            className={`w-full py-3 rounded-xl text-sm font-bold transition-all duration-200 ${selectedAnswer !== null
                                    ? 'bg-primary text-black hover:bg-lime-400 shadow-md shadow-primary/20'
                                    : 'bg-accent/30 text-muted-foreground cursor-not-allowed'
                                }`}
                        >
                            {submitting ? 'Checking...' : 'Submit Answer'}
                        </button>
                    ) : (
                        <button
                            onClick={handleReset}
                            className="w-full py-3 rounded-xl text-sm font-bold bg-accent/30 border border-border/30 text-foreground hover:bg-accent/50 transition-all flex items-center justify-center gap-2"
                        >
                            <RotateCcw className="h-4 w-4" /> Try Again
                        </button>
                    )}
                </div>
            </motion.div>

            {/* Result + Explanation */}
            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4 }}
                        className="mt-4"
                    >
                        {/* Result Banner */}
                        <div className={`p-4 rounded-xl border mb-4 flex items-center gap-3 ${result.isCorrect
                                ? 'bg-emerald-500/10 border-emerald-500/20'
                                : 'bg-red-500/10 border-red-500/20'
                            }`}>
                            {result.isCorrect
                                ? <CheckCircle className="h-6 w-6 text-emerald-400" />
                                : <XCircle className="h-6 w-6 text-red-400" />
                            }
                            <div>
                                <p className={`text-sm font-bold ${result.isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {result.isCorrect ? 'Correct! 🎉' : 'Incorrect'}
                                </p>
                                {!result.isCorrect && (
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        The correct answer was: <strong>{String.fromCharCode(65 + result.correctAnswer)}</strong>
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Explanation */}
                        <div className="bg-card border border-border/30 rounded-xl p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <Lightbulb className="h-4 w-4 text-amber-400" />
                                <h3 className="text-sm font-bold text-amber-400">Explanation</h3>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">{result.explanation}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AptitudeDetail;

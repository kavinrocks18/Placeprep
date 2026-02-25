import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/axios';
import { Flame, Clock, ArrowRight, Zap, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

const ProblemOfTheDay = () => {
    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [countdown, setCountdown] = useState('');
    const [streak, setStreak] = useState(null);

    useEffect(() => {
        const fetchPOTD = async () => {
            try {
                const [potdRes, streakRes] = await Promise.all([
                    api.get('/potd'),
                    api.get('/potd/streak').catch(() => ({ data: null })),
                ]);
                setProblem(potdRes.data);
                if (streakRes.data) setStreak(streakRes.data);
            } catch (error) {
                console.error('Error fetching POTD:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPOTD();
    }, []);

    useEffect(() => {
        const updateCountdown = () => {
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);

            const diff = tomorrow - now;
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setCountdown(
                `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
            );
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);
        return () => clearInterval(interval);
    }, []);

    const getDifficultyStyle = (diff) => {
        switch (diff) {
            case 'Easy': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'Medium': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'Hard': return 'bg-red-500/10 text-red-400 border-red-500/20';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    if (loading) {
        return (
            <div className="bg-card border border-border/30 rounded-xl p-6 animate-pulse">
                <div className="h-4 bg-accent/30 rounded w-1/3 mb-4" />
                <div className="h-6 bg-accent/30 rounded w-2/3 mb-3" />
                <div className="h-3 bg-accent/30 rounded w-full" />
            </div>
        );
    }

    if (!problem) {
        return (
            <div className="bg-card border border-dashed border-border/30 rounded-xl p-6 text-center">
                <Zap className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No problem available today. Seed questions first.</p>
            </div>
        );
    }

    const q = problem.question;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative bg-card border border-border/30 rounded-xl overflow-hidden"
        >
            {/* Green accent */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

            <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/10">
                            <Zap className="h-4 w-4 text-primary" />
                        </div>
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Problem of the Day</h3>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-accent/20 px-3 py-1.5 rounded-lg border border-border/20">
                        <Clock className="h-3 w-3" />
                        <span className="font-mono font-medium">{countdown}</span>
                    </div>
                </div>

                {/* Title + Difficulty */}
                <div className="flex items-start justify-between gap-4 mb-3">
                    <h2 className="text-xl font-bold">{q.title}</h2>
                    <span className={`flex-shrink-0 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getDifficultyStyle(q.difficulty)}`}>
                        {q.difficulty}
                    </span>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                    {q.description}
                </p>

                {q.tags && q.tags.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap mb-4">
                        <Tag className="h-3 w-3 text-muted-foreground/50" />
                        {q.tags.map((tag, idx) => (
                            <span key={idx} className="text-xs px-2 py-0.5 bg-accent/30 border border-border/20 rounded-md text-muted-foreground">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {q.constraints && (
                    <div className="text-xs text-muted-foreground/70 bg-accent/15 border border-border/15 rounded-lg p-3 mb-4 font-mono whitespace-pre-line">
                        {q.constraints}
                    </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-border/20">
                    <div className="flex items-center gap-3">
                        {streak && (
                            <>
                                <div className="flex items-center gap-1.5">
                                    <Flame className={`h-4 w-4 ${streak.currentStreak > 0 ? 'text-orange-400' : 'text-muted-foreground/40'}`} />
                                    <span className="text-sm font-semibold">{streak.currentStreak}</span>
                                    <span className="text-xs text-muted-foreground">day streak</span>
                                </div>
                                {streak.solvedToday && (
                                    <span className="text-xs px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                                        ✓ Solved
                                    </span>
                                )}
                            </>
                        )}
                    </div>

                    <Link
                        to={`/potd/${q.slug}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-black rounded-lg text-sm font-bold hover:bg-lime-400 transition-all shadow-md shadow-primary/15"
                    >
                        Solve Now <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default ProblemOfTheDay;

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Target, Flame, Trophy, TrendingUp, Brain, Code, BookOpen, Zap } from 'lucide-react';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import api from '../lib/axios';

ChartJS.register(ArcElement, Tooltip, Legend);

const Analytics = () => {
    const [overview, setOverview] = useState(null);
    const [topics, setTopics] = useState(null);
    const [activity, setActivity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('coding');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ovRes, topRes, actRes] = await Promise.all([
                    api.get('/analytics/overview'),
                    api.get('/analytics/topics'),
                    api.get('/analytics/activity'),
                ]);
                setOverview(ovRes.data);
                setTopics(topRes.data);
                setActivity(actRes.data);
            } catch (err) {
                console.error('Analytics fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-muted-foreground">Loading analytics...</p>
                </div>
            </div>
        );
    }

    const statCards = [
        {
            label: 'Problems Solved',
            value: overview?.totalSolved || 0,
            icon: Target,
            color: 'text-emerald-400',
            bg: 'from-emerald-500/15 to-emerald-600/5',
            border: 'border-emerald-500/20',
        },
        {
            label: 'Accuracy',
            value: `${overview?.accuracy || 0}%`,
            icon: TrendingUp,
            color: 'text-blue-400',
            bg: 'from-blue-500/15 to-blue-600/5',
            border: 'border-blue-500/20',
        },
        {
            label: 'Current Streak',
            value: overview?.currentStreak || 0,
            icon: Flame,
            color: 'text-amber-400',
            bg: 'from-amber-500/15 to-amber-600/5',
            border: 'border-amber-500/20',
        },
        {
            label: 'Longest Streak',
            value: overview?.longestStreak || 0,
            icon: Trophy,
            color: 'text-purple-400',
            bg: 'from-purple-500/15 to-purple-600/5',
            border: 'border-purple-500/20',
        },
    ];

    // Doughnut chart data
    const byType = overview?.byType || { coding: { solved: 0 }, ds: { solved: 0 }, aptitude: { solved: 0 } };
    const doughnutData = {
        labels: ['Coding', 'Data Structures', 'Aptitude'],
        datasets: [{
            data: [byType.coding.solved, byType.ds.solved, byType.aptitude.solved],
            backgroundColor: ['rgba(52, 211, 153, 0.8)', 'rgba(96, 165, 250, 0.8)', 'rgba(251, 191, 36, 0.8)'],
            borderColor: ['rgba(52, 211, 153, 1)', 'rgba(96, 165, 250, 1)', 'rgba(251, 191, 36, 1)'],
            borderWidth: 2,
            hoverOffset: 6,
        }],
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: 'rgba(255,255,255,0.7)',
                    padding: 16,
                    usePointStyle: true,
                    pointStyleWidth: 10,
                    font: { size: 12 },
                },
            },
            tooltip: {
                backgroundColor: 'rgba(0,0,0,0.8)',
                padding: 10,
                cornerRadius: 8,
            },
        },
    };

    // Activity heatmap
    const days = activity?.days || [];
    const maxCount = Math.max(...days.map(d => d.count), 1);

    const getHeatColor = (count) => {
        if (count === 0) return 'bg-accent/20';
        const intensity = count / maxCount;
        if (intensity <= 0.25) return 'bg-emerald-900/60';
        if (intensity <= 0.5) return 'bg-emerald-700/70';
        if (intensity <= 0.75) return 'bg-emerald-500/80';
        return 'bg-emerald-400';
    };

    // Organize heatmap into weeks (columns)
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
        weeks.push(days.slice(i, i + 7));
    }

    const tabConfig = {
        coding: { label: 'Coding', icon: Code, color: 'text-emerald-400', barColor: 'bg-emerald-500' },
        ds: { label: 'Data Structures', icon: Brain, color: 'text-blue-400', barColor: 'bg-blue-500' },
        aptitude: { label: 'Aptitude', icon: BookOpen, color: 'text-amber-400', barColor: 'bg-amber-500' },
    };

    const currentTopics = topics?.[activeTab] || [];

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/15">
                    <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold">Analytics</h1>
                    <p className="text-sm text-muted-foreground">Track your preparation progress</p>
                </div>
            </motion.div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((card, i) => (
                    <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className={`p-5 rounded-xl bg-gradient-to-br ${card.bg} border ${card.border}`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <card.icon className={`h-5 w-5 ${card.color}`} />
                            <Zap className="h-3 w-3 text-muted-foreground/30" />
                        </div>
                        <p className="text-2xl font-bold">{card.value}</p>
                        <p className="text-xs text-muted-foreground mt-1">{card.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-5 gap-6">
                {/* Doughnut Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="lg:col-span-2 p-6 rounded-xl bg-card border border-border/30"
                >
                    <h2 className="text-sm font-semibold mb-1">Problems by Category</h2>
                    <p className="text-xs text-muted-foreground mb-4">Distribution of solved problems</p>
                    <div className="h-56">
                        <Doughnut data={doughnutData} options={doughnutOptions} />
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-4">
                        {[
                            { label: 'Coding', solved: byType.coding.solved, total: byType.coding.total, color: 'text-emerald-400' },
                            { label: 'DS', solved: byType.ds.solved, total: byType.ds.total, color: 'text-blue-400' },
                            { label: 'Aptitude', solved: byType.aptitude.solved, total: byType.aptitude.total, color: 'text-amber-400' },
                        ].map(item => (
                            <div key={item.label} className="text-center p-2 rounded-lg bg-accent/10">
                                <p className={`text-lg font-bold ${item.color}`}>{item.solved}</p>
                                <p className="text-[10px] text-muted-foreground">/ {item.total}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Activity Heatmap */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-3 p-6 rounded-xl bg-card border border-border/30"
                >
                    <h2 className="text-sm font-semibold mb-1">Activity</h2>
                    <p className="text-xs text-muted-foreground mb-4">Your submission activity over the last 12 weeks</p>
                    <div className="flex gap-[3px] overflow-x-auto pb-2">
                        {/* Day labels */}
                        <div className="flex flex-col gap-[3px] mr-1 flex-shrink-0">
                            {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((label, i) => (
                                <div key={i} className="h-[14px] flex items-center">
                                    <span className="text-[9px] text-muted-foreground/50 w-6 text-right">{label}</span>
                                </div>
                            ))}
                        </div>
                        {weeks.map((week, wi) => (
                            <div key={wi} className="flex flex-col gap-[3px]">
                                {week.map((day, di) => (
                                    <div
                                        key={di}
                                        className={`w-[14px] h-[14px] rounded-[3px] ${getHeatColor(day.count)} transition-colors`}
                                        title={`${day.date}: ${day.count} submission${day.count !== 1 ? 's' : ''}`}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                        <span className="text-[10px] text-muted-foreground/50">Less</span>
                        {['bg-accent/20', 'bg-emerald-900/60', 'bg-emerald-700/70', 'bg-emerald-500/80', 'bg-emerald-400'].map((c, i) => (
                            <div key={i} className={`w-[10px] h-[10px] rounded-[2px] ${c}`} />
                        ))}
                        <span className="text-[10px] text-muted-foreground/50">More</span>
                    </div>
                </motion.div>
            </div>

            {/* Topic-wise Progress */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="p-6 rounded-xl bg-card border border-border/30"
            >
                <h2 className="text-sm font-semibold mb-1">Topic-wise Progress</h2>
                <p className="text-xs text-muted-foreground mb-4">Your progress across different topics</p>

                {/* Tab Buttons */}
                <div className="flex gap-2 mb-6">
                    {Object.entries(tabConfig).map(([key, cfg]) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeTab === key
                                    ? 'bg-accent/30 text-foreground border border-border/40'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/10'
                                }`}
                        >
                            <cfg.icon className={`h-3.5 w-3.5 ${activeTab === key ? cfg.color : ''}`} />
                            {cfg.label}
                        </button>
                    ))}
                </div>

                {/* Progress Bars */}
                {currentTopics.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-sm text-muted-foreground">No topics available yet</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {currentTopics.map((tp, i) => {
                            const pct = tp.total > 0 ? Math.round((tp.solved / tp.total) * 100) : 0;
                            return (
                                <div key={i}>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-xs font-medium">{tp.topic}</span>
                                        <span className="text-[10px] text-muted-foreground">
                                            {tp.solved}/{tp.total} ({pct}%)
                                        </span>
                                    </div>
                                    <div className="h-2 bg-accent/20 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${pct}%` }}
                                            transition={{ duration: 0.8, delay: i * 0.05, ease: 'easeOut' }}
                                            className={`h-full rounded-full ${tabConfig[activeTab].barColor}`}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default Analytics;

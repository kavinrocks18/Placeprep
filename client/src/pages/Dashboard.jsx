import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../lib/axios';
import { FileText, CheckCircle, Clock, TrendingUp, ArrowRight, Code, Briefcase, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import ProblemOfTheDay from '../components/ProblemOfTheDay';
import AptitudePOTD from '../components/AptitudePOTD';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({
        totalApplications: 0,
        solvedCount: 0,
        interviewsPending: 0,
        currentStreak: 0,
    });
    const [recentApplications, setRecentApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [appsRes, userStatsRes, streakRes] = await Promise.all([
                    api.get('/applications'),
                    api.get('/users/stats'),
                    api.get('/potd/streak').catch(() => ({ data: null })),
                ]);

                const apps = appsRes.data;
                const interviews = apps.filter(app => app.status === 'Interview').length;

                setStats({
                    totalApplications: apps.length,
                    solvedCount: userStatsRes.data?.solvedCount || 0,
                    interviewsPending: interviews,
                    currentStreak: streakRes.data?.currentStreak || 0,
                });
                setRecentApplications(apps.slice(0, 5));
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const statCards = [
        {
            icon: <FileText className="h-5 w-5" />,
            label: 'Total Applications',
            value: stats.totalApplications,
            color: 'bg-blue-500/10 text-blue-400',
        },
        {
            icon: <CheckCircle className="h-5 w-5" />,
            label: 'Problems Solved',
            value: stats.solvedCount,
            color: 'bg-primary/10 text-primary',
        },
        {
            icon: <Flame className="h-5 w-5" />,
            label: 'Current Streak',
            value: `${stats.currentStreak} days`,
            color: 'bg-orange-500/10 text-orange-400',
        },
        {
            icon: <Clock className="h-5 w-5" />,
            label: 'Interviews Pending',
            value: stats.interviewsPending,
            color: 'bg-amber-500/10 text-amber-400',
        },
    ];

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Interview': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'Offer': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'Rejected': return 'bg-red-500/10 text-red-400 border-red-500/20';
            case 'Applied': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'Online Assessment': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold">
                        Welcome back, <span className="text-primary">{user?.name}</span>
                    </h1>
                    <p className="text-muted-foreground mt-1">Here's an overview of your placement journey.</p>
                </div>
                <div className="text-sm text-muted-foreground bg-card border border-border/30 px-4 py-2 rounded-xl">
                    {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {statCards.map((card, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="relative group bg-card border border-border/30 rounded-xl p-6 hover:border-primary/20 transition-all duration-300 overflow-hidden"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-xl ${card.color}`}>
                                {card.icon}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
                                <h3 className="text-2xl font-bold">{card.value}</h3>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Problems of the Day */}
            <div className="grid md:grid-cols-2 gap-6">
                <ProblemOfTheDay />
                <AptitudePOTD />
            </div>

            {/* Content Grid */}
            <div className="grid md:grid-cols-5 gap-6">
                {/* Recent Activity */}
                <div className="md:col-span-3 space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-primary" /> Recent Activity
                        </h2>
                        <Link to="/applications" className="text-sm text-primary hover:underline flex items-center gap-1">
                            View all <ArrowRight className="h-3 w-3" />
                        </Link>
                    </div>

                    {recentApplications.length > 0 ? (
                        <div className="bg-card rounded-xl border border-border/30 divide-y divide-border/20 overflow-hidden">
                            {recentApplications.map((app, idx) => (
                                <motion.div
                                    key={app._id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="p-4 flex justify-between items-center hover:bg-accent/20 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/10">
                                            <Briefcase className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-sm">{app.company}</h4>
                                            <p className="text-xs text-muted-foreground">{app.position}</p>
                                        </div>
                                    </div>
                                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${getStatusStyle(app.status)}`}>
                                        {app.status}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-card rounded-xl border border-dashed border-border/30 p-10 text-center">
                            <Briefcase className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                            <p className="text-muted-foreground mb-2">No recent activity.</p>
                            <Link to="/applications" className="text-primary hover:underline text-sm">
                                Add your first application →
                            </Link>
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="md:col-span-2 space-y-4">
                    <h2 className="text-lg font-semibold">Quick Actions</h2>
                    <div className="space-y-3">
                        <Link
                            to="/applications"
                            className="flex items-center gap-3 p-4 bg-card border border-border/30 rounded-xl hover:border-primary/20 transition-all group"
                        >
                            <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/15 transition-colors">
                                <FileText className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">Log Application</p>
                                <p className="text-xs text-muted-foreground">Track a new job application</p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </Link>

                        <Link
                            to="/practice"
                            className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/15 rounded-xl hover:border-primary/30 transition-all group"
                        >
                            <div className="p-2 rounded-lg bg-primary/15 text-primary group-hover:bg-primary/20 transition-colors">
                                <Code className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">Start Practicing</p>
                                <p className="text-xs text-muted-foreground">Solve coding problems</p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </Link>

                        <Link
                            to="/resources"
                            className="flex items-center gap-3 p-4 bg-card border border-border/30 rounded-xl hover:border-primary/20 transition-all group"
                        >
                            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/15 transition-colors">
                                <TrendingUp className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">Learning Resources</p>
                                <p className="text-xs text-muted-foreground">Video tutorials & guides</p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </Link>
                    </div>

                    {/* Progress */}
                    <div className="bg-card border border-border/30 rounded-xl p-5">
                        <h3 className="text-sm font-semibold mb-3">Daily Progress</h3>
                        <div className="space-y-3">
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-muted-foreground">Problems Solved</span>
                                    <span className="font-medium">{stats.solvedCount}/50</span>
                                </div>
                                <div className="w-full bg-accent/30 rounded-full h-2">
                                    <div
                                        className="bg-primary h-2 rounded-full transition-all duration-700"
                                        style={{ width: `${Math.min((stats.solvedCount / 50) * 100, 100)}%` }}
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-muted-foreground">Applications</span>
                                    <span className="font-medium">{stats.totalApplications}/100</span>
                                </div>
                                <div className="w-full bg-accent/30 rounded-full h-2">
                                    <div
                                        className="bg-blue-500 h-2 rounded-full transition-all duration-700"
                                        style={{ width: `${Math.min((stats.totalApplications / 100) * 100, 100)}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

import { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import api from '../lib/axios';
import { User, Mail, Award, Code, Calendar, CheckCircle, TrendingUp, BookOpen } from 'lucide-react';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({ solvedCount: 0, solvedQuestions: [] });
    const [appCount, setAppCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, appsRes] = await Promise.all([
                    api.get('/users/stats'),
                    api.get('/applications'),
                ]);
                setStats(statsRes.data);
                setAppCount(appsRes.data.length);
            } catch (error) {
                console.error('Error fetching profile data:', error);
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

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
            {/* Profile Header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600/20 via-purple-600/10 to-cyan-500/20 border border-border/50 p-8">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-violet-500/10 to-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6">
                    {/* Avatar */}
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center ring-4 ring-background shadow-lg shadow-violet-500/20">
                            <span className="text-3xl font-bold text-white">{user?.name?.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
                            <CheckCircle className="h-3.5 w-3.5 text-white" />
                        </div>
                    </div>

                    {/* Info */}
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl font-bold mb-1">{user?.name}</h1>
                        <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground mb-3">
                            <Mail className="h-4 w-4" />
                            <span className="text-sm">{user?.email}</span>
                        </div>
                        <div className="flex items-center justify-center md:justify-start gap-2">
                            <span className="px-3 py-1 text-xs font-medium bg-violet-500/10 text-violet-400 rounded-full border border-violet-500/20">
                                {user?.role === 'admin' ? '👑 Admin' : '👤 Student'}
                            </span>
                            <span className="px-3 py-1 text-xs font-medium bg-cyan-500/10 text-cyan-400 rounded-full border border-cyan-500/20">
                                <Calendar className="h-3 w-3 inline mr-1" />
                                Joined {new Date(user?.createdAt || Date.now()).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-card border border-border/50 rounded-xl p-6 hover:border-violet-500/30 transition-colors group">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400 group-hover:bg-violet-500/20 transition-colors">
                            <Code className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">Problems Solved</span>
                    </div>
                    <p className="text-3xl font-bold">{stats.solvedCount}</p>
                </div>

                <div className="bg-card border border-border/50 rounded-xl p-6 hover:border-cyan-500/30 transition-colors group">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
                            <BookOpen className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">Applications</span>
                    </div>
                    <p className="text-3xl font-bold">{appCount}</p>
                </div>

                <div className="bg-card border border-border/50 rounded-xl p-6 hover:border-amber-500/30 transition-colors group">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20 transition-colors">
                            <TrendingUp className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">Success Rate</span>
                    </div>
                    <p className="text-3xl font-bold">{appCount > 0 ? Math.round((stats.solvedCount / (appCount + stats.solvedCount)) * 100) : 0}%</p>
                </div>
            </div>

            {/* Solved Questions */}
            <div className="bg-card border border-border/50 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Achievements
                </h2>
                {stats.solvedCount > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {stats.solvedQuestions.map((q, idx) => (
                            <div key={q._id || idx} className="flex items-center gap-3 p-3 rounded-lg bg-accent/30 border border-border/30">
                                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                <span className="text-sm font-medium">{q.title || `Problem #${idx + 1}`}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <Code className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                        <p className="text-muted-foreground">No problems solved yet. Start practicing!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;

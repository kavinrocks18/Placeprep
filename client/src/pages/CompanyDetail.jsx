import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft, Building2, ChevronRight, Clock, Lightbulb, Star,
    CheckCircle2, AlertCircle, Tag, IndianRupee, BookOpen, Zap,
    Brain, Code, MessageSquare, BarChart3
} from 'lucide-react';
import api from '../lib/axios';

const TAG_COLORS = {
    DSA: { bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20', icon: Code },
    Core: { bg: 'bg-blue-500/15 text-blue-400 border-blue-500/20', icon: BookOpen },
    HR: { bg: 'bg-purple-500/15 text-purple-400 border-purple-500/20', icon: MessageSquare },
    Aptitude: { bg: 'bg-amber-500/15 text-amber-400 border-amber-500/20', icon: Brain },
    'System Design': { bg: 'bg-rose-500/15 text-rose-400 border-rose-500/20', icon: BarChart3 },
};

const DIFF_BADGE = {
    Easy: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
    Medium: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
    Hard: 'bg-rose-500/15 text-rose-400 border-rose-500/25',
};

const PRIORITY_DOT = { High: 'bg-rose-400', Medium: 'bg-amber-400', Low: 'bg-blue-400' };
const FREQ_BADGE = {
    'Very Common': 'text-emerald-400',
    'Common': 'text-amber-400',
    'Rare': 'text-muted-foreground',
};

const CompanyDetail = () => {
    const { slug } = useParams();
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTag, setActiveTag] = useState('All');
    const [activeSection, setActiveSection] = useState('rounds');

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const res = await api.get(`/companies/${slug}`);
                setCompany(res.data);
            } catch (err) {
                console.error('Error fetching company:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCompany();
    }, [slug]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-muted-foreground">Loading company data...</p>
                </div>
            </div>
        );
    }

    if (!company) {
        return (
            <div className="text-center py-16">
                <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground">Company not found</p>
                <Link to="/companies" className="text-primary text-sm mt-2 inline-block hover:underline">← Back to Companies</Link>
            </div>
        );
    }

    const allTags = ['All', ...new Set([
        ...(company.importantTopics?.map(t => t.tag) || []),
        ...(company.previousQuestions?.map(q => q.tag) || []),
    ])];

    const filteredQuestions = activeTag === 'All'
        ? company.previousQuestions
        : company.previousQuestions?.filter(q => q.tag === activeTag);

    const filteredTopics = activeTag === 'All'
        ? company.importantTopics
        : company.importantTopics?.filter(t => t.tag === activeTag);

    const sections = [
        { key: 'rounds', label: 'Interview Rounds', count: company.interviewRounds?.length },
        { key: 'topics', label: 'Important Topics', count: company.importantTopics?.length },
        { key: 'questions', label: 'Previous Questions', count: company.previousQuestions?.length },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Back Link */}
            <Link to="/companies" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="h-4 w-4" /> Back to Companies
            </Link>

            {/* Company Header */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-xl bg-card border border-border/30">
                <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/15 flex items-center justify-center flex-shrink-0">
                        <span className="text-xl font-bold text-primary">{company.companyName[0]}</span>
                    </div>
                    <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h1 className="text-2xl font-bold">{company.companyName}</h1>
                            <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${DIFF_BADGE[company.difficultyLevel]}`}>
                                {company.difficultyLevel}
                            </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 mb-3">
                            <span className="text-xs text-muted-foreground">{company.industry}</span>
                            {company.averagePackage && (
                                <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                                    <IndianRupee className="h-3 w-3" /> {company.averagePackage}
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{company.overview}</p>
                    </div>
                </div>
            </motion.div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3">
                {[
                    { label: 'Interview Rounds', value: company.interviewRounds?.length || 0, color: 'from-blue-500/15 to-blue-600/5 border-blue-500/20' },
                    { label: 'Key Topics', value: company.importantTopics?.length || 0, color: 'from-emerald-500/15 to-emerald-600/5 border-emerald-500/20' },
                    { label: 'Past Questions', value: company.previousQuestions?.length || 0, color: 'from-amber-500/15 to-amber-600/5 border-amber-500/20' },
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.05 }}
                        className={`p-4 rounded-xl bg-gradient-to-br ${stat.color} border text-center`}
                    >
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Section Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1">
                {sections.map(s => (
                    <button
                        key={s.key}
                        onClick={() => setActiveSection(s.key)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium border whitespace-nowrap transition-all ${activeSection === s.key
                                ? 'bg-primary/15 border-primary/30 text-primary'
                                : 'bg-card border-border/30 text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        {s.label}
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent/30">{s.count}</span>
                    </button>
                ))}
            </div>

            {/* Tag Filter (for topics & questions) */}
            {(activeSection === 'topics' || activeSection === 'questions') && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-2">
                    {allTags.map(tag => (
                        <button
                            key={tag}
                            onClick={() => setActiveTag(tag)}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${activeTag === tag
                                    ? 'bg-accent/30 text-foreground border-border/40'
                                    : 'text-muted-foreground hover:text-foreground bg-card border-border/20 hover:border-border/40'
                                }`}
                        >
                            {tag !== 'All' && TAG_COLORS[tag] && (() => {
                                const Icon = TAG_COLORS[tag].icon;
                                return <Icon className="h-3 w-3" />;
                            })()}
                            {tag}
                        </button>
                    ))}
                </motion.div>
            )}

            {/* Interview Rounds */}
            {activeSection === 'rounds' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                    {company.interviewRounds?.map((round, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className="p-5 rounded-xl bg-card border border-border/30 group"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center flex-shrink-0">
                                    <span className="text-sm font-bold text-primary">{round.roundNumber}</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                        <h3 className="font-semibold text-sm">{round.roundName}</h3>
                                        {round.duration && (
                                            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                                <Clock className="h-3 w-3" /> {round.duration}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed mb-3">{round.description}</p>
                                    {round.tips?.length > 0 && (
                                        <div className="space-y-1.5">
                                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-semibold">Tips</p>
                                            {round.tips.map((tip, ti) => (
                                                <div key={ti} className="flex items-start gap-2">
                                                    <Lightbulb className="h-3 w-3 text-amber-400 mt-0.5 flex-shrink-0" />
                                                    <span className="text-xs text-muted-foreground">{tip}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* Important Topics */}
            {activeSection === 'topics' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                    {filteredTopics?.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-sm text-muted-foreground">No topics match this filter</p>
                        </div>
                    ) : (
                        filteredTopics?.map((topic, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="flex items-center justify-between p-4 rounded-xl bg-card border border-border/30"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${PRIORITY_DOT[topic.priority]}`} />
                                    <span className="text-sm">{topic.topic}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${TAG_COLORS[topic.tag]?.bg}`}>{topic.tag}</span>
                                    <span className="text-[10px] text-muted-foreground">{topic.priority}</span>
                                </div>
                            </motion.div>
                        ))
                    )}
                </motion.div>
            )}

            {/* Previous Questions */}
            {activeSection === 'questions' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                    {filteredQuestions?.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-sm text-muted-foreground">No questions match this filter</p>
                        </div>
                    ) : (
                        filteredQuestions?.map((q, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="p-4 rounded-xl bg-card border border-border/30"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <p className="text-sm flex-1">{q.question}</p>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${TAG_COLORS[q.tag]?.bg}`}>{q.tag}</span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${DIFF_BADGE[q.difficulty]}`}>{q.difficulty}</span>
                                        <span className={`text-[10px] ${FREQ_BADGE[q.frequency]}`}>{q.frequency}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </motion.div>
            )}
        </div>
    );
};

export default CompanyDetail;

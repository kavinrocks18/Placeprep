import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, ChevronRight, Filter, Search, Star, Users, IndianRupee } from 'lucide-react';
import api from '../lib/axios';

const TAG_COLORS = {
    DSA: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    Core: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    HR: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
    Aptitude: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    'System Design': 'bg-rose-500/15 text-rose-400 border-rose-500/20',
};

const DIFFICULTY_COLORS = {
    Easy: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
    Medium: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
    Hard: 'bg-rose-500/15 text-rose-400 border-rose-500/25',
};

const Companies = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState('All');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const res = await api.get('/companies');
                setCompanies(res.data);
            } catch (err) {
                console.error('Error fetching companies:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCompanies();
    }, []);

    const filtered = companies.filter(c => {
        const matchesSearch = c.companyName.toLowerCase().includes(search.toLowerCase());
        const matchesDiff = difficultyFilter === 'All' || c.difficultyLevel === difficultyFilter;
        return matchesSearch && matchesDiff;
    });

    const getUniqueTags = (topics) => {
        const tags = [...new Set(topics?.map(t => t.tag) || [])];
        return tags.slice(0, 4);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-muted-foreground">Loading companies...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-3 mb-1">
                    <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/15">
                        <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Company Roadmaps</h1>
                        <p className="text-sm text-muted-foreground">Prepare for specific companies with detailed interview guides</p>
                    </div>
                </div>
            </motion.div>

            {/* Search & Filters */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search companies..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                    />
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="sm:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border/30 text-sm"
                >
                    <Filter className="h-4 w-4" /> Filters
                </button>
                <div className={`flex gap-2 ${showFilters ? 'flex' : 'hidden sm:flex'}`}>
                    {['All', 'Easy', 'Medium', 'Hard'].map(level => (
                        <button
                            key={level}
                            onClick={() => setDifficultyFilter(level)}
                            className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all ${difficultyFilter === level
                                    ? 'bg-primary/15 border-primary/30 text-primary'
                                    : 'bg-card border-border/30 text-muted-foreground hover:text-foreground hover:border-border/50'
                                }`}
                        >
                            {level}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Company Grid */}
            {filtered.length === 0 ? (
                <div className="text-center py-16">
                    <Building2 className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                    <p className="text-muted-foreground">No companies match your filters</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((company, i) => (
                        <motion.div
                            key={company._id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06 }}
                        >
                            <Link
                                to={`/companies/${company.slug}`}
                                className="block p-5 rounded-xl bg-card border border-border/30 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group h-full"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/15 flex items-center justify-center">
                                            <span className="text-sm font-bold text-primary">{company.companyName[0]}</span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{company.companyName}</h3>
                                            <p className="text-[10px] text-muted-foreground">{company.industry}</p>
                                        </div>
                                    </div>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${DIFFICULTY_COLORS[company.difficultyLevel]}`}>
                                        {company.difficultyLevel}
                                    </span>
                                </div>

                                <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed">{company.overview}</p>

                                {company.averagePackage && (
                                    <div className="flex items-center gap-1.5 mb-3">
                                        <IndianRupee className="h-3 w-3 text-emerald-400" />
                                        <span className="text-xs text-emerald-400 font-medium">{company.averagePackage}</span>
                                    </div>
                                )}

                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    {getUniqueTags(company.importantTopics).map(tag => (
                                        <span key={tag} className={`text-[10px] px-2 py-0.5 rounded-full border ${TAG_COLORS[tag]}`}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex items-center text-xs text-primary font-medium group-hover:gap-2 gap-1 transition-all">
                                    View Roadmap <ChevronRight className="h-3.5 w-3.5" />
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Companies;

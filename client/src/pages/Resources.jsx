import { useState, useEffect } from 'react';
import api from '../lib/axios';
import { Search, Bookmark, BookmarkCheck, ExternalLink, Filter, Play, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Resources = () => {
    const [resources, setResources] = useState([]);
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterDifficulty, setFilterDifficulty] = useState('All');
    const [showBookmarked, setShowBookmarked] = useState(false);
    const [expandedCard, setExpandedCard] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resourcesRes, bookmarksRes] = await Promise.all([
                    api.get('/resources'),
                    api.get('/resources/bookmarks').catch(() => ({ data: { bookmarks: [] } })),
                ]);

                if (resourcesRes.data.length === 0) {
                    await api.post('/resources/seed');
                    const seeded = await api.get('/resources');
                    setResources(seeded.data);
                } else {
                    setResources(resourcesRes.data);
                }

                setBookmarks(bookmarksRes.data?.bookmarks || []);
            } catch (error) {
                console.error('Error fetching resources:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const toggleBookmark = async (resourceId) => {
        try {
            const { data } = await api.post(`/resources/bookmark/${resourceId}`);
            setBookmarks(data.bookmarks);
        } catch (error) {
            console.error('Error toggling bookmark:', error);
        }
    };

    const isBookmarked = (id) => bookmarks.includes(id);

    const getDifficultyStyle = (diff) => {
        switch (diff) {
            case 'Beginner': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'Intermediate': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'Advanced': return 'bg-red-500/10 text-red-400 border-red-500/20';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    const getCategoryStyle = (cat) => {
        switch (cat) {
            case 'DSA': return 'bg-primary/10 text-primary border-primary/20';
            case 'Core CS': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    const filteredResources = resources.filter(r => {
        const matchesSearch = r.topicName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'All' || r.category === filterCategory;
        const matchesDifficulty = filterDifficulty === 'All' || r.difficulty === filterDifficulty;
        const matchesBookmark = !showBookmarked || isBookmarked(r._id);
        return matchesSearch && matchesCategory && matchesDifficulty && matchesBookmark;
    });

    const SkeletonCard = () => (
        <div className="bg-card border border-border/30 rounded-xl p-5 animate-pulse">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-accent/30 rounded-xl" />
                <div className="flex-1">
                    <div className="h-4 bg-accent/30 rounded w-2/3 mb-2" />
                    <div className="h-3 bg-accent/30 rounded w-1/3" />
                </div>
            </div>
            <div className="h-3 bg-accent/30 rounded w-full mb-2" />
            <div className="h-3 bg-accent/30 rounded w-4/5" />
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto animate-fade-in-up">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Learning Resources</h1>
                <p className="text-muted-foreground">Curated video tutorials and guides for placement preparation.</p>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col md:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search topics..."
                        className="w-full pl-10 pr-4 py-2.5 border border-border/30 rounded-xl bg-card focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <select
                            className="border border-border/30 rounded-xl px-3 py-2.5 bg-card text-sm transition-all focus:ring-2 focus:ring-primary/30"
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                        >
                            <option value="All">All Categories</option>
                            <option value="DSA">DSA</option>
                            <option value="Core CS">Core CS</option>
                        </select>
                    </div>
                    <select
                        className="border border-border/30 rounded-xl px-3 py-2.5 bg-card text-sm transition-all focus:ring-2 focus:ring-primary/30"
                        value={filterDifficulty}
                        onChange={(e) => setFilterDifficulty(e.target.value)}
                    >
                        <option value="All">All Levels</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                    </select>
                    <button
                        onClick={() => setShowBookmarked(!showBookmarked)}
                        className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all border ${showBookmarked
                                ? 'bg-primary/10 border-primary/30 text-primary'
                                : 'bg-card border-border/30 text-muted-foreground hover:border-primary/20'
                            }`}
                    >
                        <Bookmark className="h-3.5 w-3.5" />
                        Saved
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
            ) : filteredResources.length === 0 ? (
                <div className="text-center py-20 bg-card rounded-xl border border-dashed border-border/30">
                    <Search className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground">No resources found matching your criteria.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredResources.map((resource, idx) => (
                        <motion.div
                            key={resource._id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.04 }}
                            className="bg-card border border-border/30 rounded-xl overflow-hidden hover:border-primary/20 transition-all duration-300 group"
                        >
                            <div className="p-5">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary/8 border border-primary/10 flex items-center justify-center text-lg group-hover:bg-primary/12 transition-colors">
                                            {resource.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{resource.topicName}</h3>
                                            <div className="flex items-center gap-1.5 mt-1">
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${getDifficultyStyle(resource.difficulty)}`}>
                                                    {resource.difficulty}
                                                </span>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${getCategoryStyle(resource.category)}`}>
                                                    {resource.category}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => toggleBookmark(resource._id)}
                                        className="p-1.5 rounded-lg hover:bg-accent/30 transition-colors"
                                    >
                                        {isBookmarked(resource._id) ? (
                                            <BookmarkCheck className="h-4 w-4 text-primary" />
                                        ) : (
                                            <Bookmark className="h-4 w-4 text-muted-foreground/40 hover:text-muted-foreground" />
                                        )}
                                    </button>
                                </div>

                                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3">
                                    {resource.description}
                                </p>

                                <button
                                    onClick={() => setExpandedCard(expandedCard === resource._id ? null : resource._id)}
                                    className="w-full flex items-center justify-between px-3 py-2 bg-accent/20 rounded-lg text-xs font-medium text-muted-foreground hover:bg-accent/30 transition-colors"
                                >
                                    <span className="flex items-center gap-1.5">
                                        <Play className="h-3 w-3 text-primary" />
                                        {resource.videoLinks.length} Videos
                                    </span>
                                    {expandedCard === resource._id ? (
                                        <ChevronUp className="h-3.5 w-3.5" />
                                    ) : (
                                        <ChevronDown className="h-3.5 w-3.5" />
                                    )}
                                </button>
                            </div>

                            <AnimatePresence>
                                {expandedCard === resource._id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="border-t border-border/20 p-4 space-y-3 bg-accent/5">
                                            {resource.videoLinks.map((video, vIdx) => (
                                                <div key={vIdx} className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-medium text-foreground">{video.title}</span>
                                                        <a
                                                            href={video.url.replace('/embed/', '/watch?v=')}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-muted-foreground/50 hover:text-primary transition-colors"
                                                        >
                                                            <ExternalLink className="h-3 w-3" />
                                                        </a>
                                                    </div>
                                                    <div className="aspect-video rounded-lg overflow-hidden border border-border/20">
                                                        <iframe
                                                            src={video.url}
                                                            title={video.title}
                                                            className="w-full h-full"
                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                            allowFullScreen
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Resources;

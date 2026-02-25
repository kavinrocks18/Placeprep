import { useState, useEffect } from 'react';
import api from '../lib/axios';
import { Plus, Search, Filter, Edit2, Trash2, Briefcase, Calendar, StickyNote } from 'lucide-react';
import ApplicationForm from '../components/ApplicationForm';
import { motion } from 'framer-motion';

const Applications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingApp, setEditingApp] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    const fetchApplications = async () => {
        try {
            const { data } = await api.get('/applications');
            setApplications(data);
        } catch (error) {
            console.error('Error fetching applications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this application?')) {
            try {
                await api.delete(`/applications/${id}`);
                setApplications(applications.filter(app => app._id !== id));
            } catch (error) {
                console.error('Error deleting application:', error);
            }
        }
    };

    const handleEdit = (app) => {
        setEditingApp(app);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingApp(null);
        setIsModalOpen(true);
    };

    const filteredApplications = applications.filter(app => {
        const matchesSearch = app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.position.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'All' || app.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Applied': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'Online Assessment': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            case 'Interview': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'Offer': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'Rejected': return 'bg-red-500/10 text-red-400 border-red-500/20';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    return (
        <div className="animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Applications</h1>
                    <p className="text-muted-foreground mt-1">Track and manage your job applications.</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="inline-flex items-center px-5 py-2.5 bg-primary text-black rounded-xl font-semibold hover:bg-lime-400 transition-all duration-300 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30"
                >
                    <Plus className="h-4 w-4 mr-2" /> Add Application
                </button>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search companies or positions..."
                        className="w-full pl-10 pr-4 py-2.5 border border-border/50 rounded-xl bg-card focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <select
                        className="border border-border/50 rounded-xl px-4 py-2.5 bg-card focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm transition-all"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="All">All Status</option>
                        <option value="Applied">Applied</option>
                        <option value="Online Assessment">Online Assessment</option>
                        <option value="Interview">Interview</option>
                        <option value="Offer">Offer</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Applications Grid */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            ) : filteredApplications.length === 0 ? (
                <div className="text-center py-20 bg-card rounded-xl border border-dashed border-border/50">
                    <Briefcase className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground mb-2">No applications found.</p>
                    <button onClick={handleAdd} className="text-primary hover:underline text-sm">
                        Add your first application →
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredApplications.map((app, idx) => (
                        <motion.div
                            key={app._id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="group bg-card border border-border/50 rounded-xl p-5 hover:border-primary/20 transition-all duration-300 relative overflow-hidden"
                        >
                            {/* Status accent */}
                            <div className={`absolute top-0 left-0 right-0 h-0.5 ${app.status === 'Offer' ? 'bg-gradient-to-r from-emerald-500 to-green-500' :
                                app.status === 'Interview' ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
                                    app.status === 'Rejected' ? 'bg-gradient-to-r from-red-500 to-rose-500' :
                                        app.status === 'Online Assessment' ? 'bg-gradient-to-r from-purple-500 to-violet-500' :
                                            'bg-gradient-to-r from-blue-500 to-cyan-500'
                                } opacity-50 group-hover:opacity-100 transition-opacity`} />

                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center border border-violet-500/10">
                                        <span className="text-sm font-bold text-violet-400">{app.company.charAt(0)}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-sm">{app.company}</h3>
                                        <p className="text-xs text-muted-foreground">{app.position}</p>
                                    </div>
                                </div>
                                <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${getStatusStyle(app.status)}`}>
                                    {app.status}
                                </span>
                            </div>

                            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(app.dateApplied).toLocaleDateString()}
                                </span>
                                {app.notes && (
                                    <span className="flex items-center gap-1">
                                        <StickyNote className="h-3 w-3" />
                                        Has notes
                                    </span>
                                )}
                            </div>

                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleEdit(app)}
                                    className="p-2 rounded-lg hover:bg-blue-500/10 text-blue-400 transition-colors"
                                    title="Edit"
                                >
                                    <Edit2 className="h-3.5 w-3.5" />
                                </button>
                                <button
                                    onClick={() => handleDelete(app._id)}
                                    className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <ApplicationForm
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={fetchApplications}
                    initialData={editingApp}
                />
            )}
        </div>
    );
};

export default Applications;

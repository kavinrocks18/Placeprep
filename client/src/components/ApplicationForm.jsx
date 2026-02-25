import { useState } from 'react';
import api from '../lib/axios';
import { X, Loader } from 'lucide-react';

const ApplicationForm = ({ onClose, onSuccess, initialData = null }) => {
    const [formData, setFormData] = useState({
        company: initialData?.company || '',
        position: initialData?.position || '',
        status: initialData?.status || 'Applied',
        dateApplied: initialData?.dateApplied ? new Date(initialData.dateApplied).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        notes: initialData?.notes || '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (initialData) {
                await api.put(`/applications/${initialData._id}`, formData);
            } else {
                await api.post('/applications', formData);
            }
            onSuccess();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div
                className="bg-card/95 backdrop-blur-xl w-full max-w-md p-6 rounded-2xl shadow-2xl relative border border-border/50 animate-fade-in-up"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
                    <X className="h-5 w-5" />
                </button>

                <h2 className="text-xl font-bold mb-6">{initialData ? 'Edit Application' : 'New Application'}</h2>

                {error && (
                    <div className="bg-destructive/10 text-destructive border border-destructive/20 p-3 rounded-xl mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Company</label>
                        <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-border/50 rounded-xl bg-background/50 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                            placeholder="e.g. Google"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Position</label>
                        <input
                            type="text"
                            name="position"
                            value={formData.position}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-border/50 rounded-xl bg-background/50 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                            placeholder="e.g. Software Engineer"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-border/50 rounded-xl bg-background/50 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                            >
                                <option value="Applied">Applied</option>
                                <option value="Online Assessment">Online Assessment</option>
                                <option value="Interview">Interview</option>
                                <option value="Offer">Offer</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Date</label>
                            <input
                                type="date"
                                name="dateApplied"
                                value={formData.dateApplied}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-border/50 rounded-xl bg-background/50 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Notes</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-4 py-2.5 border border-border/50 rounded-xl bg-background/50 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm resize-none"
                            placeholder="Add any notes..."
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white py-2.5 rounded-xl font-semibold hover:from-violet-500 hover:to-purple-500 transition-all duration-300 shadow-md shadow-violet-500/20 flex justify-center disabled:opacity-60"
                    >
                        {loading ? <Loader className="animate-spin h-5 w-5" /> : (initialData ? 'Update' : 'Save Application')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ApplicationForm;

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Loader, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../lib/axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh] relative">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-amber-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="relative w-full max-w-md px-4">
                <div className="bg-card/80 backdrop-blur-xl border border-border/30 p-8 rounded-2xl shadow-2xl shadow-black/20">
                    <AnimatePresence mode="wait">
                        {success ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-4"
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-5">
                                    <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                                </div>
                                <h2 className="text-xl font-bold mb-2">Check Your Email</h2>
                                <p className="text-sm text-muted-foreground mb-1">
                                    We've sent a password reset link to
                                </p>
                                <p className="text-sm font-semibold text-primary mb-4">{email}</p>
                                <p className="text-xs text-muted-foreground mb-6">
                                    The link will expire in 10 minutes. Check your spam folder if you don't see it.
                                </p>
                                <Link
                                    to="/login"
                                    className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium"
                                >
                                    <ArrowLeft className="h-4 w-4" /> Back to Login
                                </Link>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div className="text-center mb-8">
                                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-4">
                                        <KeyRound className="h-7 w-7 text-amber-400" />
                                    </div>
                                    <h2 className="text-2xl font-bold">Forgot Password?</h2>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Enter your email and we'll send you a reset link
                                    </p>
                                </div>

                                {error && (
                                    <div className="bg-destructive/10 text-destructive border border-destructive/20 p-3 rounded-xl mb-6 text-sm">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                                            <input
                                                type="email"
                                                className="w-full pl-10 pr-4 py-2.5 border border-border/30 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary/50 bg-background/50 transition-all text-sm"
                                                placeholder="you@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-primary text-black py-2.5 rounded-xl font-bold hover:bg-lime-400 transition-all duration-300 shadow-md shadow-primary/15 flex justify-center items-center disabled:opacity-60"
                                    >
                                        {isLoading ? <Loader className="animate-spin h-5 w-5" /> : 'Send Reset Link'}
                                    </button>
                                </form>

                                <div className="mt-6 text-center">
                                    <Link
                                        to="/login"
                                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
                                    >
                                        <ArrowLeft className="h-3.5 w-3.5" /> Back to Login
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;

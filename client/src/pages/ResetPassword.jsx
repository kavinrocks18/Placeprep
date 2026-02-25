import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock, Loader, ArrowLeft, ShieldCheck, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../lib/axios';

const ResetPassword = () => {
    const { resetToken } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        try {
            await api.put(`/auth/reset-password/${resetToken}`, { password });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password. The link may have expired.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh] relative">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px]" />
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
                                <h2 className="text-xl font-bold mb-2">Password Reset!</h2>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Your password has been updated successfully.
                                </p>
                                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-4">
                                    <Loader className="h-3 w-3 animate-spin" />
                                    Redirecting to login...
                                </div>
                                <Link
                                    to="/login"
                                    className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium"
                                >
                                    <ArrowLeft className="h-4 w-4" /> Go to Login
                                </Link>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div className="text-center mb-8">
                                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
                                        <ShieldCheck className="h-7 w-7 text-emerald-400" />
                                    </div>
                                    <h2 className="text-2xl font-bold">Set New Password</h2>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Choose a strong password for your account
                                    </p>
                                </div>

                                {error && (
                                    <div className="bg-destructive/10 text-destructive border border-destructive/20 p-3 rounded-xl mb-6 text-sm">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">New Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                className="w-full pl-10 pr-10 py-2.5 border border-border/30 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary/50 bg-background/50 transition-all text-sm"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                minLength={6}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Confirm Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                                            <input
                                                type={showConfirm ? 'text' : 'password'}
                                                className="w-full pl-10 pr-10 py-2.5 border border-border/30 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary/50 bg-background/50 transition-all text-sm"
                                                placeholder="••••••••"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                                minLength={6}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirm(!showConfirm)}
                                                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Password strength indicators */}
                                    {password && (
                                        <div className="space-y-1.5">
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4].map((i) => (
                                                    <div
                                                        key={i}
                                                        className={`h-1 flex-1 rounded-full transition-colors ${password.length >= i * 3
                                                                ? password.length >= 12
                                                                    ? 'bg-emerald-500'
                                                                    : password.length >= 8
                                                                        ? 'bg-amber-500'
                                                                        : 'bg-red-500'
                                                                : 'bg-accent/30'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-[10px] text-muted-foreground">
                                                {password.length < 6
                                                    ? 'Too short — minimum 6 characters'
                                                    : password.length < 8
                                                        ? 'Fair — consider a longer password'
                                                        : password.length < 12
                                                            ? 'Good password strength'
                                                            : 'Excellent password strength'}
                                            </p>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-primary text-black py-2.5 rounded-xl font-bold hover:bg-lime-400 transition-all duration-300 shadow-md shadow-primary/15 flex justify-center items-center disabled:opacity-60"
                                    >
                                        {isLoading ? <Loader className="animate-spin h-5 w-5" /> : 'Reset Password'}
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

export default ResetPassword;

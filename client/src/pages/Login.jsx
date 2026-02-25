import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Mail, Lock, Loader, Terminal } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import api from '../lib/axios';

const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, socialLogin } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setError('');
        setIsLoading(true);
        try {
            const { data } = await api.post('/auth/google', {
                credential: credentialResponse.credential,
            });
            socialLogin(data);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Google sign-in failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGitHubLogin = () => {
        if (!GITHUB_CLIENT_ID) {
            setError('GitHub login is not configured');
            return;
        }
        const redirectUri = `${window.location.origin}/auth/github/callback`;
        window.location.href = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user:email`;
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh] relative">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-green-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="relative w-full max-w-md px-4">
                <div className="bg-card/80 backdrop-blur-xl border border-border/30 p-8 rounded-2xl shadow-2xl shadow-black/20">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
                            <Terminal className="h-7 w-7 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold">Welcome Back</h2>
                        <p className="text-sm text-muted-foreground mt-1">Sign in to continue your journey</p>
                    </div>

                    {error && (
                        <div className="bg-destructive/10 text-destructive border border-destructive/20 p-3 rounded-xl mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Social Login Buttons */}
                    <div className="space-y-3 mb-6">
                        <div className="flex justify-center [&>div]:!w-full">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => setError('Google sign-in failed')}
                                theme="filled_black"
                                shape="pill"
                                size="large"
                                width="100%"
                                text="signin_with"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleGitHubLogin}
                            className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-border/30 bg-background/50 hover:bg-accent/20 transition-all text-sm font-medium"
                        >
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                            </svg>
                            Continue with GitHub
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border/20"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-card/80 px-3 text-xs text-muted-foreground">or continue with email</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium mb-2">Email</label>
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
                        <div>
                            <label className="block text-sm font-medium mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="password"
                                    className="w-full pl-10 pr-4 py-2.5 border border-border/30 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary/50 bg-background/50 transition-all text-sm"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex justify-end mt-1">
                                <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary text-black py-2.5 rounded-xl font-bold hover:bg-lime-400 transition-all duration-300 shadow-md shadow-primary/15 flex justify-center items-center disabled:opacity-60"
                        >
                            {isLoading ? <Loader className="animate-spin h-5 w-5" /> : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary font-medium hover:underline">
                            Create one
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

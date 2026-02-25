import { useEffect, useContext, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Loader, Github, AlertTriangle } from 'lucide-react';
import api from '../lib/axios';

const GitHubCallback = () => {
    const [searchParams] = useSearchParams();
    const { socialLogin } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    useEffect(() => {
        const code = searchParams.get('code');

        if (!code) {
            setError('No authorization code received from GitHub');
            return;
        }

        const exchangeCode = async () => {
            try {
                const { data } = await api.post('/auth/github', { code });
                socialLogin(data);
                navigate('/dashboard');
            } catch (err) {
                setError(err.response?.data?.message || 'GitHub authentication failed');
            }
        };

        exchangeCode();
    }, [searchParams, socialLogin, navigate]);

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="text-center max-w-sm">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-destructive/10 border border-destructive/20 mb-4">
                        <AlertTriangle className="h-7 w-7 text-destructive" />
                    </div>
                    <h2 className="text-xl font-bold mb-2">Authentication Failed</h2>
                    <p className="text-sm text-muted-foreground mb-4">{error}</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="px-6 py-2 bg-primary text-black rounded-xl font-semibold text-sm hover:bg-lime-400 transition-all"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/20 border border-border/20 mb-4">
                    <Github className="h-7 w-7 text-foreground" />
                </div>
                <h2 className="text-lg font-bold mb-2">Signing in with GitHub...</h2>
                <Loader className="animate-spin h-6 w-6 text-primary mx-auto" />
            </div>
        </div>
    );
};

export default GitHubCallback;

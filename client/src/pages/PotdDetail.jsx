import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../lib/axios';
import { ArrowLeft, CheckCircle, Tag, Zap } from 'lucide-react';
import CodeEditor from '../components/CodeEditor';

const PotdDetail = () => {
    const { slug } = useParams();
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const { data } = await api.get(`/potd/question/${slug}`);
                setQuestion(data);
            } catch (error) {
                console.error('Error fetching POTD question:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestion();
    }, [slug]);

    const handleRunSuccess = async () => {
        try {
            if (question) {
                await api.post('/potd/solve', { questionId: question._id });
            }
        } catch (error) {
            console.error('Error marking as solved:', error);
        }
    };

    const getDifficultyStyle = (diff) => {
        switch (diff) {
            case 'Easy': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'Medium': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'Hard': return 'bg-red-500/10 text-red-400 border-red-500/20';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!question) {
        return (
            <div className="text-center py-20">
                <p className="text-muted-foreground">Question not found</p>
                <Link to="/dashboard" className="text-primary hover:underline text-sm mt-2 inline-block">← Back to Dashboard</Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] animate-fade-in-up">
            <div className="flex items-center justify-between mb-4">
                <Link to="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground w-fit transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
                </Link>
                <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg bg-primary/8 border border-primary/15 text-primary font-medium">
                    <Zap className="h-3 w-3" />
                    Problem of the Day
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
                {/* Left Panel: Description */}
                <div className="bg-card border border-border/30 rounded-xl overflow-y-auto">
                    <div className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <h1 className="text-xl font-bold">{question.title}</h1>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getDifficultyStyle(question.difficulty)}`}>
                                {question.difficulty}
                            </span>
                        </div>

                        {/* Tags */}
                        {question.tags && question.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-4">
                                {question.tags.map(tag => (
                                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-primary/6 text-primary/70 border border-primary/10">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="prose prose-sm dark:prose-invert max-w-none">
                            <p className="text-muted-foreground leading-relaxed mb-6">{question.description}</p>

                            {/* Constraints */}
                            {question.constraints && (
                                <div className="mb-6">
                                    <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-2">Constraints</h3>
                                    <div className="bg-accent/20 border border-border/20 p-3 rounded-lg font-mono text-xs text-muted-foreground whitespace-pre-wrap">
                                        {question.constraints}
                                    </div>
                                </div>
                            )}

                            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">Examples</h3>
                            <div className="space-y-3">
                                {question.examples && question.examples.map((ex, idx) => (
                                    <div key={idx} className="bg-accent/30 border border-border/30 p-4 rounded-xl font-mono text-xs space-y-1">
                                        <div><span className="font-bold text-primary">Input:</span> <span className="text-muted-foreground">{ex.input}</span></div>
                                        <div><span className="font-bold text-cyan-400">Output:</span> <span className="text-muted-foreground">{ex.output}</span></div>
                                        {ex.explanation && <div><span className="font-bold text-amber-400">Explanation:</span> <span className="text-muted-foreground">{ex.explanation}</span></div>}
                                    </div>
                                ))}
                            </div>

                            {/* Test Cases Preview */}
                            {question.testCases && question.testCases.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <CheckCircle className="h-3.5 w-3.5 text-primary" />
                                        Test Cases ({question.testCases.length})
                                    </h3>
                                    <div className="space-y-2">
                                        {question.testCases.map((tc, idx) => (
                                            <div key={idx} className="flex items-center gap-3 bg-accent/20 border border-border/20 px-3 py-2 rounded-lg font-mono text-xs">
                                                <span className="text-muted-foreground/50 text-[10px] font-bold w-4">#{idx + 1}</span>
                                                <div className="flex-1 flex gap-4">
                                                    <span><span className="text-primary/70">In:</span> <span className="text-muted-foreground">{tc.input.replace(/\n/g, ', ')}</span></span>
                                                    <span><span className="text-cyan-400/70">Out:</span> <span className="text-muted-foreground">{tc.output}</span></span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Panel: Code Editor */}
                <CodeEditor
                    initialCode={question.starterCode}
                    onRunSuccess={handleRunSuccess}
                />
            </div>
        </div>
    );
};

export default PotdDetail;

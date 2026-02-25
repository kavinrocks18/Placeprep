import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText, Upload, Search, Target, AlertTriangle,
    CheckCircle2, XCircle, Lightbulb, BarChart3,
    TrendingUp, Zap, ChevronDown, ChevronRight, Sparkles
} from 'lucide-react';
import api from '../lib/axios';

const ResumeAnalyzer = () => {
    const [file, setFile] = useState(null);
    const [jobDescription, setJobDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [dragActive, setDragActive] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const fileInputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
        else if (e.type === 'dragleave') setDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files?.[0]?.type === 'application/pdf') {
            setFile(e.dataTransfer.files[0]);
            setError('');
        } else {
            setError('Please upload a PDF file');
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files?.[0]) {
            if (e.target.files[0].type === 'application/pdf') {
                setFile(e.target.files[0]);
                setError('');
            } else {
                setError('Please upload a PDF file');
            }
        }
    };

    const analyze = async () => {
        if (!file || !jobDescription.trim()) {
            setError('Please upload a resume and enter a job description');
            return;
        }
        setLoading(true);
        setError('');
        setResult(null);

        const formData = new FormData();
        formData.append('resume', file);
        formData.append('jobDescription', jobDescription);

        try {
            const { data } = await api.post('/resume/analyze', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setResult(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to analyze resume');
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 75) return '#22c55e';
        if (score >= 50) return '#f59e0b';
        return '#ef4444';
    };

    const getScoreLabel = (score) => {
        if (score >= 85) return 'Excellent';
        if (score >= 70) return 'Good';
        if (score >= 50) return 'Fair';
        return 'Needs Improvement';
    };

    const getSuggestionIcon = (type) => {
        switch (type) {
            case 'critical': return <XCircle className="h-4 w-4 text-red-400 flex-shrink-0" />;
            case 'warning': return <AlertTriangle className="h-4 w-4 text-amber-400 flex-shrink-0" />;
            case 'improvement': return <Lightbulb className="h-4 w-4 text-blue-400 flex-shrink-0" />;
            case 'positive': return <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />;
            default: return <Lightbulb className="h-4 w-4 text-muted-foreground flex-shrink-0" />;
        }
    };

    const getSuggestionBorder = (type) => {
        switch (type) {
            case 'critical': return 'border-red-500/20 bg-red-500/5';
            case 'warning': return 'border-amber-500/20 bg-amber-500/5';
            case 'improvement': return 'border-blue-500/20 bg-blue-500/5';
            case 'positive': return 'border-emerald-500/20 bg-emerald-500/5';
            default: return 'border-border/20';
        }
    };

    // SVG circular progress
    const circumference = 2 * Math.PI * 54;
    const scoreOffset = result ? circumference - (result.atsScore / 100) * circumference : circumference;

    return (
        <div className="max-w-4xl mx-auto animate-fade-in-up space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/15">
                    <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold">AI Resume Analyzer</h1>
                    <p className="text-sm text-muted-foreground">Get your ATS compatibility score & actionable suggestions</p>
                </div>
            </div>

            {/* Upload & JD Input */}
            <div className="grid md:grid-cols-2 gap-4">
                {/* PDF Upload */}
                <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 flex flex-col items-center justify-center min-h-[200px] ${dragActive
                            ? 'border-primary bg-primary/5'
                            : file
                                ? 'border-emerald-500/30 bg-emerald-500/5'
                                : 'border-border/30 bg-card hover:border-primary/20 hover:bg-accent/10'
                        }`}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    {file ? (
                        <>
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 flex items-center justify-center mb-3">
                                <FileText className="h-6 w-6 text-emerald-400" />
                            </div>
                            <p className="text-sm font-medium text-emerald-400">{file.name}</p>
                            <p className="text-[10px] text-muted-foreground mt-1">
                                {(file.size / 1024).toFixed(1)} KB · Click to replace
                            </p>
                        </>
                    ) : (
                        <>
                            <div className="w-12 h-12 rounded-xl bg-accent/30 flex items-center justify-center mb-3">
                                <Upload className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <p className="text-sm font-medium">Upload Resume (PDF)</p>
                            <p className="text-[10px] text-muted-foreground mt-1">Drag & drop or click to browse</p>
                        </>
                    )}
                </div>

                {/* Job Description */}
                <div className="flex flex-col">
                    <label className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
                        <Search className="h-3.5 w-3.5" /> Job Description
                    </label>
                    <textarea
                        value={jobDescription}
                        onChange={e => setJobDescription(e.target.value)}
                        placeholder="Paste the job description here... Include requirements, skills, qualifications, and responsibilities."
                        className="flex-1 p-4 rounded-xl bg-card border border-border/30 text-sm resize-none min-h-[180px] focus:outline-none focus:border-primary/30 focus:ring-1 focus:ring-primary/15 placeholder:text-muted-foreground/40"
                    />
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 flex-shrink-0" /> {error}
                </div>
            )}

            {/* Analyze Button */}
            <button
                onClick={analyze}
                disabled={loading || !file || !jobDescription.trim()}
                className="w-full py-3.5 bg-primary text-black rounded-xl font-semibold text-sm hover:bg-lime-400 transition-all duration-300 shadow-lg shadow-primary/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {loading ? (
                    <><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> Analyzing Resume...</>
                ) : (
                    <><Sparkles className="h-4 w-4" /> Analyze Resume</>
                )}
            </button>

            {/* Results */}
            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-5"
                    >
                        {/* ATS Score Hero */}
                        <div className="p-8 rounded-2xl bg-card border border-border/30 flex flex-col md:flex-row items-center gap-8">
                            <div className="relative">
                                <svg width="130" height="130" className="-rotate-90">
                                    <circle cx="65" cy="65" r="54" stroke="currentColor" strokeWidth="8" fill="none" className="text-accent/30" />
                                    <motion.circle
                                        cx="65" cy="65" r="54"
                                        stroke={getScoreColor(result.atsScore)}
                                        strokeWidth="8"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeDasharray={circumference}
                                        initial={{ strokeDashoffset: circumference }}
                                        animate={{ strokeDashoffset: scoreOffset }}
                                        transition={{ duration: 1.2, ease: 'easeOut' }}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl font-bold" style={{ color: getScoreColor(result.atsScore) }}>{result.atsScore}</span>
                                    <span className="text-[10px] text-muted-foreground">ATS Score</span>
                                </div>
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h2 className="text-xl font-bold mb-1">{getScoreLabel(result.atsScore)}</h2>
                                <p className="text-sm text-muted-foreground mb-3">
                                    {result.stats.matchPercent}% keyword match · {result.stats.totalResumeSkills} skills found · {result.stats.wordCount} words
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { label: 'Skills Matched', value: `${result.matchedSkills.length}/${result.stats.totalJDSkills}`, color: 'text-emerald-400' },
                                        { label: 'Missing', value: result.missingSkills.length, color: 'text-red-400' },
                                        { label: 'Action Verbs', value: result.stats.actionVerbCount, color: 'text-blue-400' },
                                    ].map(s => (
                                        <div key={s.label} className="px-3 py-1.5 rounded-lg bg-accent/20 border border-border/20 text-xs">
                                            <span className={`font-bold ${s.color}`}>{s.value}</span> <span className="text-muted-foreground">{s.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Skills Grid */}
                        <div className="grid md:grid-cols-2 gap-4">
                            {/* Matched Skills */}
                            <div className="p-5 rounded-xl bg-card border border-border/30">
                                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Matched Skills
                                </h3>
                                {result.matchedSkills.length > 0 ? (
                                    <div className="flex flex-wrap gap-1.5">
                                        {result.matchedSkills.map(skill => (
                                            <span key={skill} className="px-2.5 py-1 rounded-full text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 font-medium">
                                                ✓ {skill}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-muted-foreground">No matching skills found</p>
                                )}
                            </div>

                            {/* Missing Skills */}
                            <div className="p-5 rounded-xl bg-card border border-border/30">
                                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                    <XCircle className="h-4 w-4 text-red-400" /> Missing Skills
                                </h3>
                                {result.missingSkills.length > 0 ? (
                                    <div className="flex flex-wrap gap-1.5">
                                        {result.missingSkills.map(skill => (
                                            <span key={skill} className="px-2.5 py-1 rounded-full text-[11px] bg-red-500/10 text-red-400 border border-red-500/15 font-medium">
                                                ✗ {skill}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-emerald-400">All required skills present! 🎉</p>
                                )}
                            </div>
                        </div>

                        {/* Extra Skills */}
                        {result.extraSkills?.length > 0 && (
                            <div className="p-4 rounded-xl bg-card border border-border/30">
                                <h3 className="text-xs font-semibold mb-2 flex items-center gap-2 text-muted-foreground">
                                    <Zap className="h-3.5 w-3.5 text-primary" /> Additional Skills in Your Resume
                                </h3>
                                <div className="flex flex-wrap gap-1.5">
                                    {result.extraSkills.map(skill => (
                                        <span key={skill} className="px-2 py-0.5 rounded-full text-[10px] bg-primary/10 text-primary/70 border border-primary/10">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Suggestions */}
                        <div className="p-5 rounded-xl bg-card border border-border/30">
                            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                                <Lightbulb className="h-4 w-4 text-primary" /> Recommendations
                            </h3>
                            <div className="space-y-2.5">
                                {result.suggestions.map((s, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 * i }}
                                        className={`p-3.5 rounded-xl border ${getSuggestionBorder(s.type)}`}
                                    >
                                        <div className="flex items-start gap-2.5">
                                            <div className="mt-0.5">{getSuggestionIcon(s.type)}</div>
                                            <div>
                                                <p className="text-xs font-semibold mb-0.5">{s.title}</p>
                                                <p className="text-[11px] text-muted-foreground leading-relaxed">{s.description}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Section Analysis (collapsible) */}
                        <div className="rounded-xl bg-card border border-border/30 overflow-hidden">
                            <button
                                onClick={() => setShowDetails(!showDetails)}
                                className="w-full flex items-center justify-between p-5 hover:bg-accent/10 transition-colors"
                            >
                                <h3 className="text-sm font-semibold flex items-center gap-2">
                                    <BarChart3 className="h-4 w-4 text-primary" /> Resume Section Analysis
                                </h3>
                                {showDetails ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                            </button>
                            {showDetails && (
                                <div className="border-t border-border/20 p-5 space-y-2">
                                    {result.sectionAnalysis.map(section => (
                                        <div key={section.name} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-accent/10">
                                            <span className="text-xs font-medium">{section.name}</span>
                                            {section.present ? (
                                                <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                                                    <CheckCircle2 className="h-3.5 w-3.5" /> Found
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-[10px] text-red-400">
                                                    <XCircle className="h-3.5 w-3.5" /> Missing
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ResumeAnalyzer;

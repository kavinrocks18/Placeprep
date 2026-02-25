import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Code, Shield, Zap, BarChart3, Star, Sparkles, Terminal, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

const AnimatedCounter = ({ end, duration = 2000, suffix = '' }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    setHasAnimated(true);
                    let start = 0;
                    const step = end / (duration / 16);
                    const timer = setInterval(() => {
                        start += step;
                        if (start >= end) {
                            setCount(end);
                            clearInterval(timer);
                        } else {
                            setCount(Math.floor(start));
                        }
                    }, 16);
                }
            },
            { threshold: 0.3 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [end, duration, hasAnimated]);

    return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

const stagger = {
    container: {
        animate: { transition: { staggerChildren: 0.1 } },
    },
    item: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    },
};

const Home = () => {
    const features = [
        {
            icon: <CheckCircle className="h-6 w-6" />,
            title: 'Job Tracker',
            description: 'Effortlessly track every application status from applied to offer, all in one dashboard.',
        },
        {
            icon: <Code className="h-6 w-6" />,
            title: 'Code Editor',
            description: 'Solve coding problems with our built-in Monaco editor supporting 5 languages.',
        },
        {
            icon: <BookOpen className="h-6 w-6" />,
            title: 'Learning Hub',
            description: 'Access curated video tutorials on DSA, OS, DBMS, and networking topics.',
        },
        {
            icon: <BarChart3 className="h-6 w-6" />,
            title: 'Analytics',
            description: 'Track your streaks, problems solved, and application success rates.',
        },
    ];

    const steps = [
        { num: '01', title: 'Create Account', desc: 'Sign up in seconds and set up your profile.' },
        { num: '02', title: 'Track Applications', desc: 'Log job applications and monitor their status.' },
        { num: '03', title: 'Practice Daily', desc: 'Solve the Problem of the Day and build streaks.' },
        { num: '04', title: 'Get Placed', desc: 'Use insights from your dashboard to ace interviews.' },
    ];

    const testimonials = [
        { name: 'Priya Sharma', role: 'SDE @ Google', text: 'This platform helped me organize my entire placement season. The practice section is incredible!', rating: 5 },
        { name: 'Rahul Verma', role: 'SDE @ Amazon', text: 'The application tracker saved me from missing important deadlines. Absolutely essential tool!', rating: 5 },
        { name: 'Anita Patel', role: 'SDE @ Microsoft', text: 'The daily problem feature kept me consistent. I topped my batch in placements!', rating: 5 },
    ];

    return (
        <div className="flex flex-col -mt-8">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex flex-col justify-center items-center text-center py-24 overflow-hidden">
                {/* Subtle background grid */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
                    backgroundSize: '40px 40px',
                }} />

                {/* Green glow blobs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[20%] left-[15%] w-[400px] h-[400px] bg-lime-500/8 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[20%] right-[15%] w-[350px] h-[350px] bg-green-500/6 rounded-full blur-[120px]" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="relative z-10 max-w-4xl mx-auto px-4"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
                        <Zap className="h-4 w-4" />
                        Your Placement Journey Starts Here
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-6 leading-[1.05]">
                        Master Your
                        <br />
                        <span className="text-gradient">Placements</span>
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
                        Track applications, practice coding problems, and analyze your performance — all in one powerful, beautiful platform.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/register"
                            className="group inline-flex items-center justify-center px-8 py-4 bg-primary text-black rounded-xl text-lg font-bold hover:bg-lime-400 transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
                        >
                            Get Started Free
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/login"
                            className="inline-flex items-center justify-center px-8 py-4 border border-border/50 text-foreground rounded-xl text-lg font-medium hover:bg-accent/50 hover:border-primary/30 transition-all duration-300"
                        >
                            Sign In
                        </Link>
                    </div>
                </motion.div>

                {/* Terminal-style decoration */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="relative z-10 mt-16 w-full max-w-2xl mx-auto px-4"
                >
                    <div className="bg-card border border-border/30 rounded-xl overflow-hidden shadow-2xl shadow-black/30">
                        <div className="flex items-center gap-2 px-4 py-3 border-b border-border/30 bg-accent/30">
                            <div className="w-3 h-3 rounded-full bg-red-500/60" />
                            <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                            <div className="w-3 h-3 rounded-full bg-green-500/60" />
                            <span className="ml-2 text-xs text-muted-foreground font-mono">placeprep — dashboard</span>
                        </div>
                        <div className="p-5 font-mono text-sm space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="text-primary">$</span>
                                <span className="text-muted-foreground">applications</span>
                                <span className="text-foreground">--status</span>
                            </div>
                            <div className="text-emerald-400 text-xs">✓ 3 Interviews Scheduled</div>
                            <div className="text-amber-400 text-xs">⟳ 12 Applications Pending</div>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-primary">$</span>
                                <span className="text-muted-foreground">streak</span>
                                <span className="text-foreground">--current</span>
                            </div>
                            <div className="text-primary text-xs">🔥 7-day streak • 42 problems solved</div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Stats Section */}
            <section className="py-16 border-y border-border/20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto px-4">
                    {[
                        { value: 10000, suffix: '+', label: 'Active Users' },
                        { value: 5000, suffix: '+', label: 'Problems Solved' },
                        { value: 500, suffix: '+', label: 'Coding Problems' },
                        { value: 95, suffix: '%', label: 'Success Rate' },
                    ].map((stat, idx) => (
                        <div key={idx} className="text-center">
                            <p className="text-3xl md:text-4xl font-bold text-primary mb-1">
                                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                            </p>
                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features Grid */}
            <motion.section
                className="py-24 px-4"
                variants={stagger.container}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.2 }}
            >
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        Everything You Need
                    </h2>
                    <p className="text-muted-foreground max-w-xl mx-auto">Powerful tools designed to streamline your placement journey.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            variants={stagger.item}
                            className="group relative bg-card border border-border/30 p-6 rounded-xl hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
                        >
                            {/* Top accent line */}
                            <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary/15 group-hover:scale-105 transition-all duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* How it Works */}
            <section className="py-24 relative px-4">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent pointer-events-none" />
                <div className="relative max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">
                            How It <span className="text-primary">Works</span>
                        </h2>
                        <p className="text-muted-foreground max-w-xl mx-auto">Get started in 4 simple steps.</p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        {steps.map((step, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.15, duration: 0.5 }}
                                viewport={{ once: true }}
                                className="text-center relative"
                            >
                                <div className="text-5xl font-black text-primary/20 mb-2">{step.num}</div>
                                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                                <p className="text-sm text-muted-foreground">{step.desc}</p>
                                {idx < 3 && (
                                    <div className="hidden md:block absolute top-8 -right-4 w-8 text-border">
                                        <ArrowRight className="h-5 w-5" />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        Loved by <span className="text-primary">Students</span>
                    </h2>
                    <p className="text-muted-foreground max-w-xl mx-auto">See what our users have to say.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
                    {testimonials.map((t, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            viewport={{ once: true }}
                            className="bg-card border border-border/30 rounded-xl p-6 hover:border-primary/20 transition-all duration-300"
                        >
                            <div className="flex gap-1 mb-4">
                                {[...Array(t.rating)].map((_, i) => (
                                    <Star key={i} className="h-4 w-4 text-primary fill-primary" />
                                ))}
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed mb-4 italic">"{t.text}"</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary/10 flex items-center justify-center">
                                    <span className="text-sm font-bold text-primary">{t.name.charAt(0)}</span>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">{t.name}</p>
                                    <p className="text-xs text-muted-foreground">{t.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-4">
                <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card p-12 md:p-16 text-center max-w-4xl mx-auto">
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
                    <div className="absolute inset-0 opacity-[0.02]" style={{
                        backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
                        backgroundSize: '32px 32px',
                    }} />

                    <div className="relative z-10">
                        <Sparkles className="h-10 w-10 text-primary mx-auto mb-6" />
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
                        <p className="text-muted-foreground mb-8 max-w-lg mx-auto">Join thousands of students who are already tracking, practicing, and landing their dream jobs.</p>
                        <Link
                            to="/register"
                            className="inline-flex items-center px-8 py-4 bg-primary text-black rounded-xl text-lg font-bold hover:bg-lime-400 transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5"
                        >
                            Get Started — It's Free
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;

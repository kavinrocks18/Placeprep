import { Link } from 'react-router-dom';
import { Rocket, Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="border-t border-border/20 mt-auto">
            {/* Green accent line */}
            <div className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <Link to="/" className="flex items-center space-x-2 mb-4">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <Rocket className="h-4 w-4 text-black" />
                            </div>
                            <span className="font-bold text-lg text-gradient">PlacePrep</span>
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Your one-stop platform for tracking applications, practicing coding, and acing interviews.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-sm uppercase tracking-wider text-foreground mb-4">Platform</h4>
                        <ul className="space-y-2">
                            <li><Link to="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">Dashboard</Link></li>
                            <li><Link to="/applications" className="text-sm text-muted-foreground hover:text-primary transition-colors">Applications</Link></li>
                            <li><Link to="/practice" className="text-sm text-muted-foreground hover:text-primary transition-colors">Practice</Link></li>
                            <li><Link to="/resources" className="text-sm text-muted-foreground hover:text-primary transition-colors">Resources</Link></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="font-semibold text-sm uppercase tracking-wider text-foreground mb-4">Resources</h4>
                        <ul className="space-y-2">
                            <li><span className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">Documentation</span></li>
                            <li><span className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">API Reference</span></li>
                            <li><span className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">Help Center</span></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-semibold text-sm uppercase tracking-wider text-foreground mb-4">Stay Updated</h4>
                        <p className="text-sm text-muted-foreground mb-3">Get the latest tips and updates.</p>
                        <div className="flex">
                            <input
                                type="email"
                                placeholder="your@email.com"
                                className="flex-1 px-3 py-2 text-sm bg-accent/30 border border-border/30 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-primary/50"
                            />
                            <button className="px-4 py-2 bg-primary text-black text-sm font-semibold rounded-r-lg hover:bg-lime-400 transition-all">
                                <Mail className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-10 pt-6 border-t border-border/20 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                        Made with <Heart className="h-3 w-3 text-primary fill-primary" /> &copy; {new Date().getFullYear()} PlacePrep
                    </p>
                    <div className="flex items-center space-x-4">
                        <span className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                            <Github className="h-4 w-4" />
                        </span>
                        <span className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                            <Twitter className="h-4 w-4" />
                        </span>
                        <span className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                            <Linkedin className="h-4 w-4" />
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

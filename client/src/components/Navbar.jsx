import { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Rocket, Sun, Moon, LogOut } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');
    const isPracticeActive = () => location.pathname === '/practice' || location.pathname.startsWith('/aptitude');

    const navLinkClasses = (path) =>
        `relative whitespace-nowrap py-1.5 text-sm font-medium transition-colors duration-200 ${isActive(path)
            ? 'text-primary'
            : 'text-muted-foreground hover:text-foreground'
        }`;

    const practiceClasses = () =>
        `relative whitespace-nowrap py-1.5 text-sm font-medium transition-colors duration-200 ${isPracticeActive()
            ? 'text-primary'
            : 'text-muted-foreground hover:text-foreground'
        }`;

    const NAV_LINKS = [
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/practice', label: 'Practice', usePractice: true },
        { to: '/data-structures', label: 'DS' },
        { to: '/resources', label: 'Resources' },
        { to: '/companies', label: 'Companies' },
        { to: '/mock-test', label: 'Mock Test' },
        { to: '/resume-analyzer', label: 'Resume AI' },
        { to: '/interview-generator', label: 'Interview Q' },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/30">
            <div className="w-full px-4 xl:px-6">
                <div className="flex items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group flex-shrink-0 mr-4">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-primary/25 transition-all duration-300">
                            <Rocket className="h-4 w-4 text-black" />
                        </div>
                        <span className="font-bold text-lg text-gradient">PlacePrep</span>
                    </Link>

                    {/* Desktop Nav Links — spread evenly across available space */}
                    <div className="hidden lg:flex items-center flex-1 justify-center">
                        <div className="flex items-center gap-5 xl:gap-7">
                            <Link to="/" className={navLinkClasses('/')}>
                                Home
                                {location.pathname === '/' && <span className="absolute -bottom-[1px] left-0 right-0 h-0.5 bg-primary rounded-full" />}
                            </Link>
                            {user && NAV_LINKS.map(link => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={link.usePractice ? practiceClasses() : navLinkClasses(link.to)}
                                >
                                    {link.label}
                                    {(link.usePractice ? isPracticeActive() : isActive(link.to)) && (
                                        <span className="absolute -bottom-[1px] left-0 right-0 h-0.5 bg-primary rounded-full" />
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Right Controls */}
                    <div className="hidden lg:flex items-center gap-2 flex-shrink-0 ml-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg hover:bg-accent transition-colors duration-200"
                            title={isDark ? 'Light mode' : 'Dark mode'}
                        >
                            {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
                        </button>

                        {user ? (
                            <>
                                <Link
                                    to="/profile"
                                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-accent transition-colors duration-200"
                                >
                                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                                        <span className="text-xs font-bold text-black">{user.name?.charAt(0).toUpperCase()}</span>
                                    </div>
                                    <span className="text-sm font-medium max-w-[100px] truncate">{user.name}</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors duration-200"
                                    title="Logout"
                                >
                                    <LogOut className="h-4 w-4" />
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link to="/login" className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-4 py-2 bg-primary text-black rounded-lg text-sm font-semibold hover:bg-lime-400 transition-all duration-300 shadow-md shadow-primary/20"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden flex items-center gap-2 ml-auto">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg hover:bg-accent transition-colors"
                        >
                            {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
                        </button>
                        <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-lg hover:bg-accent transition-colors">
                            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="lg:hidden bg-background/95 backdrop-blur-xl border-t border-border/30 animate-slide-in-right">
                    <div className="px-4 py-4 space-y-1">
                        <Link to="/" className="block px-3 py-2 rounded-lg text-foreground hover:bg-accent transition-colors text-sm" onClick={() => setIsOpen(false)}>Home</Link>
                        {user ? (
                            <>
                                {NAV_LINKS.map(link => (
                                    <Link key={link.to} to={link.to} className="block px-3 py-2 rounded-lg text-foreground hover:bg-accent transition-colors text-sm" onClick={() => setIsOpen(false)}>
                                        {link.to === '/data-structures' ? 'Data Structures' : link.label}
                                    </Link>
                                ))}
                                <Link to="/profile" className="block px-3 py-2 rounded-lg text-foreground hover:bg-accent transition-colors text-sm" onClick={() => setIsOpen(false)}>Profile</Link>
                                <hr className="border-border/30 my-2" />
                                <button
                                    onClick={() => { handleLogout(); setIsOpen(false); }}
                                    className="block w-full text-left px-3 py-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors font-medium text-sm"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="block px-3 py-2 rounded-lg text-foreground hover:bg-accent transition-colors text-sm" onClick={() => setIsOpen(false)}>Login</Link>
                                <Link to="/register" className="block px-3 py-2 rounded-lg bg-primary text-black text-center font-semibold text-sm" onClick={() => setIsOpen(false)}>Get Started</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;

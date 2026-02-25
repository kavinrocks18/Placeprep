import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Practice from './pages/Practice';
import ProblemDetail from './pages/ProblemDetail';
import PotdDetail from './pages/PotdDetail';
import DataStructures from './pages/DataStructures';
import DsProblemDetail from './pages/DsProblemDetail';
import Aptitude from './pages/Aptitude';
import AptitudeDetail from './pages/AptitudeDetail';
import Profile from './pages/Profile';
import Resources from './pages/Resources';
import Companies from './pages/Companies';
import CompanyDetail from './pages/CompanyDetail';
import MockTestStart from './pages/MockTestStart';
import MockTestSession from './pages/MockTestSession';
import MockTestReport from './pages/MockTestReport';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import InterviewGenerator from './pages/InterviewGenerator';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import GitHubCallback from './pages/GitHubCallback';
import ProtectedRoute from './components/ProtectedRoute';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

const PageTransition = ({ children }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration: 0.3, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
        <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
        <Route path="/reset-password/:resetToken" element={<PageTransition><ResetPassword /></PageTransition>} />
        <Route path="/auth/github/callback" element={<PageTransition><GitHubCallback /></PageTransition>} />

        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <PageTransition><Dashboard /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/practice"
          element={
            <ProtectedRoute>
              <PageTransition><Practice /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/practice/:slug"
          element={
            <ProtectedRoute>
              <PageTransition><ProblemDetail /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/potd/:slug"
          element={
            <ProtectedRoute>
              <PageTransition><PotdDetail /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/data-structures"
          element={
            <ProtectedRoute>
              <PageTransition><DataStructures /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/ds/:slug"
          element={
            <ProtectedRoute>
              <PageTransition><DsProblemDetail /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/aptitude"
          element={
            <ProtectedRoute>
              <PageTransition><Aptitude /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/aptitude/:slug"
          element={
            <ProtectedRoute>
              <PageTransition><AptitudeDetail /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <PageTransition><Profile /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/resources"
          element={
            <ProtectedRoute>
              <PageTransition><Resources /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/companies"
          element={
            <ProtectedRoute>
              <PageTransition><Companies /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/companies/:slug"
          element={
            <ProtectedRoute>
              <PageTransition><CompanyDetail /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/mock-test"
          element={
            <ProtectedRoute>
              <PageTransition><MockTestStart /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/mock-test/:testId"
          element={
            <ProtectedRoute>
              <PageTransition><MockTestSession /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/mock-test/:testId/report"
          element={
            <ProtectedRoute>
              <PageTransition><MockTestReport /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/resume-analyzer"
          element={
            <ProtectedRoute>
              <PageTransition><ResumeAnalyzer /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/interview-generator"
          element={
            <ProtectedRoute>
              <PageTransition><InterviewGenerator /></PageTransition>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ''}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col bg-background text-foreground font-sans antialiased">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-8">
              <AnimatedRoutes />
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </GoogleOAuthProvider>
    </Router>
  );
}

export default App;

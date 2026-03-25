import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChatPage from './pages/ChatPage';
import LawyerSearchPage from './pages/LawyerSearchPage';
import LawyerProfilePage from './pages/LawyerProfilePage';
import AppointmentsPage from './pages/AppointmentsPage';
import LawyerDashboard from './pages/LawyerDashboard';
import AdminPanel from './pages/AdminPanel';
import './index.css';

const ProtectedRoute = ({ children, requireAdmin, requireLawyer }) => {
  const { isAuthenticated, isAdmin, isLawyer, loading } = useAuth();

  if (loading) return <div className="page-content"><div className="loading-spinner"><div className="spinner"></div></div></div>;
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (requireAdmin && !isAdmin) return <Navigate to="/chat" />;
  if (requireLawyer && !isLawyer) return <Navigate to="/chat" />;

  return children;
};

const AppRoutes = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div className="page-content"><div className="loading-spinner"><div className="spinner"></div></div></div>;

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/chat" /> : <LandingPage />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/chat" /> : <LoginPage />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/chat" /> : <RegisterPage />} />

      <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
      <Route path="/lawyers" element={<ProtectedRoute><LawyerSearchPage /></ProtectedRoute>} />
      <Route path="/lawyers/:id" element={<ProtectedRoute><LawyerProfilePage /></ProtectedRoute>} />
      <Route path="/appointments" element={<ProtectedRoute><AppointmentsPage /></ProtectedRoute>} />
      <Route path="/lawyer-dashboard" element={<ProtectedRoute requireLawyer><LawyerDashboard /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminPanel /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

function AppContent() {
  const { isAuthenticated } = useAuth();
  const showNavbar = isAuthenticated;

  return (
    <>
      {showNavbar && <Navbar />}
      <AppRoutes />
    </>
  );
}

export default App;

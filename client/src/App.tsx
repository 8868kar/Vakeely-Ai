import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import Navbar from './components/Navbar.js';
import LandingPage from './pages/LandingPage.js';
import LoginPage from './pages/LoginPage.js';
import RegisterPage from './pages/RegisterPage.js';
import ChatPage from './pages/ChatPage.js';
import LawyerSearchPage from './pages/LawyerSearchPage.js';
import LawyerProfilePage from './pages/LawyerProfilePage.js';
import AppointmentsPage from './pages/AppointmentsPage.js';
import LawyerDashboard from './pages/LawyerDashboard.js';
import AdminPanel from './pages/AdminPanel.js';
import './index.css';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireLawyer?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin, requireLawyer }) => {
  const { isAuthenticated, isAdmin, isLawyer, loading } = useAuth();

  if (loading) return <div className="page-content"><div className="loading-spinner"><div className="spinner"></div></div></div>;
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (requireAdmin && !isAdmin) return <Navigate to="/chat" />;
  if (requireLawyer && !isLawyer) return <Navigate to="/chat" />;

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
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

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const showNavbar = isAuthenticated;

  return (
    <>
      {showNavbar && <Navbar />}
      <AppRoutes />
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;

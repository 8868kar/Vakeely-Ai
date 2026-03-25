import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX, FiLogOut, FiMessageSquare, FiSearch, FiCalendar, FiGrid, FiShield } from 'react-icons/fi';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, isLawyer, accountType, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <div className="brand-icon">⚖️</div>
          VAkeely
        </Link>

        <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <FiX /> : <FiMenu />}
        </button>

        <div className={`navbar-links ${mobileOpen ? 'mobile-open' : ''}`}>
          {isAuthenticated ? (
            <>
              <Link to="/chat" className={isActive('/chat')} onClick={() => setMobileOpen(false)}>
                <FiMessageSquare style={{ marginRight: 6 }} />AI Assistant
              </Link>
              <Link to="/lawyers" className={isActive('/lawyers')} onClick={() => setMobileOpen(false)}>
                <FiSearch style={{ marginRight: 6 }} />Find Lawyers
              </Link>
              <Link to="/appointments" className={isActive('/appointments')} onClick={() => setMobileOpen(false)}>
                <FiCalendar style={{ marginRight: 6 }} />Appointments
              </Link>

              {isLawyer && (
                <Link to="/lawyer-dashboard" className={isActive('/lawyer-dashboard')} onClick={() => setMobileOpen(false)}>
                  <FiGrid style={{ marginRight: 6 }} />Dashboard
                </Link>
              )}

              {isAdmin && (
                <Link to="/admin" className={isActive('/admin')} onClick={() => setMobileOpen(false)}>
                  <FiShield style={{ marginRight: 6 }} />Admin
                </Link>
              )}

              <div className="nav-user">
                <div className="nav-avatar">{getInitials(user?.name)}</div>
                <button onClick={handleLogout} title="Logout">
                  <FiLogOut />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className={`btn btn-secondary btn-sm ${isActive('/login')}`} onClick={() => setMobileOpen(false)}>
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm" onClick={() => setMobileOpen(false)}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

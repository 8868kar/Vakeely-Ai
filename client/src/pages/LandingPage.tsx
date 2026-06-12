import React from 'react';
import { Link } from 'react-router-dom';
import { FiMessageSquare, FiSearch, FiShield, FiCalendar, FiUploadCloud, FiGlobe, FiArrowRight, FiZap } from 'react-icons/fi';

const LandingPage: React.FC = () => {
  const features = [
    { icon: <FiSearch />, title: 'AI Legal Research', desc: 'Search across 8.5 million+ Indian judgments, acts, and commentaries with natural language queries.' },
    { icon: <FiUploadCloud />, title: 'Document Drafting', desc: 'Instantly generate legal drafts, notices, and agreements using intelligent AI templates.' },
    { icon: <FiCalendar />, title: 'Digital Court Diary', desc: 'Manage hearings, track case status, and organize your files within an integrated professional dashboard.' },
    { icon: <FiZap />, title: 'Case Law Analysis', desc: 'Get AI-generated summaries of complex judgments and pinpoint relevant legal precedents in seconds.' },
    { icon: <FiMessageSquare />, title: 'Research Assistant', desc: 'Chat with our AI to brainstorm arguments, structure your case, and quickly navigate the law.' },
    { icon: <FiShield />, title: 'Secure & Confidential', desc: 'Enterprise-grade encryption for all your client data, documents, and research queries.' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="landing-hero" style={{ padding: '160px 24px 100px' }}>
        <div className="hero-content">
          <div className="hero-badge" style={{ border: '1px solid var(--border)', background: 'var(--bg-glass)', color: 'var(--text-secondary)' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)', marginRight: 8, display: 'inline-block' }}></span> AI Legal Research Platform
          </div>
          <h1 className="hero-title" style={{ fontSize: 'clamp(3rem, 7vw, 5rem)', letterSpacing: '-0.02em' }}>
            Legal Research,<br />
            <span className="gradient-text">Powered by AI</span>
          </h1>
          <p className="hero-subtitle" style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '700px' }}>
            India's first AI-powered legal research platform for advocates. Access 8.5 million+ Indian judgments, digital court diary, and automated document drafting.
          </p>
          <div className="hero-actions">
            <Link to="/chat" className="btn btn-primary btn-lg" style={{ borderRadius: '8px', padding: '16px 36px' }}>
              Start Researching <FiArrowRight style={{ marginLeft: 8 }} />
            </Link>
            <Link to="/register" className="btn btn-secondary btn-lg" style={{ borderRadius: '8px', padding: '16px 36px' }}>
              Free Trial
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-bar" style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
        <div className="stat-item">
          <div className="stat-number" style={{ fontSize: '3rem' }}>8.5M+</div>
          <div className="stat-label" style={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8rem' }}>Indian Judgments</div>
        </div>
        <div className="stat-item">
          <div className="stat-number" style={{ fontSize: '3rem' }}>10k+</div>
          <div className="stat-label" style={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8rem' }}>Advocates</div>
        </div>
        <div className="stat-item">
          <div className="stat-number" style={{ fontSize: '3rem' }}>7M+</div>
          <div className="stat-label" style={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8rem' }}>Legal Excerpts</div>
        </div>
        <div className="stat-item">
          <div className="stat-number" style={{ fontSize: '3rem' }}>24/7</div>
          <div className="stat-label" style={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8rem' }}>AI Workbench</div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section" style={{ background: 'var(--bg-primary)' }}>
        <h2 className="section-title" style={{ fontSize: '2.8rem' }}>Empowering Legal Professionals</h2>
        <p className="section-subtitle">
          Advanced tools designed specifically for Indian courts, lawyers, and law firms.
        </p>
        <div className="features-grid">
          {features.map((feature, i) => (
            <div key={i} className="feature-card glass-card" style={{ animationDelay: `${i * 0.1}s` } as React.CSSProperties}>
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: 'center', padding: '120px 24px', background: 'var(--bg-secondary)' }}>
        <h2 className="section-title" style={{ fontSize: '3rem', marginBottom: '24px' }}>Transform Your Legal Practice</h2>
        <p className="section-subtitle" style={{ maxWidth: '600px', margin: '0 auto 40px', fontSize: '1.2rem' }}>
          Join thousands of advocates optimizing their research and case management.
        </p>
        <Link to="/register" className="btn btn-primary btn-lg" style={{ borderRadius: '8px', padding: '16px 40px', fontSize: '1.1rem' }}>
          Start Your Free Trial <FiArrowRight style={{ marginLeft: 10 }} />
        </Link>
      </section>

      {/* Footer */}
      <footer className="footer" style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border)', paddingTop: '60px' }}>
        <div className="footer-content container" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px' }}>
          <div className="footer-brand" style={{ gridColumn: 'span 1' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center' }}><FiShield style={{ marginRight: 8, color: 'var(--primary)' }} /> GenLaw AI</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '16px', fontSize: '0.9rem' }}>The premier AI-powered legal research platform for Indian advocates and law firms.</p>
          </div>
          <div className="footer-col" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '12px' }}>Product</h4>
            <Link to="/chat" style={{ color: 'var(--text-secondary)' }}>Research Workbench</Link>
            <Link to="/lawyers" style={{ color: 'var(--text-secondary)' }}>Advanced Search</Link>
            <Link to="/register" style={{ color: 'var(--text-secondary)' }}>My Library</Link>
            <a href="#!" style={{ color: 'var(--text-secondary)' }}>Pricing</a>
          </div>
          <div className="footer-col" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '12px' }}>Resources</h4>
            <a href="#!" style={{ color: 'var(--text-secondary)' }}>Case Law Database</a>
            <a href="#!" style={{ color: 'var(--text-secondary)' }}>Help Center</a>
            <a href="#!" style={{ color: 'var(--text-secondary)' }}>API Documentation</a>
          </div>
          <div className="footer-col" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '12px' }}>Company</h4>
            <a href="#!" style={{ color: 'var(--text-secondary)' }}>About Us</a>
            <a href="#!" style={{ color: 'var(--text-secondary)' }}>Contact</a>
            <a href="#!" style={{ color: 'var(--text-secondary)' }}>Privacy Policy</a>
            <a href="#!" style={{ color: 'var(--text-secondary)' }}>Terms of Service</a>
          </div>
        </div>
        <div className="footer-bottom" style={{ textAlign: 'center', padding: '24px', borderTop: '1px solid var(--border)', marginTop: '40px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          &copy; 2024 GenLaw AI. All rights reserved. Information provided is for research purposes only.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

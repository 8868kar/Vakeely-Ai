import { Link } from 'react-router-dom';
import { FiMessageSquare, FiSearch, FiShield, FiCalendar, FiUploadCloud, FiGlobe, FiArrowRight } from 'react-icons/fi';

const LandingPage = () => {
  const features = [
    { icon: <FiMessageSquare />, title: 'AI Legal Assistant', desc: 'Get instant AI-powered legal guidance. Describe your situation and receive detailed analysis with relevant laws and sections.' },
    { icon: <FiSearch />, title: 'Smart Lawyer Matching', desc: 'Find the perfect lawyer based on specialization, experience, ratings, and fees. Our algorithm recommends the best fit.' },
    { icon: <FiShield />, title: 'Verified Professionals', desc: 'Every lawyer on our platform is verified with Bar Council credentials. Your legal matters are in safe hands.' },
    { icon: <FiCalendar />, title: 'Easy Appointments', desc: 'Book consultations with lawyers in just a few clicks. Manage your appointments from a single dashboard.' },
    { icon: <FiUploadCloud />, title: 'Secure Documents', desc: 'Upload and share legal documents securely. All files are encrypted and accessible only by authorized parties.' },
    { icon: <FiGlobe />, title: 'Comprehensive Database', desc: 'Access a vast database of Indian laws, acts, and sections. Stay informed about your legal rights.' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="landing-hero">
        <div className="hero-content">
          <div className="hero-badge">
            ⚡ AI-Powered Legal Assistance Platform
          </div>
          <h1 className="hero-title">
            Your Legal Rights,<br />
            <span className="gradient-text">Simplified with AI</span>
          </h1>
          <p className="hero-subtitle">
            Get instant legal guidance powered by artificial intelligence. Understand your rights, find relevant laws, 
            and connect with verified lawyers — all in one platform.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary btn-lg">
              Get Started Free <FiArrowRight />
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-bar">
        <div className="stat-item">
          <div className="stat-number">12+</div>
          <div className="stat-label">Legal Acts Covered</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">500+</div>
          <div className="stat-label">Legal Sections</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">10+</div>
          <div className="stat-label">Case Categories</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">24/7</div>
          <div className="stat-label">AI Assistance</div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <h2 className="section-title">Everything You Need for Legal Assistance</h2>
        <p className="section-subtitle">
          From understanding your legal situation to finding the right lawyer — we&apos;ve got you covered.
        </p>
        <div className="features-grid">
          {features.map((feature, i) => (
            <div key={i} className="feature-card glass-card" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: 'center', padding: '80px 24px' }}>
        <h2 className="section-title">Ready to Get Started?</h2>
        <p className="section-subtitle">
          Join thousands of users who trust VAkeely for their legal assistance needs.
        </p>
        <Link to="/register" className="btn btn-accent btn-lg">
          Create Free Account <FiArrowRight />
        </Link>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>⚖️ VAkeely</h3>
            <p>AI-powered legal assistance platform helping you understand your rights and find the right legal counsel.</p>
          </div>
          <div className="footer-col">
            <h4>Platform</h4>
            <Link to="/chat">AI Assistant</Link>
            <Link to="/lawyers">Find Lawyers</Link>
            <Link to="/register">Get Started</Link>
          </div>
          <div className="footer-col">
            <h4>Legal Areas</h4>
            <a href="#!">Criminal Law</a>
            <a href="#!">Civil Law</a>
            <a href="#!">Corporate Law</a>
            <a href="#!">Family Law</a>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <a href="#!">Help Center</a>
            <a href="#!">Contact Us</a>
            <a href="#!">Privacy Policy</a>
            <a href="#!">Terms of Service</a>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; 2024 VAkeely. All rights reserved. AI-generated guidance is not a substitute for professional legal advice.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

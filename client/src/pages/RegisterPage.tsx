import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff, FiMapPin, FiBriefcase, FiShield } from 'react-icons/fi';

const SPECIALIZATIONS = ['Civil', 'Criminal', 'Corporate', 'IP', 'Tax', 'Family', 'Property', 'Labour', 'Constitutional', 'Consumer', 'General'];

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  phone: string;
  specializations: string[];
  experience: string | number;
  consultationFee: string | number;
  bio: string;
  education: string;
  barCouncilId: string;
  location: string;
  languages: string[];
}

const RegisterPage: React.FC = () => {
  const [accountType, setAccountType] = useState<string>('user');
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '', email: '', password: '', phone: '',
    specializations: [], experience: '', consultationFee: '', bio: '',
    education: '', barCouncilId: '', location: '', languages: ['English']
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleSpecialization = (spec: string) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.includes(spec)
        ? prev.specializations.filter(s => s !== spec)
        : [...prev.specializations, spec]
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload: any = { ...formData, accountType };
      if (accountType === 'lawyer') {
        payload.experience = parseInt(payload.experience as string) || 0;
        payload.consultationFee = parseInt(payload.consultationFee as string) || 500;
      }
      await register(payload);
      navigate(accountType === 'lawyer' ? '/lawyer-dashboard' : '/chat');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container" style={{ maxWidth: accountType === 'lawyer' ? 560 : 480 }}>
        <div className="auth-card glass-card">
          <div className="auth-header">
            <Link to="/" style={{ display: 'inline-flex', marginBottom: 16 }}>
              <div className="brand-icon" style={{ width: 44, height: 44 }}>
                <FiShield />
              </div>
            </Link>
            <h1>Create Account</h1>
            <p>Join VAkeely and get started</p>
          </div>

          <div className="auth-toggle">
            <button className={accountType === 'user' ? 'active' : ''} onClick={() => setAccountType('user')}>I need legal help</button>
            <button className={accountType === 'lawyer' ? 'active' : ''} onClick={() => setAccountType('lawyer')}>I&apos;m a Lawyer</button>
          </div>

          {error && <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-sm)', color: 'var(--error)', marginBottom: 20, fontSize: '0.85rem' }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <FiUser style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="text" name="name" className="form-input" placeholder="John Doe" value={formData.name} onChange={handleChange} required style={{ paddingLeft: 44 }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <FiMail style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="email" name="email" className="form-input" placeholder="you@example.com" value={formData.email} onChange={handleChange} required style={{ paddingLeft: 44 }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <FiLock style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input type={showPassword ? 'text' : 'password'} name="password" className="form-input" placeholder="Min 6 chars" value={formData.password} onChange={handleChange} required minLength={6} style={{ paddingLeft: 44, paddingRight: 40 }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    {showPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <div style={{ position: 'relative' }}>
                  <FiPhone style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input type="tel" name="phone" className="form-input" placeholder="+91 98765..." value={formData.phone} onChange={handleChange} style={{ paddingLeft: 44 }} />
                </div>
              </div>
            </div>

            {accountType === 'lawyer' && (
              <>
                <div className="form-group">
                  <label className="form-label">Specializations</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {SPECIALIZATIONS.map(spec => (
                      <button key={spec} type="button" onClick={() => toggleSpecialization(spec)}
                        className={`badge ${formData.specializations.includes(spec) ? 'badge-primary' : ''}`}
                        style={{ cursor: 'pointer', padding: '6px 14px', border: '1px solid var(--border)', background: formData.specializations.includes(spec) ? 'rgba(99,102,241,0.2)' : 'var(--bg-glass)' }}>
                        {spec}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Experience (years)</label>
                    <div style={{ position: 'relative' }}>
                      <FiBriefcase style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input type="number" name="experience" className="form-input" placeholder="5" value={formData.experience} onChange={handleChange} min="0" style={{ paddingLeft: 44 }} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Consultation Fee (₹)</label>
                    <input type="number" name="consultationFee" className="form-input" placeholder="500" value={formData.consultationFee} onChange={handleChange} min="0" />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Bar Council ID</label>
                    <input type="text" name="barCouncilId" className="form-input" placeholder="BC/XXX/XXXX" value={formData.barCouncilId} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <div style={{ position: 'relative' }}>
                      <FiMapPin style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input type="text" name="location" className="form-input" placeholder="City" value={formData.location} onChange={handleChange} style={{ paddingLeft: 44 }} />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Education</label>
                  <input type="text" name="education" className="form-input" placeholder="LLB, LLM from..." value={formData.education} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label className="form-label">Bio</label>
                  <textarea name="bio" className="form-textarea" placeholder="Tell us about yourself and your expertise..." value={formData.bio} onChange={handleChange} rows={3} style={{ minHeight: 80 }} />
                </div>
              </>
            )}

            <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account? <Link to="/login">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

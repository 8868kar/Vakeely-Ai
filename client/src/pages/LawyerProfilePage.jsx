import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { lawyerAPI, appointmentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiStar, FiMapPin, FiBriefcase, FiDollarSign, FiAward, FiCalendar, FiX } from 'react-icons/fi';

const LawyerProfilePage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingData, setBookingData] = useState({ date: '', time: '', caseType: '', description: '' });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchLawyer();
  }, [id]);

  const fetchLawyer = async () => {
    try {
      const res = await lawyerAPI.getById(id);
      setLawyer(res.data);
    } catch (err) {
      console.error('Failed to fetch lawyer:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    try {
      await appointmentAPI.create({ lawyerId: id, ...bookingData });
      setToast({ type: 'success', message: 'Appointment booked successfully!' });
      setShowBooking(false);
      setBookingData({ date: '', time: '', caseType: '', description: '' });
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Failed to book appointment' });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setBookingLoading(false);
    }
  };

  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';

  if (loading) return <div className="page-content"><div className="loading-spinner"><div className="spinner"></div></div></div>;
  if (!lawyer) return <div className="page-content"><div className="container"><div className="empty-state"><h3>Lawyer not found</h3></div></div></div>;

  return (
    <div className="page-content">
      <div className="container">
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <div className="profile-header">
            <div className="profile-avatar-lg">{getInitials(lawyer.name)}</div>
            <div className="profile-info">
              <h1>{lawyer.name}</h1>
              <div className="profile-meta">
                <span><FiMapPin /> {lawyer.location || 'India'}</span>
                <span><FiBriefcase /> {lawyer.experience} years experience</span>
                <span><FiStar fill="var(--accent)" color="var(--accent)" /> {lawyer.rating?.toFixed(1) || '0.0'} ({lawyer.totalRatings || 0} reviews)</span>
                <span><FiDollarSign /> ₹{lawyer.consultationFee}/consultation</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {lawyer.specializations?.map((spec, i) => (
                  <span key={i} className="badge badge-primary">{spec}</span>
                ))}
              </div>
              {lawyer.verified === 'approved' && (
                <span className="badge badge-success" style={{ marginTop: 12 }}><FiAward /> Verified</span>
              )}
            </div>
          </div>

          <div className="profile-stats-row" style={{ padding: '0 40px' }}>
            <div className="profile-stat">
              <div className="stat-value">{lawyer.experience}</div>
              <div className="stat-label">Years Exp.</div>
            </div>
            <div className="profile-stat">
              <div className="stat-value">{lawyer.casesHandled || 0}</div>
              <div className="stat-label">Cases Handled</div>
            </div>
            <div className="profile-stat">
              <div className="stat-value">{lawyer.rating?.toFixed(1) || '0.0'}</div>
              <div className="stat-label">Rating</div>
            </div>
            <div className="profile-stat">
              <div className="stat-value">₹{lawyer.consultationFee}</div>
              <div className="stat-label">Fee</div>
            </div>
          </div>

          <div style={{ padding: '32px 40px' }}>
            {lawyer.bio && (
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 12 }}>About</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{lawyer.bio}</p>
              </div>
            )}

            {lawyer.education && (
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 12 }}>Education</h3>
                <p style={{ color: 'var(--text-secondary)' }}>{lawyer.education}</p>
              </div>
            )}

            {lawyer.languages?.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 12 }}>Languages</h3>
                <div style={{ display: 'flex', gap: 8 }}>
                  {lawyer.languages.map((lang, i) => (
                    <span key={i} className="badge badge-info">{lang}</span>
                  ))}
                </div>
              </div>
            )}

            {isAuthenticated && (
              <button className="btn btn-accent btn-lg" onClick={() => setShowBooking(true)} style={{ marginTop: 16 }}>
                <FiCalendar /> Book Appointment
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBooking && (
        <div className="modal-backdrop" onClick={() => setShowBooking(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Book Appointment</h2>
              <button className="modal-close" onClick={() => setShowBooking(false)}><FiX /></button>
            </div>
            <form onSubmit={handleBooking}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input type="date" className="form-input" value={bookingData.date} onChange={e => setBookingData({...bookingData, date: e.target.value})} required min={new Date().toISOString().split('T')[0]} />
                </div>
                <div className="form-group">
                  <label className="form-label">Time</label>
                  <select className="form-select" value={bookingData.time} onChange={e => setBookingData({...bookingData, time: e.target.value})} required>
                    <option value="">Select time</option>
                    {['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Case Type</label>
                <select className="form-select" value={bookingData.caseType} onChange={e => setBookingData({...bookingData, caseType: e.target.value})}>
                  <option value="">Select type</option>
                  {['Civil', 'Criminal', 'Corporate', 'IP', 'Tax', 'Family', 'Property', 'Labour', 'Consumer'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-textarea" value={bookingData.description} onChange={e => setBookingData({...bookingData, description: e.target.value})} placeholder="Brief description of your legal matter..." rows={3} style={{ minHeight: 80 }} />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="submit" className="btn btn-primary btn-block" disabled={bookingLoading}>
                  {bookingLoading ? 'Booking...' : `Book for ₹${lawyer.consultationFee}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && <div className={`toast toast-${toast.type}`}>{toast.message}</div>}
    </div>
  );
};

export default LawyerProfilePage;

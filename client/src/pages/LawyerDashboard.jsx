import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { lawyerAPI, appointmentAPI } from '../services/api';
import FileUpload from '../components/FileUpload';
import { uploadAPI } from '../services/api';
import { FiCalendar, FiCheckCircle, FiClock, FiUsers, FiEdit3, FiSave } from 'react-icons/fi';

const LawyerDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (user?._id) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const [aptsRes] = await Promise.all([
        lawyerAPI.getAppointments(user._id)
      ]);
      const apts = aptsRes.data;
      setAppointments(apts);
      setStats({
        total: apts.length,
        pending: apts.filter(a => a.status === 'pending').length,
        confirmed: apts.filter(a => a.status === 'confirmed').length,
        completed: apts.filter(a => a.status === 'completed').length,
      });
      setProfileData({
        bio: user.bio || '',
        consultationFee: user.consultationFee || 0,
        experience: user.experience || 0,
        location: user.location || '',
        education: user.education || '',
      });
    } catch (err) {
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    try {
      await lawyerAPI.update(user._id, profileData);
      setToast({ type: 'success', message: 'Profile updated!' });
      setEditing(false);
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to update profile' });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const updateAppointment = async (id, status) => {
    try {
      await appointmentAPI.update(id, { status });
      fetchDashboardData();
      setToast({ type: 'success', message: `Appointment ${status}` });
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to update' });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleDocUpload = async (files) => {
    try {
      await Promise.all(files.map(f => uploadAPI.uploadFile(f)));
      setToast({ type: 'success', message: 'Documents uploaded!' });
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      setToast({ type: 'error', message: 'Upload failed' });
      setTimeout(() => setToast(null), 3000);
    }
  };

  if (loading) return <div className="page-content"><div className="loading-spinner"><div className="spinner"></div></div></div>;

  return (
    <div className="page-content">
      <div className="container">
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>Lawyer Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome back, {user?.name}</p>
          {user?.verified === 'pending' && (
            <div style={{ marginTop: 12, padding: '12px 20px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 'var(--radius-sm)', color: 'var(--accent)', fontSize: '0.9rem' }}>
              ⏳ Your profile is pending verification. An admin will review your profile soon.
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="dashboard-grid">
          <div className="dashboard-stat-card glass-card">
            <div className="dashboard-stat-icon" style={{ background: 'rgba(99,102,241,0.15)', color: 'var(--primary-light)' }}><FiCalendar /></div>
            <div><h3>{stats.total}</h3><p>Total Appointments</p></div>
          </div>
          <div className="dashboard-stat-card glass-card">
            <div className="dashboard-stat-icon" style={{ background: 'rgba(245,158,11,0.15)', color: 'var(--accent)' }}><FiClock /></div>
            <div><h3>{stats.pending}</h3><p>Pending</p></div>
          </div>
          <div className="dashboard-stat-card glass-card">
            <div className="dashboard-stat-icon" style={{ background: 'rgba(59,130,246,0.15)', color: 'var(--info)' }}><FiUsers /></div>
            <div><h3>{stats.confirmed}</h3><p>Confirmed</p></div>
          </div>
          <div className="dashboard-stat-card glass-card">
            <div className="dashboard-stat-icon" style={{ background: 'rgba(16,185,129,0.15)', color: 'var(--success)' }}><FiCheckCircle /></div>
            <div><h3>{stats.completed}</h3><p>Completed</p></div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Profile Section */}
          <div className="glass-card" style={{ padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Profile</h2>
              <button className="btn btn-sm btn-secondary" onClick={() => editing ? saveProfile() : setEditing(true)}>
                {editing ? <><FiSave /> Save</> : <><FiEdit3 /> Edit</>}
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Bio</label>
              <textarea className="form-textarea" value={profileData.bio} onChange={e => setProfileData({...profileData, bio: e.target.value})} disabled={!editing} rows={3} style={{ minHeight: 80 }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Fee (₹)</label>
                <input type="number" className="form-input" value={profileData.consultationFee} onChange={e => setProfileData({...profileData, consultationFee: e.target.value})} disabled={!editing} />
              </div>
              <div className="form-group">
                <label className="form-label">Experience (yrs)</label>
                <input type="number" className="form-input" value={profileData.experience} onChange={e => setProfileData({...profileData, experience: e.target.value})} disabled={!editing} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input type="text" className="form-input" value={profileData.location} onChange={e => setProfileData({...profileData, location: e.target.value})} disabled={!editing} />
            </div>

            <div style={{ marginTop: 24 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>Upload Verification Documents</h3>
              <FileUpload onUpload={handleDocUpload} multiple />
            </div>
          </div>

          {/* Recent Appointments */}
          <div className="glass-card" style={{ padding: 28 }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 20 }}>Recent Appointments</h2>
            {appointments.length === 0 ? (
              <div className="empty-state" style={{ padding: '40px 0' }}>
                <p>No appointments yet</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {appointments.slice(0, 8).map(apt => (
                  <div key={apt._id} style={{ padding: '14px 16px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <strong style={{ fontSize: '0.9rem' }}>{apt.userId?.name || 'User'}</strong>
                      <span className={`badge badge-${apt.status === 'pending' ? 'warning' : apt.status === 'confirmed' ? 'info' : apt.status === 'completed' ? 'success' : 'error'}`}>
                        {apt.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: 16 }}>
                      <span>{new Date(apt.date).toLocaleDateString()}</span>
                      <span>{apt.time}</span>
                      {apt.caseType && <span>{apt.caseType}</span>}
                    </div>
                    {apt.status === 'pending' && (
                      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                        <button className="btn btn-success btn-sm" style={{ padding: '4px 12px', fontSize: '0.75rem' }} onClick={() => updateAppointment(apt._id, 'confirmed')}>Accept</button>
                        <button className="btn btn-danger btn-sm" style={{ padding: '4px 12px', fontSize: '0.75rem' }} onClick={() => updateAppointment(apt._id, 'cancelled')}>Decline</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {toast && <div className={`toast toast-${toast.type}`}>{toast.message}</div>}
    </div>
  );
};

export default LawyerDashboard;

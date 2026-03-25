import { useState, useEffect } from 'react';
import { adminAPI, legalAPI } from '../services/api';
import { FiUsers, FiShield, FiDatabase, FiActivity, FiCheck, FiX, FiTrash2, FiPlus } from 'react-icons/fi';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [analytics, setAnalytics] = useState(null);
  const [lawyers, setLawyers] = useState([]);
  const [users, setUsers] = useState([]);
  const [legalActs, setLegalActs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadTabData();
  }, [activeTab]);

  const loadTabData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'analytics':
          const analyticsRes = await adminAPI.getAnalytics();
          setAnalytics(analyticsRes.data);
          break;
        case 'lawyers':
          const lawyersRes = await adminAPI.getLawyers();
          setLawyers(lawyersRes.data);
          break;
        case 'users':
          const usersRes = await adminAPI.getUsers();
          setUsers(usersRes.data);
          break;
        case 'legal':
          const legalRes = await legalAPI.getActs();
          setLegalActs(legalRes.data);
          break;
      }
    } catch (err) {
      console.error('Admin data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const verifyLawyer = async (id, status) => {
    try {
      await adminAPI.verifyLawyer(id, status);
      showToast('success', `Lawyer ${status}`);
      loadTabData();
    } catch (err) {
      showToast('error', 'Action failed');
    }
  };

  const deleteLegalAct = async (id) => {
    if (!window.confirm('Delete this legal act?')) return;
    try {
      await adminAPI.deleteLegalAct(id);
      showToast('success', 'Act deleted');
      loadTabData();
    } catch (err) {
      showToast('error', 'Delete failed');
    }
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const tabs = [
    { key: 'analytics', label: 'Analytics', icon: <FiActivity /> },
    { key: 'lawyers', label: 'Lawyer Verification', icon: <FiShield /> },
    { key: 'users', label: 'Users', icon: <FiUsers /> },
    { key: 'legal', label: 'Legal Database', icon: <FiDatabase /> },
  ];

  return (
    <div className="page-content">
      <div className="container">
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>Admin Panel</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage the VAkeely platform</p>
        </div>

        <div className="admin-tabs">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`admin-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-spinner"><div className="spinner"></div></div>
        ) : (
          <>
            {/* Analytics Tab */}
            {activeTab === 'analytics' && analytics && (
              <div>
                <div className="dashboard-grid">
                  <div className="dashboard-stat-card glass-card">
                    <div className="dashboard-stat-icon" style={{ background: 'rgba(99,102,241,0.15)', color: 'var(--primary-light)' }}><FiUsers /></div>
                    <div><h3>{analytics.stats.totalUsers}</h3><p>Total Users</p></div>
                  </div>
                  <div className="dashboard-stat-card glass-card">
                    <div className="dashboard-stat-icon" style={{ background: 'rgba(16,185,129,0.15)', color: 'var(--success)' }}><FiShield /></div>
                    <div><h3>{analytics.stats.totalLawyers}</h3><p>Total Lawyers</p></div>
                  </div>
                  <div className="dashboard-stat-card glass-card">
                    <div className="dashboard-stat-icon" style={{ background: 'rgba(245,158,11,0.15)', color: 'var(--accent)' }}><FiShield /></div>
                    <div><h3>{analytics.stats.pendingVerifications}</h3><p>Pending Verifications</p></div>
                  </div>
                  <div className="dashboard-stat-card glass-card">
                    <div className="dashboard-stat-icon" style={{ background: 'rgba(59,130,246,0.15)', color: 'var(--info)' }}><FiActivity /></div>
                    <div><h3>{analytics.stats.totalChats}</h3><p>AI Conversations</p></div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 24 }}>
                  <div className="glass-card" style={{ padding: 28 }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>Category Distribution</h3>
                    {analytics.categoryStats.map((cat, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{cat._id}</span>
                        <span className="badge badge-primary">{cat.count} acts</span>
                      </div>
                    ))}
                  </div>

                  <div className="glass-card" style={{ padding: 28 }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>Appointment Stats</h3>
                    {analytics.appointmentStats.length === 0 ? (
                      <p style={{ color: 'var(--text-muted)' }}>No appointments yet</p>
                    ) : (
                      analytics.appointmentStats.map((stat, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                          <span style={{ color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{stat._id}</span>
                          <strong>{stat.count}</strong>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {analytics.recentAppointments?.length > 0 && (
                  <div className="glass-card" style={{ padding: 28, marginTop: 24 }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>Recent Appointments</h3>
                    <div className="table-container">
                      <table className="data-table">
                        <thead><tr><th>User</th><th>Lawyer</th><th>Date</th><th>Status</th></tr></thead>
                        <tbody>
                          {analytics.recentAppointments.map(apt => (
                            <tr key={apt._id}>
                              <td>{apt.userId?.name || '-'}</td>
                              <td>{apt.lawyerId?.name || '-'}</td>
                              <td>{new Date(apt.date).toLocaleDateString()}</td>
                              <td><span className={`badge badge-${apt.status === 'completed' ? 'success' : apt.status === 'pending' ? 'warning' : 'info'}`}>{apt.status}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Lawyer Verification Tab */}
            {activeTab === 'lawyers' && (
              <div className="glass-card" style={{ padding: 28 }}>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr><th>Name</th><th>Email</th><th>Specializations</th><th>Experience</th><th>Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {lawyers.map(lawyer => (
                        <tr key={lawyer._id}>
                          <td><strong>{lawyer.name}</strong></td>
                          <td>{lawyer.email}</td>
                          <td>
                            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                              {lawyer.specializations?.slice(0, 3).map((s, i) => (
                                <span key={i} className="badge badge-primary">{s}</span>
                              ))}
                            </div>
                          </td>
                          <td>{lawyer.experience} yrs</td>
                          <td>
                            <span className={`badge badge-${lawyer.verified === 'approved' ? 'success' : lawyer.verified === 'rejected' ? 'error' : 'warning'}`}>
                              {lawyer.verified}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: 6 }}>
                              {lawyer.verified !== 'approved' && (
                                <button className="btn btn-success btn-sm" onClick={() => verifyLawyer(lawyer._id, 'approved')}><FiCheck /></button>
                              )}
                              {lawyer.verified !== 'rejected' && (
                                <button className="btn btn-danger btn-sm" onClick={() => verifyLawyer(lawyer._id, 'rejected')}><FiX /></button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {lawyers.length === 0 && <div className="empty-state"><p>No lawyers registered yet</p></div>}
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="glass-card" style={{ padding: 28 }}>
                <div className="table-container">
                  <table className="data-table">
                    <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Joined</th></tr></thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user._id}>
                          <td><strong>{user.name}</strong></td>
                          <td>{user.email}</td>
                          <td>{user.phone || '-'}</td>
                          <td><span className={`badge badge-${user.role === 'admin' ? 'error' : 'primary'}`}>{user.role}</span></td>
                          <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {users.length === 0 && <div className="empty-state"><p>No users yet</p></div>}
              </div>
            )}

            {/* Legal Database Tab */}
            {activeTab === 'legal' && (
              <div>
                <div className="glass-card" style={{ padding: 28 }}>
                  <div className="table-container">
                    <table className="data-table">
                      <thead><tr><th>Title</th><th>Short</th><th>Category</th><th>Year</th><th>Sections</th><th>Actions</th></tr></thead>
                      <tbody>
                        {legalActs.map(act => (
                          <tr key={act._id}>
                            <td><strong>{act.title}</strong></td>
                            <td>{act.shortTitle}</td>
                            <td><span className="badge badge-primary">{act.category}</span></td>
                            <td>{act.year}</td>
                            <td>{act.sections?.length || '-'}</td>
                            <td>
                              <button className="btn btn-danger btn-sm" onClick={() => deleteLegalAct(act._id)}><FiTrash2 /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {legalActs.length === 0 && <div className="empty-state"><p>No legal acts in database</p></div>}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      {toast && <div className={`toast toast-${toast.type}`}>{toast.message}</div>}
    </div>
  );
};

export default AdminPanel;

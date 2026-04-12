import React, { useState, useEffect } from 'react';
import { appointmentAPI } from '../services/api.js';
import { useAuth } from '../context/AuthContext.js';
import { FiCalendar, FiClock, FiUser, FiCheckCircle, FiXCircle, FiAlertCircle } from 'react-icons/fi';
import { IAppointment, IUser, ILawyer } from '../types/index.js';

interface StatusConfigItem {
  color: string;
  icon: React.ReactNode;
}

const statusConfig: Record<string, StatusConfigItem> = {
  pending: { color: 'warning', icon: <FiAlertCircle /> },
  confirmed: { color: 'info', icon: <FiCheckCircle /> },
  completed: { color: 'success', icon: <FiCheckCircle /> },
  cancelled: { color: 'error', icon: <FiXCircle /> },
};

const AppointmentsPage: React.FC = () => {
  const { isLawyer } = useAuth();
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>('');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, [filter]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const params = filter ? { status: filter } : {};
      const res = await appointmentAPI.getAll(params);
      setAppointments(res.data);
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await appointmentAPI.update(id, { status });
      setToast({ type: 'success', message: `Appointment ${status}` });
      fetchAppointments();
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to update' });
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="page-content">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>Appointments</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Manage your scheduled consultations</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['', 'pending', 'confirmed', 'completed', 'cancelled'].map(f => (
              <button
                key={f}
                className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFilter(f)}
              >
                {f || 'All'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="loading-spinner"><div className="spinner"></div></div>
        ) : appointments.length === 0 ? (
          <div className="empty-state">
            <FiCalendar size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
            <h3>No Appointments</h3>
            <p>You don&apos;t have any appointments yet.</p>
          </div>
        ) : (
          <div className="appointments-list">
            {appointments.map(apt => (
              <div key={apt._id} className="appointment-card glass-card">
                <div className="appointment-info">
                  <h3>
                    <FiUser style={{ marginRight: 8 }} />
                    {isLawyer 
                      ? (apt.userId as unknown as IUser)?.name || 'User' 
                      : (apt.lawyerId as unknown as ILawyer)?.name || 'Lawyer'}
                  </h3>
                  {apt.caseType && <span className="badge badge-primary" style={{ marginBottom: 8 }}>{apt.caseType}</span>}
                  <p>{apt.description || 'No description provided'}</p>
                  <div className="appointment-meta">
                    <span><FiCalendar /> {new Date(apt.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    <span><FiClock /> {apt.time}</span>
                    <span>₹{apt.fee || 0}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
                  <span className={`badge badge-${statusConfig[apt.status]?.color}`}>
                    {statusConfig[apt.status]?.icon} {apt.status}
                  </span>
                  {isLawyer && apt.status === 'pending' && (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-success btn-sm" onClick={() => updateStatus(apt._id, 'confirmed')}>Accept</button>
                      <button className="btn btn-danger btn-sm" onClick={() => updateStatus(apt._id, 'cancelled')}>Decline</button>
                    </div>
                  )}
                  {isLawyer && apt.status === 'confirmed' && (
                    <button className="btn btn-success btn-sm" onClick={() => updateStatus(apt._id, 'completed')}>Mark Complete</button>
                  )}
                  {!isLawyer && apt.status === 'pending' && (
                    <button className="btn btn-danger btn-sm" onClick={() => updateStatus(apt._id, 'cancelled')}>Cancel</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {toast && <div className={`toast toast-${toast.type}`}>{toast.message}</div>}
    </div>
  );
};

export default AppointmentsPage;

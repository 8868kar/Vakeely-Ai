import { FiStar } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const LawyerCard = ({ lawyer }) => {
  const navigate = useNavigate();

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="lawyer-card glass-card" onClick={() => navigate(`/lawyers/${lawyer._id}`)}>
      <div className="lawyer-card-header">
        <div className="lawyer-avatar">{getInitials(lawyer.name)}</div>
        <div>
          <h3>{lawyer.name}</h3>
          <span className="lawyer-location">{lawyer.location || 'India'}</span>
          <div className="lawyer-rating">
            <FiStar fill="var(--accent)" /> {lawyer.rating?.toFixed(1) || '0.0'}
            <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({lawyer.totalRatings || 0})</span>
          </div>
        </div>
      </div>

      <div className="lawyer-specializations">
        {lawyer.specializations?.map((spec, i) => (
          <span key={i} className="badge badge-primary">{spec}</span>
        ))}
      </div>

      <div className="lawyer-card-stats">
        <span><strong>{lawyer.experience || 0}</strong> yrs exp</span>
        <span><strong>₹{lawyer.consultationFee || 0}</strong>/consult</span>
        <span><strong>{lawyer.casesHandled || 0}</strong> cases</span>
      </div>
    </div>
  );
};

export default LawyerCard;

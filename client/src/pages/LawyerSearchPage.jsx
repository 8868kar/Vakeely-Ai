import { useState, useEffect } from 'react';
import { lawyerAPI } from '../services/api';
import LawyerCard from '../components/LawyerCard';
import { FiSearch, FiFilter } from 'react-icons/fi';

const SPECIALIZATIONS = ['All', 'Civil', 'Criminal', 'Corporate', 'IP', 'Tax', 'Family', 'Property', 'Labour', 'Constitutional', 'Consumer'];

const LawyerSearchPage = () => {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '', specialization: '', minRating: '', minExperience: '', maxFee: ''
  });
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

  useEffect(() => {
    fetchLawyers();
  }, []);

  const fetchLawyers = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (filters.search) params.search = filters.search;
      if (filters.specialization && filters.specialization !== 'All') params.specialization = filters.specialization;
      if (filters.minRating) params.minRating = filters.minRating;
      if (filters.minExperience) params.minExperience = filters.minExperience;
      if (filters.maxFee) params.maxFee = filters.maxFee;

      const res = await lawyerAPI.search(params);
      setLawyers(res.data.lawyers);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error('Failed to fetch lawyers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchLawyers(1);
  };

  return (
    <div className="page-content">
      <div className="container">
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>Find a Lawyer</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Search verified lawyers by specialization, experience, and rating</p>
        </div>

        <form onSubmit={handleSearch}>
          <div className="search-filters">
            <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
              <FiSearch style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                name="search"
                className="form-input"
                placeholder="Search by name..."
                value={filters.search}
                onChange={handleFilterChange}
                style={{ paddingLeft: 44, maxWidth: '100%' }}
              />
            </div>
            <select name="specialization" className="form-select" value={filters.specialization} onChange={handleFilterChange}>
              <option value="">Specialization</option>
              {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select name="minRating" className="form-select" value={filters.minRating} onChange={handleFilterChange}>
              <option value="">Min Rating</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
              <option value="2">2+ Stars</option>
            </select>
            <select name="minExperience" className="form-select" value={filters.minExperience} onChange={handleFilterChange}>
              <option value="">Experience</option>
              <option value="1">1+ years</option>
              <option value="3">3+ years</option>
              <option value="5">5+ years</option>
              <option value="10">10+ years</option>
            </select>
            <button type="submit" className="btn btn-primary">
              <FiFilter /> Apply
            </button>
          </div>
        </form>

        {loading ? (
          <div className="loading-spinner"><div className="spinner"></div></div>
        ) : lawyers.length === 0 ? (
          <div className="empty-state">
            <h3>No Lawyers Found</h3>
            <p>Try adjusting your search filters or check back later.</p>
            <p style={{ marginTop: 12, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Register as a lawyer to appear in search results.
            </p>
          </div>
        ) : (
          <>
            <p style={{ color: 'var(--text-muted)', marginBottom: 20, fontSize: '0.9rem' }}>
              Showing {lawyers.length} of {pagination.total} lawyers
            </p>
            <div className="lawyers-grid">
              {lawyers.map(lawyer => (
                <LawyerCard key={lawyer._id} lawyer={lawyer} />
              ))}
            </div>

            {pagination.pages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 40 }}>
                {Array.from({ length: pagination.pages }, (_, i) => (
                  <button
                    key={i + 1}
                    className={`btn ${pagination.page === i + 1 ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                    onClick={() => fetchLawyers(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LawyerSearchPage;

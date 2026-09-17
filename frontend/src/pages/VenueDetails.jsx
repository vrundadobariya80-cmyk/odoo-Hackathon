import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchVenueDetails } from '../services/api';
import { useAuth } from '../context/AuthContext';
import CourtCard from '../components/CourtCard';
import LoadingSpinner from '../components/LoadingSpinner';

const VenueDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCourt, setSelectedCourt] = useState(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const res = await fetchVenueDetails(id);
        setData(res.data);
      } catch (err) {
        console.error("Failed to load venue details", err);
      } finally {
        setLoading(false);
      }
    };
    loadDetails();
  }, [id]);

  if (loading) return <LoadingSpinner message="Loading venue details..." />;
  if (!data || !data.facility) {
    return (
      <div className="container py-5 text-center">
        <h3>Venue not found</h3>
        <Link to="/venues" className="btn btn-qc-emerald mt-3">Back to Venues</Link>
      </div>
    );
  }

  const { facility, courts, reviews } = data;

  const handleCourtSelect = (court) => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/booking?facility_id=${facility.id}&court_id=${court.id}` } } });
    } else {
      navigate(`/booking?facility_id=${facility.id}&court_id=${court.id}`);
    }
  };

  return (
    <div className="py-4">
      <div className="container">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb small">
            <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-muted">Home</Link></li>
            <li className="breadcrumb-item"><Link to="/venues" className="text-decoration-none text-muted">Venues</Link></li>
            <li className="breadcrumb-item active" aria-current="page">{facility.name}</li>
          </ol>
        </nav>

        {/* Hero Details Header */}
        <div className="qc-card mb-4 overflow-hidden">
          <div className="row g-0">
            <div className="col-lg-6">
              <div style={{ height: '380px', width: '100%', overflow: 'hidden' }}>
                <img
                  src={facility.image || 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800'}
                  alt={facility.name}
                  className="w-100 h-100"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>
            <div className="col-lg-6 p-4 p-md-5 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="qc-rating-badge">
                    <i className="bi bi-star-fill text-warning"></i> {facility.avg_rating > 0 ? facility.avg_rating : 'New'} ({facility.review_count} reviews)
                  </span>
                  <span className="badge bg-success-subtle text-success">Verified Facility</span>
                </div>

                <h2 className="fw-bold mb-2">{facility.name}</h2>
                <p className="text-muted mb-3"><i className="bi bi-geo-alt-fill text-danger me-1"></i> {facility.address}, {facility.location}</p>
                <p className="text-secondary small leading-relaxed mb-4">{facility.description}</p>
              </div>

              <div>
                <div className="mb-3">
                  <h6 className="fw-bold small text-uppercase text-muted">Supported Sports</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {facility.sports_list.map((sport, i) => (
                      <span key={i} className="badge bg-dark px-3 py-2 rounded-pill fs-6">
                        <i className="bi bi-trophy text-warning me-1"></i> {sport}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h6 className="fw-bold small text-uppercase text-muted">Amenities</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {facility.amenities_list.map((amenity, i) => (
                      <span key={i} className="badge bg-light text-dark border px-3 py-1 rounded-pill">
                        <i className="bi bi-check2 text-success me-1"></i> {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Courts List */}
        <div className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="fw-bold mb-0">Available Courts ({courts.length})</h4>
            <span className="text-muted small">Select a court to view open slots</span>
          </div>

          {courts.length === 0 ? (
            <div className="qc-card p-4 text-center">
              <p className="text-muted mb-0">No active courts available at this facility right now.</p>
            </div>
          ) : (
            <div className="row g-4">
              {courts.map((court) => (
                <div key={court.id} className="col-md-6 col-lg-4">
                  <CourtCard
                    court={court}
                    isSelected={selectedCourt?.id === court.id}
                    onSelect={handleCourtSelect}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Customer Reviews Section */}
        <div className="qc-card p-4 p-md-5">
          <h4 className="fw-bold mb-4">Customer Reviews & Ratings</h4>

          {reviews.length === 0 ? (
            <p className="text-muted mb-0">No reviews yet for this facility. Be the first to leave a review after booking!</p>
          ) : (
            <div className="row g-4">
              {reviews.map((r) => (
                <div key={r.id} className="col-md-6">
                  <div className="p-3 bg-light rounded-3 h-100">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={r.user_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                          alt={r.user_name}
                          className="rounded-circle"
                          width="36"
                          height="36"
                          style={{ objectFit: 'cover' }}
                        />
                        <h6 className="fw-bold mb-0">{r.user_name}</h6>
                      </div>
                      <div className="text-warning small">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <i key={i} className={`bi bi-star${i < r.rating ? '-fill' : ''} me-1`}></i>
                        ))}
                      </div>
                    </div>
                    <p className="text-secondary small mb-0">{r.comment}</p>
                    <span className="text-muted fs-7 d-block mt-2">{r.created_at}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VenueDetails;

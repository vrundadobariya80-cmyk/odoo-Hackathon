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

  const fullLocationQuery = `${facility.name}, ${facility.address}, ${facility.location}`;
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(fullLocationQuery)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullLocationQuery)}`;

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
                  src={facility.image || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1000&q=80'}
                  alt={facility.name}
                  className="w-100 h-100"
                  style={{ objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1000&q=80';
                  }}
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
                <p className="text-muted mb-3">
                  <i className="bi bi-geo-alt-fill text-danger me-1"></i> {facility.address}, {facility.location}
                </p>
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

        {/* Location & Interactive Map Section */}
        <div className="qc-card p-4 p-md-5 mb-5">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
            <div>
              <h4 className="fw-bold mb-1">
                <i className="bi bi-map text-success me-2"></i>Location & Directions
              </h4>
              <p className="text-muted small mb-0">
                Easily navigate to {facility.name} using Google Maps directions below.
              </p>
            </div>
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-qc-emerald"
            >
              <i className="bi bi-box-arrow-up-right me-2"></i>Get Directions in Google Maps
            </a>
          </div>

          <div className="row g-4 align-items-center">
            <div className="col-lg-5">
              <div className="p-3 bg-light rounded-3 border mb-3">
                <div className="d-flex align-items-start gap-3 mb-3">
                  <div className="qc-contact-icon flex-shrink-0 mt-1">
                    <i className="bi bi-geo-alt-fill text-danger fs-5"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">Full Venue Address</h6>
                    <p className="text-secondary small mb-0">{facility.address}</p>
                    <p className="fw-semibold small text-dark mb-0">{facility.location}, Gujarat, India</p>
                  </div>
                </div>

                <div className="border-top pt-3">
                  <div className="d-flex align-items-center justify-content-between text-muted small mb-2">
                    <span><i className="bi bi-clock me-1"></i> Opening Hours:</span>
                    <strong className="text-dark">06:00 AM - 10:00 PM</strong>
                  </div>
                  <div className="d-flex align-items-center justify-content-between text-muted small">
                    <span><i className="bi bi-p-circle me-1"></i> Parking Available:</span>
                    <strong className="text-success">Yes (Free)</strong>
                  </div>
                </div>
              </div>

              {/* Facility Owner Contact Card */}
              <div className="p-3 bg-white rounded-3 border border-2 border-primary-subtle shadow-sm">
                <div className="d-flex align-items-center gap-3">
                  <div className="avatar-placeholder rounded-circle bg-primary-subtle text-primary p-3 d-flex align-items-center justify-content-center fw-bold fs-5" style={{ width: '48px', height: '48px' }}>
                    <i className="bi bi-person-fill"></i>
                  </div>
                  <div className="flex-grow-1">
                    <span className="badge bg-primary-subtle text-primary small mb-1">Facility Manager & Owner</span>
                    <h6 className="fw-bold mb-0 text-dark">{facility.owner_name || 'QuickCourt Partner'}</h6>
                    <small className="text-muted d-block"><i className="bi bi-envelope-fill me-1 text-emerald"></i>{facility.owner_email || 'contact@quickcourt.com'}</small>
                  </div>
                </div>
                {facility.owner_email && (
                  <a
                    href={`mailto:${facility.owner_email}?subject=Inquiry regarding ${encodeURIComponent(facility.name)}`}
                    className="btn btn-outline-primary btn-sm w-100 mt-3 rounded-pill fw-semibold"
                  >
                    <i className="bi bi-envelope-at-fill me-1"></i> Email Venue Owner
                  </a>
                )}
              </div>
            </div>

            <div className="col-lg-7">
              <div className="rounded-3 overflow-hidden border shadow-sm" style={{ height: '300px' }}>
                <iframe
                  title={`Map location for ${facility.name}`}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight="0"
                  marginWidth="0"
                  src={mapEmbedUrl}
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
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
                    <p className="text-secondary small mb-2">{r.comment}</p>
                    
                    {r.image && (
                      <div className="mb-2 rounded-3 overflow-hidden border shadow-xs" style={{ maxHeight: '160px', maxWidth: '280px' }}>
                        <img
                          src={r.image}
                          alt="Review photo"
                          className="img-fluid w-100 h-100"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    )}

                    <span className="text-muted fs-7 d-block">{r.created_at}</span>
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

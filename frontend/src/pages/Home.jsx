import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchVenues } from '../services/api';
import VenueCard from '../components/VenueCard';
import SportCard from '../components/SportCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const [popularVenues, setPopularVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const sports = [
    { title: 'Badminton', icon: 'bi-trophy' },
    { title: 'Football', icon: 'bi-dribbble' },
    { title: 'Cricket', icon: 'bi-record-circle' },
    { title: 'Tennis', icon: 'bi-bounding-box-circles' },
    { title: 'Basketball', icon: 'bi-circle' },
    { title: 'Table Tennis', icon: 'bi-disc' }
  ];

  useEffect(() => {
    const loadVenues = async () => {
      try {
        const res = await fetchVenues({ limit: 6, sort_by: 'rating' });
        setPopularVenues(res.data.facilities || []);
      } catch (err) {
        console.error("Failed to load venues", err);
      } finally {
        setLoading(false);
      }
    };
    loadVenues();
  }, []);

  const handleSportClick = (sportTitle) => {
    navigate(`/venues?sport=${encodeURIComponent(sportTitle)}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container position-relative" style={{ zIndex: 1 }}>
          <div className="row align-items-center gy-4">
            <div className="col-lg-7">
              <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill fw-bold mb-3 d-inline-flex align-items-center gap-1">
                <i className="bi bi-fire"></i> #1 Local Sports Booking Platform in Ahmedabad
              </span>
              <h1 className="hero-headline">
                Book Your Game.<br />
                Find Your Court.<br />
                <span>Play More.</span>
              </h1>
              <p className="hero-subheading">
                Discover and book local sports facilities, turfs, and indoor courts in just a few clicks. Instant slot confirmation with zero hassle.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/venues" className="btn btn-qc-emerald btn-lg px-4 rounded-pill shadow-sm">
                  <i className="bi bi-search me-2"></i> Explore Venues
                </Link>
                <Link to="/venues" className="btn btn-qc-outline btn-lg px-4 rounded-pill">
                  <i className="bi bi-calendar-event me-2"></i> Book a Court
                </Link>
              </div>

              <div className="d-flex align-items-center gap-4 mt-5 pt-3 border-top border-secondary border-opacity-25">
                <div>
                  <h4 className="fw-extrabold mb-0 text-white">50+</h4>
                  <span className="text-muted small">Active Courts</span>
                </div>
                <div className="border-end border-secondary border-opacity-25 h-100" style={{ height: '30px' }}></div>
                <div>
                  <h4 className="fw-extrabold mb-0 text-white">10k+</h4>
                  <span className="text-muted small">Games Played</span>
                </div>
                <div className="border-end border-secondary border-opacity-25 h-100" style={{ height: '30px' }}></div>
                <div>
                  <h4 className="fw-extrabold mb-0 text-white">4.9★</h4>
                  <span className="text-muted small">User Rating</span>
                </div>
              </div>
            </div>

            <div className="col-lg-5 text-center">
              <div className="position-relative">
                <img
                  src="https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800"
                  alt="Sports Turf"
                  className="img-fluid rounded-4 shadow-lg border border-3 border-white border-opacity-25"
                  style={{ maxHeight: '420px', objectFit: 'cover', width: '100%' }}
                />
                <div className="qc-card position-absolute bottom-0 start-0 m-3 p-3 text-start bg-white shadow-lg d-flex align-items-center gap-3 rounded-3" style={{ maxWidth: '260px' }}>
                  <div className="bg-success-subtle text-success p-2 rounded-circle">
                    <i className="bi bi-check-circle-fill fs-4"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0 text-dark">Instant Slot Lock</h6>
                    <small className="text-muted">Real-time availability</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sports Categories */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="text-center mb-4">
            <span className="text-success fw-bold text-uppercase small tracking-wider">Choose Your Game</span>
            <h2 className="fw-bold text-dark">Popular Sports Categories</h2>
          </div>

          <div className="row g-3">
            {sports.map((s, idx) => (
              <div key={idx} className="col-6 col-md-4 col-lg-2">
                <SportCard title={s.title} icon={s.icon} onClick={() => handleSportClick(s.title)} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Venues */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <span className="text-success fw-bold text-uppercase small">Top Rated Facilities</span>
              <h2 className="fw-bold mb-0">Popular Sports Venues in Ahmedabad</h2>
            </div>
            <Link to="/venues" className="btn btn-qc-outline rounded-pill btn-sm">
              View All Venues <i className="bi bi-arrow-right"></i>
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner message="Fetching top sports venues..." />
          ) : (
            <div className="row g-4">
              {popularVenues.map((facility) => (
                <div key={facility.id} className="col-md-6 col-lg-4">
                  <VenueCard facility={facility} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-5 bg-white border-top">
        <div className="container">
          <div className="text-center mb-5">
            <span className="text-success fw-bold text-uppercase small">Simple Booking Process</span>
            <h2 className="fw-bold text-dark">How QuickCourt Works</h2>
          </div>

          <div className="row g-4 text-center">
            <div className="col-md-4">
              <div className="p-4 rounded-4 bg-light h-100">
                <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 fs-3 fw-bold" style={{ width: 64, height: 64 }}>
                  1
                </div>
                <h5 className="fw-bold">Find a Venue</h5>
                <p className="text-muted small mb-0">
                  Search by location, sport, or price range. Browse verified customer reviews and high quality photos.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 rounded-4 bg-light h-100">
                <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 fs-3 fw-bold" style={{ width: 64, height: 64 }}>
                  2
                </div>
                <h5 className="fw-bold">Pick Court & Time</h5>
                <p className="text-muted small mb-0">
                  Select your preferred court, date, and live available hourly time slot. No double bookings guaranteed.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 rounded-4 bg-light h-100">
                <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 fs-3 fw-bold" style={{ width: 64, height: 64 }}>
                  3
                </div>
                <h5 className="fw-bold">Simulate Payment & Play</h5>
                <p className="text-muted small mb-0">
                  Complete simulated demo payment via UPI, Card, or Cash and receive instant booking confirmation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

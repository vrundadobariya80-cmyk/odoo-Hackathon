import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchVenues } from '../services/api';
import VenueCard from '../components/VenueCard';
import SportCard from '../components/SportCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const [popularVenues, setPopularVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [selectedSportTab, setSelectedSportTab] = useState('All');
  const [loading, setLoading] = useState(true);

  // Quick Hero Search Inputs
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSport, setSearchSport] = useState('');

  const navigate = useNavigate();

  const sports = [
    { title: 'Badminton', icon: 'bi-trophy', count: '14 Courts' },
    { title: 'Football', icon: 'bi-dribbble', count: '18 Turfs' },
    { title: 'Cricket', icon: 'bi-record-circle', count: '12 Nets' },
    { title: 'Tennis', icon: 'bi-bounding-box-circles', count: '8 Courts' },
    { title: 'Basketball', icon: 'bi-circle', count: '10 Arenas' },
    { title: 'Table Tennis', icon: 'bi-disc', count: '6 Tables' }
  ];

  const features = [
    {
      icon: 'bi-lightning-charge-fill',
      title: 'Instant Slot Lock',
      description: 'Book hourly slots in real-time. No double bookings, no waiting for manual phone confirmations.'
    },
    {
      icon: 'bi-patch-check-fill',
      title: '100% Verified Venues',
      description: 'All turfs and indoor arenas undergo quality checks for lighting, flooring, and safety.'
    },
    {
      icon: 'bi-credit-card-2-back-fill',
      title: 'Flexible Payment Options',
      description: 'Pay online via UPI / Debit Card or choose Cash Payment at venue upon your arrival.'
    },
    {
      icon: 'bi-arrow-counterclockwise',
      title: 'Easy Cancellations',
      description: 'Cancel upcoming reservations hassle-free with automatic slot release for other players.'
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Rohan Sharma',
      role: 'Badminton Enthusiast',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      comment: 'QuickCourt made booking box cricket turfs in Bodakdev so easy! Reserved our 8 PM slot in under 30 seconds.'
    },
    {
      id: 2,
      name: 'Priya Patel',
      role: 'Weekend Tennis Player',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      comment: 'Loved the option to pay in cash at venue. The court lighting and synthetic turf quality were top-notch!'
    },
    {
      id: 3,
      name: 'Aman Verma',
      role: 'Football Club Captain',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
      comment: 'Awesome platform for facility owners and players alike. Instant confirmation and clean UI!'
    }
  ];

  useEffect(() => {
    const loadVenues = async () => {
      try {
        const res = await fetchVenues({ limit: 6, sort_by: 'rating' });
        const list = res.data.facilities || [];
        setPopularVenues(list);
        setFilteredVenues(list);
      } catch (err) {
        console.error("Failed to load venues", err);
      } finally {
        setLoading(false);
      }
    };
    loadVenues();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    let url = '/venues?';
    const params = [];
    if (searchQuery.trim()) params.push(`search=${encodeURIComponent(searchQuery.trim())}`);
    if (searchSport) params.push(`sport=${encodeURIComponent(searchSport)}`);
    navigate(url + params.join('&'));
  };

  const handleSportClick = (sportTitle) => {
    navigate(`/venues?sport=${encodeURIComponent(sportTitle)}`);
  };

  const handleTabFilter = (sportName) => {
    setSelectedSportTab(sportName);
    if (sportName === 'All') {
      setFilteredVenues(popularVenues);
    } else {
      setFilteredVenues(popularVenues.filter((f) => f.sports && f.sports.toLowerCase().includes(sportName.toLowerCase())));
    }
  };

  return (
    <div>
      {/* HERO SECTION */}
      <section className="hero-section py-5 position-relative">
        <div className="container position-relative" style={{ zIndex: 1 }}>
          <div className="row align-items-center gy-4">
            {/* Hero Left Content */}
            <div className="col-lg-7">
              <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                <span className="badge bg-success-subtle text-emerald px-3 py-2 rounded-pill fw-bold border border-success border-opacity-25 d-inline-flex align-items-center gap-1">
                  <i className="bi bi-fire text-warning"></i> #1 Local Sports Booking Platform in Ahmedabad
                </span>
                <span className="hero-stats-badge small d-inline-flex align-items-center gap-1">
                  <i className="bi bi-patch-check-fill text-emerald"></i> Verified Venues
                </span>
              </div>

              <h1 className="hero-headline">
                Book Your Game.<br />
                Find Your Court.<br />
                <span>Play More.</span>
              </h1>
              
              <p className="hero-subheading">
                Discover local sports facilities, FIFA-standard turfs, and synthetic indoor courts. Instant hourly slot locking with zero hassle.
              </p>

              {/* Glassmorphism Quick Search Bar */}
              <div className="hero-glass-search mb-4">
                <form onSubmit={handleHeroSearch} className="row g-2 align-items-center">
                  <div className="col-md-5">
                    <div className="input-group">
                      <span className="input-group-text bg-transparent border-0 text-muted ps-2">
                        <i className="bi bi-geo-alt-fill text-danger"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control border-0 bg-transparent ps-0 shadow-none text-dark"
                        placeholder="Location or Venue (e.g. Bodakdev)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="input-group">
                      <span className="input-group-text bg-transparent border-0 text-muted ps-2">
                        <i className="bi bi-trophy-fill text-warning"></i>
                      </span>
                      <select
                        className="form-select border-0 bg-transparent ps-0 shadow-none text-dark"
                        value={searchSport}
                        onChange={(e) => setSearchSport(e.target.value)}
                      >
                        <option value="">All Sports</option>
                        {sports.map((s, idx) => (
                          <option key={idx} value={s.title}>{s.title}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-md-3">
                    <button type="submit" className="btn btn-qc-emerald w-100 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-1">
                      <i className="bi bi-search"></i> Find Courts
                    </button>
                  </div>
                </form>
              </div>

              {/* Quick Stat Highlights */}
              <div className="d-flex align-items-center gap-4 pt-2">
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
                  <span className="text-muted small">Player Rating</span>
                </div>
              </div>
            </div>

            {/* Hero Right Visual Banner */}
            <div className="col-lg-5 text-center">
              <div className="position-relative">
                <img
                  src="https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800"
                  alt="Sports Turf"
                  className="img-fluid rounded-4 shadow-lg border border-3 border-white border-opacity-25"
                  style={{ maxHeight: '420px', objectFit: 'cover', width: '100%' }}
                />
                
                {/* Floating Confirmation Badge */}
                <div className="qc-card position-absolute bottom-0 start-0 m-3 p-3 text-start bg-white shadow-lg d-flex align-items-center gap-3 rounded-3" style={{ maxWidth: '260px' }}>
                  <div className="bg-success-subtle text-success p-2 rounded-circle">
                    <i className="bi bi-check-circle-fill fs-4"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0 text-dark">Instant Confirmation</h6>
                    <small className="text-muted">Real-time slot lock</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SPORTS CATEGORIES */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="text-center mb-4">
            <span className="text-emerald fw-bold text-uppercase small tracking-wider">Choose Your Game</span>
            <h2 className="fw-bold text-dark mb-1">Popular Sports Categories</h2>
            <p className="text-muted small mb-0">Select your favorite sport to filter verified local facilities</p>
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

      {/* POPULAR SPORTS VENUES WITH FILTER TABS */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 gap-3">
            <div>
              <span className="text-emerald fw-bold text-uppercase small">Top Rated Venues</span>
              <h2 className="fw-bold mb-0 text-dark">Popular Facilities in Ahmedabad</h2>
            </div>

            {/* Sport Filter Tabs */}
            <div className="d-flex flex-wrap gap-2">
              {['All', 'Badminton', 'Football', 'Cricket', 'Tennis'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={`btn btn-sm rounded-pill px-3 fw-semibold ${
                    selectedSportTab === tab ? 'btn-emerald text-white shadow-sm' : 'btn-outline-secondary'
                  }`}
                  onClick={() => handleTabFilter(tab)}
                >
                  {tab}
                </button>
              ))}
              <Link to="/venues" className="btn btn-qc-outline rounded-pill btn-sm ms-md-2">
                View All <i className="bi bi-arrow-right ms-1"></i>
              </Link>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner message="Fetching top sports venues..." />
          ) : filteredVenues.length === 0 ? (
            <div className="qc-card p-5 text-center border-0 shadow-sm">
              <i className="bi bi-geo-alt fs-1 text-muted mb-2 d-block"></i>
              <h5 className="fw-bold">No Venues Found</h5>
              <p className="text-muted small mb-3">No facilities match the selected sport filter.</p>
              <button className="btn btn-sm btn-outline-secondary rounded-pill" onClick={() => handleTabFilter('All')}>
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="row g-4">
              {filteredVenues.map((facility) => (
                <div key={facility.id} className="col-md-6 col-lg-4">
                  <VenueCard facility={facility} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* WHY CHOOSE QUICKCOURT? (FEATURES GRID) */}
      <section className="py-5 bg-white border-top border-bottom">
        <div className="container">
          <div className="text-center mb-5">
            <span className="text-emerald fw-bold text-uppercase small">Why QuickCourt?</span>
            <h2 className="fw-bold text-dark">Built for Modern Sports Enthusiasts</h2>
            <p className="text-muted small mb-0">Hassle-free booking experience engineered for players and teams.</p>
          </div>

          <div className="row g-4">
            {features.map((feat, idx) => (
              <div key={idx} className="col-md-6 col-lg-3">
                <div className="feature-card h-100">
                  <div className="feature-icon-box">
                    <i className={`bi ${feat.icon}`}></i>
                  </div>
                  <h5 className="fw-bold text-dark mb-2">{feat.title}</h5>
                  <p className="text-muted small mb-0 leading-relaxed">{feat.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS (3-STEP GUIDE) */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <span className="text-emerald fw-bold text-uppercase small">Simple 3-Step Booking</span>
            <h2 className="fw-bold text-dark">How QuickCourt Works</h2>
            <p className="text-muted small mb-0">From search to court kickoff in under 1 minute</p>
          </div>

          <div className="row g-4 text-center">
            <div className="col-md-4">
              <div className="step-card h-100">
                <div className="step-number mx-auto">1</div>
                <h5 className="fw-bold text-dark mb-2">Find a Venue</h5>
                <p className="text-muted small mb-0">
                  Search by location (e.g. Bodakdev, Satellite), sport category, or hourly price. Read verified reviews.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="step-card h-100">
                <div className="step-number mx-auto">2</div>
                <h5 className="fw-bold text-dark mb-2">Pick Court & Time</h5>
                <p className="text-muted small mb-0">
                  Select your court, date, and live available hourly slot. Prevents double-booking automatically.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="step-card h-100">
                <div className="step-number mx-auto">3</div>
                <h5 className="fw-bold text-dark mb-2">Pay & Play</h5>
                <p className="text-muted small mb-0">
                  Choose UPI, Card, or Pay at Venue in Cash. Get instant booking confirmation receipt and play!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMMUNITY TESTIMONIALS */}
      <section className="py-5 bg-white border-top">
        <div className="container">
          <div className="text-center mb-5">
            <span className="text-emerald fw-bold text-uppercase small">Player Reviews</span>
            <h2 className="fw-bold text-dark">Loved by Sports Enthusiasts</h2>
          </div>

          <div className="row g-4">
            {testimonials.map((t) => (
              <div key={t.id} className="col-md-4">
                <div className="p-4 rounded-4 bg-light h-100 border border-light-subtle d-flex flex-column justify-content-between">
                  <div className="mb-3">
                    <div className="text-warning mb-2">
                      <i className="bi bi-star-fill me-1"></i>
                      <i className="bi bi-star-fill me-1"></i>
                      <i className="bi bi-star-fill me-1"></i>
                      <i className="bi bi-star-fill me-1"></i>
                      <i className="bi bi-star-fill"></i>
                    </div>
                    <p className="text-dark small fst-italic mb-0">"{t.comment}"</p>
                  </div>

                  <div className="d-flex align-items-center gap-3 pt-3 border-top border-secondary-subtle">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="rounded-circle border"
                      width="42"
                      height="42"
                      style={{ objectFit: 'cover' }}
                    />
                    <div>
                      <h6 className="fw-bold mb-0 text-dark small">{t.name}</h6>
                      <span className="text-muted fs-7">{t.role}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FACILITY OWNER CTA BANNER */}
      <section className="py-5">
        <div className="container">
          <div className="owner-cta-banner p-4 p-md-5">
            <div className="row align-items-center gy-4 position-relative" style={{ zIndex: 1 }}>
              <div className="col-lg-8">
                <span className="badge bg-emerald text-white px-3 py-2 rounded-pill fw-bold mb-2">
                  <i className="bi bi-building me-1"></i> For Venue & Turf Owners
                </span>
                <h2 className="fw-bold text-white mb-2">Own a Sports Facility in Ahmedabad?</h2>
                <p className="text-light opacity-75 mb-0 fs-6">
                  List your turfs, badminton courts, or cricket nets on QuickCourt. Manage slots, accept online/cash bookings, and grow your revenue seamlessly.
                </p>
              </div>
              <div className="col-lg-4 text-lg-end">
                <Link to="/signup" className="btn btn-qc-emerald btn-lg px-4 rounded-pill shadow-lg">
                  <i className="bi bi-plus-circle me-2"></i> List Your Facility
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;


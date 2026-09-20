import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchVenues } from '../services/api';
import VenueCard from '../components/VenueCard';
import SportCard from '../components/SportCard';
import SlotEstimatorWidget from '../components/SlotEstimatorWidget';
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
    { title: 'Badminton', icon: 'bi-trophy', count: '14 Arenas' },
    { title: 'Football', icon: 'bi-dribbble', count: '18 Turfs' },
    { title: 'Cricket', icon: 'bi-record-circle', count: '12 Nets' },
    { title: 'Tennis', icon: 'bi-bounding-box-circles', count: '8 Courts' },
    { title: 'Basketball', icon: 'bi-circle', count: '10 Courts' },
    { title: 'Table Tennis', icon: 'bi-disc', count: '6 Tables' }
  ];

  const quickLocations = ['Bodakdev', 'Satellite', 'Sindhu Bhavan', 'SG Highway'];

  const features = [
    {
      icon: 'bi-lightning-charge-fill',
      title: 'Instant Hourly Slot Lock',
      description: 'Book live hourly court slots in real-time. Guaranteed zero double bookings or manual call delays.'
    },
    {
      icon: 'bi-patch-check-fill',
      title: '100% Verified Turf Standards',
      description: 'All listed venues undergo strict quality checks for floodlighting lux, synthetic matting, and safety.'
    },
    {
      icon: 'bi-credit-card-2-back-fill',
      title: 'Flexible Cash & UPI Pay',
      description: 'Pay instantly via UPI / Card or select Pay-at-Venue Cash options upon your match arrival.'
    },
    {
      icon: 'bi-arrow-counterclockwise',
      title: 'Zero Penalty Cancellations',
      description: 'Cancel upcoming reservations hassle-free with instant slot release for fellow sports players.'
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Rohan Sharma',
      role: 'Badminton Player • Bodakdev',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      comment: 'QuickCourt made reserving box cricket turfs in Bodakdev so smooth! Booked our 8 PM night slot in under 30 seconds.'
    },
    {
      id: 2,
      name: 'Priya Patel',
      role: 'Tennis Player • Satellite',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      comment: 'Loved the option to pay cash at the court. The floodlights and synthetic mat flooring quality were top tier!'
    },
    {
      id: 3,
      name: 'Aman Verma',
      role: 'Football Captain • Sindhu Bhavan',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
      comment: 'Awesome platform for facility owners and players alike. Instant confirmation receipt and clean UI!'
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
      <section className="hero-section position-relative">
        <div className="hero-bg-glow-1"></div>
        <div className="hero-bg-glow-2"></div>

        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="row align-items-center gy-5">
            {/* Hero Left Content */}
            <div className="col-lg-7">
              {/* Live Ticker Badge */}
              <div className="mb-3.5">
                <div className="qc-live-ticker shadow-sm">
                  <span className="live-dot"></span>
                  <span><strong>Live Update:</strong> 2 mins ago, 10-over Cricket Slot booked at Bodakdev Arena</span>
                </div>
              </div>

              {/* Dynamic Headline */}
              <h1 className="hero-headline">
                Book Your Game.<br />
                Reserve Your Turf.<br />
                <span className="text-gradient-emerald">Play Instantly.</span>
              </h1>
              
              <p className="hero-subheading">
                Discover 50+ FIFA-standard turfs and BWF synthetic indoor courts in Ahmedabad. Instant hourly slot locking with zero manual phone confirmation.
              </p>

              {/* Glassmorphism Quick Search Box */}
              <div className="hero-glass-search mb-3">
                <form onSubmit={handleHeroSearch} className="row g-2 align-items-center">
                  <div className="col-md-5">
                    <div className="input-group">
                      <span className="input-group-text bg-transparent border-0 text-muted ps-2">
                        <i className="bi bi-geo-alt-fill text-danger fs-5"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control border-0 bg-transparent ps-0 shadow-none text-dark fw-semibold"
                        placeholder="Area or Venue (e.g. Bodakdev)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="input-group border-start border-md-0 border-secondary border-opacity-25">
                      <span className="input-group-text bg-transparent border-0 text-muted ps-2">
                        <i className="bi bi-trophy-fill text-warning fs-5"></i>
                      </span>
                      <select
                        className="form-select border-0 bg-transparent ps-0 shadow-none text-dark fw-semibold"
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
                    <button type="submit" className="btn btn-qc-emerald w-100 fw-bold d-flex align-items-center justify-content-center gap-1.5">
                      <i className="bi bi-search"></i> Find Courts
                    </button>
                  </div>
                </form>

                {/* Quick Location Filter Pills */}
                <div className="d-flex align-items-center gap-2 mt-2.5 pt-2 border-top border-dark border-opacity-10">
                  <span className="text-muted fs-7 fw-semibold">Popular Areas:</span>
                  <div className="d-flex flex-wrap gap-1.5">
                    {quickLocations.map((loc, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className="location-chip"
                        onClick={() => setSearchQuery(loc)}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Stat Counter Highlights */}
              <div className="d-flex align-items-center gap-4 pt-3">
                <div>
                  <h4 className="fw-extrabold mb-0 text-white fs-3">50+</h4>
                  <span className="text-muted fs-7">Active Arenas</span>
                </div>
                <div className="border-end border-secondary border-opacity-25" style={{ height: '36px' }}></div>
                <div>
                  <h4 className="fw-extrabold mb-0 text-white fs-3">15k+</h4>
                  <span className="text-muted fs-7">Matches Played</span>
                </div>
                <div className="border-end border-secondary border-opacity-25" style={{ height: '36px' }}></div>
                <div>
                  <h4 className="fw-extrabold mb-0 text-white fs-3">4.9★</h4>
                  <span className="text-muted fs-7">Player Rating</span>
                </div>
                <div className="border-end border-secondary border-opacity-25" style={{ height: '36px' }}></div>
                <div>
                  <h4 className="fw-extrabold mb-0 text-emerald fs-3">100%</h4>
                  <span className="text-muted fs-7">Instant Lock</span>
                </div>
              </div>
            </div>

            {/* Hero Right Visual Banner */}
            <div className="col-lg-5 text-center position-relative">
              <div className="position-relative floating-hero-card">
                <img
                  src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1000&q=80"
                  alt="Sports Turf"
                  className="img-fluid rounded-4 shadow-lg border border-2 border-white border-opacity-25"
                  style={{ maxHeight: '440px', objectFit: 'cover', width: '100%' }}
                />
                
                {/* Floating Confirmation Card */}
                <div className="qc-card position-absolute bottom-0 start-0 m-3 p-3 text-start bg-white shadow-lg d-flex align-items-center gap-3 rounded-4" style={{ maxWidth: '270px' }}>
                  <div className="bg-success-subtle text-success p-2.5 rounded-circle d-flex align-items-center justify-content-center">
                    <i className="bi bi-shield-check fs-3"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0 text-dark fs-6">Instant Slot Lock</h6>
                    <small className="text-muted fs-7">Real-time availability sync</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SPORTS CATEGORIES HUB */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="text-center mb-4">
            <span className="text-emerald fw-bold text-uppercase fs-7 tracking-wider">Choose Your Sport</span>
            <h2 className="fw-extrabold text-dark mb-1">Popular Sports Arenas in Ahmedabad</h2>
            <p className="text-muted small mb-0">Select your favorite sport to filter verified local facilities</p>
          </div>

          <div className="row g-3">
            {sports.map((s, idx) => (
              <div key={idx} className="col-6 col-md-4 col-lg-2">
                <SportCard
                  title={s.title}
                  icon={s.icon}
                  count={s.count}
                  onClick={() => handleSportClick(s.title)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR SPORTS VENUES SHOWCASE WITH FILTER TABS */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 gap-3">
            <div>
              <span className="text-emerald fw-bold text-uppercase fs-7 tracking-wider">Top Rated Venues</span>
              <h2 className="fw-extrabold mb-0 text-dark">Featured Facilities in Ahmedabad</h2>
            </div>

            {/* Sport Filter Tabs */}
            <div className="d-flex flex-wrap gap-2">
              {['All', 'Badminton', 'Football', 'Cricket', 'Tennis'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={`btn btn-sm rounded-pill px-3.5 fw-bold ${
                    selectedSportTab === tab ? 'btn-emerald text-white shadow-sm' : 'btn-outline-secondary'
                  }`}
                  onClick={() => handleTabFilter(tab)}
                >
                  {tab}
                </button>
              ))}
              <Link to="/venues" className="btn btn-qc-outline rounded-pill btn-sm ms-md-2 fw-bold">
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

      {/* INTERACTIVE SLOT ESTIMATOR & CALCULATOR WIDGET */}
      <section className="py-4">
        <div className="container">
          <SlotEstimatorWidget />
        </div>
      </section>

      {/* WHY CHOOSE QUICKCOURT? (FEATURES GRID) */}
      <section className="py-5 bg-white border-top border-bottom">
        <div className="container">
          <div className="text-center mb-5">
            <span className="text-emerald fw-bold text-uppercase fs-7 tracking-wider">Why QuickCourt?</span>
            <h2 className="fw-extrabold text-dark">Engineered for Modern Athletes</h2>
            <p className="text-muted small mb-0">Hassle-free booking experience crafted for casual players & league captains alike.</p>
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
            <span className="text-emerald fw-bold text-uppercase fs-7 tracking-wider">3 Easy Steps</span>
            <h2 className="fw-extrabold text-dark">How QuickCourt Works</h2>
            <p className="text-muted small mb-0">From court search to kickoff in under 1 minute</p>
          </div>

          <div className="row g-4 text-center">
            <div className="col-md-4">
              <div className="step-card h-100">
                <div className="step-number mx-auto">1</div>
                <h5 className="fw-bold text-dark mb-2">Discover Venues</h5>
                <p className="text-muted small mb-0">
                  Search by location (Bodakdev, Satellite, SG Highway), sport category, or hourly budget. Inspect verified photos & amenities.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="step-card h-100">
                <div className="step-number mx-auto">2</div>
                <h5 className="fw-bold text-dark mb-2">Pick Court & Hour</h5>
                <p className="text-muted small mb-0">
                  Choose your court, preferred date, and live hourly slot grid. Prevents double bookings automatically.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="step-card h-100">
                <div className="step-number mx-auto">3</div>
                <h5 className="fw-bold text-dark mb-2">Instant Pay & Play</h5>
                <p className="text-muted small mb-0">
                  Pay online via UPI, Card, or choose Cash Pay at Venue upon arrival. Receive instant booking receipt!
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
            <span className="text-emerald fw-bold text-uppercase fs-7 tracking-wider">Player Feedback</span>
            <h2 className="fw-extrabold text-dark">Trusted by 10,000+ Players</h2>
          </div>

          <div className="row g-4">
            {testimonials.map((t) => (
              <div key={t.id} className="col-md-4">
                <div className="p-4 rounded-4 bg-light h-100 border border-light-subtle d-flex flex-column justify-content-between shadow-sm">
                  <div className="mb-3">
                    <div className="text-warning mb-2 fs-6">
                      <i className="bi bi-star-fill me-1"></i>
                      <i className="bi bi-star-fill me-1"></i>
                      <i className="bi bi-star-fill me-1"></i>
                      <i className="bi bi-star-fill me-1"></i>
                      <i className="bi bi-star-fill"></i>
                    </div>
                    <p className="text-dark small fst-italic mb-0 leading-relaxed">"{t.comment}"</p>
                  </div>

                  <div className="d-flex align-items-center gap-3 pt-3 border-top border-secondary-subtle">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="rounded-circle border border-2 border-emerald"
                      width="44"
                      height="44"
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
            <div className="row align-items-center gy-4 position-relative" style={{ zIndex: 2 }}>
              <div className="col-lg-8">
                <span className="badge bg-emerald text-white px-3 py-2 rounded-pill fw-bold mb-3 shadow-sm d-inline-flex align-items-center gap-1.5">
                  <i className="bi bi-building"></i> Partner Platform for Venue Owners
                </span>
                <h2 className="fw-extrabold text-white mb-2 fs-2">Own a Turf or Sports Arena in Ahmedabad?</h2>
                <p className="text-light opacity-80 mb-0 fs-6">
                  Partner with QuickCourt to list your courts, automate hourly slot locks, eliminate phone call chaos, and track real-time revenue analytics.
                </p>
              </div>
              <div className="col-lg-4 text-lg-end">
                <Link to="/signup" className="btn btn-qc-emerald btn-lg px-4 rounded-pill shadow-lg fw-bold d-inline-flex align-items-center gap-2">
                  <i className="bi bi-plus-circle-fill"></i> List Your Facility
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

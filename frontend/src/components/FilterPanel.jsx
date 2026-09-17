import React from 'react';

const FilterPanel = ({ sport, setSport, priceMax, setPriceMax, ratingMin, setRatingMin, sortBy, setSortBy, onReset }) => {
  const sportsOptions = ['Badminton', 'Football', 'Cricket', 'Tennis', 'Basketball', 'Table Tennis'];

  return (
    <div className="qc-card p-4">
      <h6 className="fw-bold mb-3 d-flex align-items-center justify-content-between">
        <span><i className="bi bi-funnel-fill text-success me-2"></i> Filters & Sort</span>
        <button type="button" className="btn btn-link btn-sm text-decoration-none text-muted p-0" onClick={onReset}>
          Reset All
        </button>
      </h6>

      {/* Sport filter */}
      <div className="mb-4">
        <label className="form-label fw-semibold small text-uppercase text-muted">Sport Category</label>
        <select className="form-select" value={sport} onChange={(e) => setSport(e.target.value)}>
          <option value="">All Sports</option>
          {sportsOptions.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Price filter */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <label className="form-label fw-semibold small text-uppercase text-muted mb-0">Max Price / Hour</label>
          <span className="fw-bold text-success small">₹{priceMax || 2000}</span>
        </div>
        <input
          type="range"
          className="form-range"
          min="200"
          max="2000"
          step="50"
          value={priceMax || 2000}
          onChange={(e) => setPriceMax(Number(e.target.value))}
        />
      </div>

      {/* Rating filter */}
      <div className="mb-4">
        <label className="form-label fw-semibold small text-uppercase text-muted">Minimum Rating</label>
        <select className="form-select" value={ratingMin} onChange={(e) => setRatingMin(e.target.value)}>
          <option value="">Any Rating</option>
          <option value="4.5">4.5★ & Above</option>
          <option value="4.0">4.0★ & Above</option>
          <option value="3.5">3.5★ & Above</option>
        </select>
      </div>

      {/* Sort By */}
      <div className="mb-2">
        <label className="form-label fw-semibold small text-uppercase text-muted">Sort Venues By</label>
        <select className="form-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="rating">Top Rated</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
};

export default FilterPanel;

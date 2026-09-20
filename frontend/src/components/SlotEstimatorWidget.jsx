import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SlotEstimatorWidget = () => {
  const navigate = useNavigate();

  const [selectedSport, setSelectedSport] = useState('Football');
  const [timeOfDay, setTimeOfDay] = useState('Evening Prime');
  const [groupSize, setGroupSize] = useState('Squad (5-10)');

  const sportsData = {
    Football: { basePrice: 1200, icon: 'bi-dribbble', features: ['FIFA Standard Turf', 'High-Lux Floodlights', 'Water Station'] },
    Badminton: { basePrice: 600, icon: 'bi-trophy', features: ['BWF Synthetic Mat', 'Air-cooled Hall', 'Racket Rental'] },
    Cricket: { basePrice: 1000, icon: 'bi-record-circle', features: ['Box Cricket Netting', 'Night Lighting', 'Soft Balls Included'] },
    Tennis: { basePrice: 800, icon: 'bi-bounding-box-circles', features: ['Hard Court Surface', 'Ball Boy Option', 'Shower Room'] },
    Basketball: { basePrice: 900, icon: 'bi-circle', features: ['Wooden Flooring', 'FIBA Hoops', 'Locker Room'] }
  };

  const timeMultipliers = {
    'Morning (6AM-12PM)': 0.85,
    'Afternoon (12PM-5PM)': 0.75,
    'Evening Prime (5PM-11PM)': 1.15
  };

  const groupMultipliers = {
    'Duo (2-4)': 1.0,
    'Squad (5-10)': 1.05,
    'Team (10+)': 1.15
  };

  const currentData = sportsData[selectedSport] || sportsData.Football;
  const timeMult = timeMultipliers[timeOfDay] || 1.0;
  const groupMult = groupMultipliers[groupSize] || 1.0;

  const estimatedPrice = Math.round(currentData.basePrice * timeMult * groupMult);

  const handleSearch = () => {
    navigate(`/venues?sport=${encodeURIComponent(selectedSport)}`);
  };

  return (
    <div className="slot-estimator-card position-relative">
      <div className="row align-items-center gy-4 position-relative" style={{ zIndex: 1 }}>
        {/* Left Column: Interactive Selector */}
        <div className="col-lg-7">
          <div className="d-inline-flex align-items-center gap-2 mb-3 px-3 py-1 rounded-pill bg-white bg-opacity-10 border border-white border-opacity-25 text-emerald small fw-bold">
            <i className="bi bi-calculator-fill text-emerald"></i> Quick Court & Price Estimator
          </div>
          <h3 className="fw-extrabold text-white mb-2">Find Your Ideal Slot & Rates</h3>
          <p className="text-light opacity-75 small mb-4">
            Select your sport preference, play hours, and squad size for live court suggestions & hourly estimates.
          </p>

          {/* 1. Sport Selector Pills */}
          <div className="mb-3">
            <label className="text-light fs-7 text-uppercase fw-bold tracking-wider mb-2 d-block">
              1. Select Sport
            </label>
            <div className="d-flex flex-wrap gap-2">
              {Object.keys(sportsData).map((sport) => (
                <button
                  key={sport}
                  type="button"
                  className={`estimator-pill-btn d-inline-flex align-items-center gap-1.5 ${
                    selectedSport === sport ? 'active' : ''
                  }`}
                  onClick={() => setSelectedSport(sport)}
                >
                  <i className={`bi ${sportsData[sport].icon}`}></i>
                  {sport}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Time of Day Selector */}
          <div className="mb-3">
            <label className="text-light fs-7 text-uppercase fw-bold tracking-wider mb-2 d-block">
              2. Playing Hours
            </label>
            <div className="d-flex flex-wrap gap-2">
              {Object.keys(timeMultipliers).map((time) => (
                <button
                  key={time}
                  type="button"
                  className={`estimator-pill-btn ${timeOfDay === time ? 'active' : ''}`}
                  onClick={() => setTimeOfDay(time)}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Group Size Selector */}
          <div>
            <label className="text-light fs-7 text-uppercase fw-bold tracking-wider mb-2 d-block">
              3. Group / Squad Size
            </label>
            <div className="d-flex flex-wrap gap-2">
              {Object.keys(groupMultipliers).map((group) => (
                <button
                  key={group}
                  type="button"
                  className={`estimator-pill-btn ${groupSize === group ? 'active' : ''}`}
                  onClick={() => setGroupSize(group)}
                >
                  {group}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Recommendation & Price Display */}
        <div className="col-lg-5">
          <div className="estimator-result-box text-start">
            <div className="d-flex align-items-center justify-content-between mb-3 border-bottom border-white border-opacity-10 pb-3">
              <div>
                <span className="text-muted small d-block">Est. Starting Rate</span>
                <span className="fs-2 fw-extrabold text-emerald">₹{estimatedPrice}</span>
                <span className="text-light opacity-75 small"> / hour</span>
              </div>
              <div className="bg-emerald bg-opacity-25 text-emerald p-3 rounded-circle fs-3 d-flex align-items-center justify-content-center">
                <i className={`bi ${currentData.icon}`}></i>
              </div>
            </div>

            <h6 className="fw-bold text-white mb-2 fs-7 text-uppercase tracking-wider">
              Included Amenities & Perks:
            </h6>
            <ul className="list-unstyled mb-4">
              {currentData.features.map((feat, idx) => (
                <li key={idx} className="small text-light opacity-90 mb-1.5 d-flex align-items-center gap-2">
                  <i className="bi bi-check-circle-fill text-emerald"></i> {feat}
                </li>
              ))}
            </ul>

            <button
              type="button"
              className="btn btn-qc-emerald w-100 fw-bold py-2.5 shadow-lg d-flex align-items-center justify-content-center gap-2"
              onClick={handleSearch}
            >
              <i className="bi bi-search"></i> Book {selectedSport} Courts Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlotEstimatorWidget;

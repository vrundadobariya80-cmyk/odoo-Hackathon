import React from 'react';

const SportCard = ({ title, icon, count, onClick }) => {
  return (
    <div className="category-card h-100 d-flex flex-column justify-content-between" onClick={onClick}>
      <div>
        <div className="category-icon">
          <i className={`bi ${icon}`}></i>
        </div>
        <h6 className="fw-bold mb-1 text-dark fs-6">{title}</h6>
      </div>
      <div>
        <span className="sport-count-badge">
          <i className="bi bi-geo-fill me-1 text-emerald"></i>
          {count || 'Available'}
        </span>
      </div>
    </div>
  );
};

export default SportCard;

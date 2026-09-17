import React from 'react';

const SportCard = ({ title, icon, onClick }) => {
  return (
    <div className="category-card" onClick={onClick}>
      <div className="category-icon">
        <i className={`bi ${icon}`}></i>
      </div>
      <h6 className="fw-bold mb-0 text-dark">{title}</h6>
    </div>
  );
};

export default SportCard;

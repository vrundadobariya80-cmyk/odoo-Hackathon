import React from 'react';

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <div className="spinner-border text-success mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="text-muted fw-semibold">{message}</p>
    </div>
  );
};

export default LoadingSpinner;

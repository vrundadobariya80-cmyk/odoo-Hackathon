import React from 'react';

const ToastMessage = ({ type = "danger", message, onClose }) => {
  if (!message) return null;

  const bgClass = type === 'success' ? 'alert-success' : type === 'info' ? 'alert-info' : 'alert-danger';
  const icon = type === 'success' ? 'bi-check-circle-fill' : type === 'info' ? 'bi-info-circle-fill' : 'bi-exclamation-triangle-fill';

  return (
    <div className={`alert ${bgClass} alert-dismissible fade show d-flex align-items-center shadow-sm my-3`} role="alert">
      <i className={`bi ${icon} me-2 fs-5`}></i>
      <div className="flex-grow-1">{message}</div>
      {onClose && (
        <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
      )}
    </div>
  );
};

export default ToastMessage;

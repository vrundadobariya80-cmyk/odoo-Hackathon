import React from 'react';

const CourtCard = ({ court, isSelected, onSelect, showManageButtons, onEdit, onDelete, onToggleStatus }) => {
  const { id, name, sport_type, price_per_hour, opening_time, closing_time, is_active } = court;

  return (
    <div className={`qc-card p-3 h-100 ${isSelected ? 'border-success shadow' : ''}`}>
      <div className="d-flex justify-content-between align-items-start mb-2">
        <div>
          <h6 className="fw-bold mb-0">{name}</h6>
          <span className="badge bg-light text-dark border mt-1">{sport_type}</span>
        </div>
        <span className="fs-5 fw-bold text-success">₹{price_per_hour}<small className="fs-6 text-muted">/hr</small></span>
      </div>

      <div className="text-muted small mb-3">
        <i className="bi bi-clock me-1 text-primary"></i> Operating Hours: {opening_time} - {closing_time}
      </div>

      {showManageButtons ? (
        <div className="d-flex align-items-center justify-content-between pt-2 border-top">
          <button
            className={`btn btn-sm ${is_active ? 'btn-outline-danger' : 'btn-outline-success'}`}
            onClick={() => onToggleStatus(court)}
          >
            {is_active ? 'Deactivate' : 'Activate'}
          </button>
          <div className="d-flex gap-1">
            <button className="btn btn-sm btn-outline-primary" onClick={() => onEdit(court)}>
              <i className="bi bi-pencil"></i> Edit
            </button>
            <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(id)}>
              <i className="bi bi-trash"></i>
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className={`btn w-100 mt-2 ${isSelected ? 'btn-success' : 'btn-outline-success'}`}
          onClick={() => onSelect(court)}
        >
          {isSelected ? <><i className="bi bi-check-circle-fill me-1"></i> Selected Court</> : 'Select Court'}
        </button>
      )}
    </div>
  );
};

export default CourtCard;

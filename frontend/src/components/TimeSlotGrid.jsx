import React from 'react';

const TimeSlotGrid = ({ slots, selectedSlot, onSelectSlot }) => {
  if (!slots || slots.length === 0) {
    return (
      <div className="text-center p-4 bg-light rounded-3">
        <i className="bi bi-clock-history fs-3 text-muted"></i>
        <p className="text-muted small mt-2 mb-0">No operating slots available for this date.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex align-items-center gap-3 mb-3 small fw-semibold text-muted">
        <div className="d-flex align-items-center gap-1">
          <span className="d-inline-block rounded-circle bg-white border border-2 border-success p-1" style={{ width: 12, height: 12 }}></span>
          Available
        </div>
        <div className="d-flex align-items-center gap-1">
          <span className="d-inline-block rounded-circle bg-success p-1" style={{ width: 12, height: 12 }}></span>
          Selected
        </div>
        <div className="d-flex align-items-center gap-1">
          <span className="d-inline-block rounded-circle bg-secondary opacity-50 p-1" style={{ width: 12, height: 12 }}></span>
          Booked / Blocked
        </div>
      </div>

      <div className="row g-2">
        {slots.map((s, idx) => {
          const isSelected = selectedSlot && selectedSlot.start_time === s.start_time;
          return (
            <div key={idx} className="col-6 col-sm-4 col-md-3">
              <button
                type="button"
                className={`slot-btn ${isSelected ? 'selected' : ''} ${!s.is_available ? 'unavailable' : ''}`}
                disabled={!s.is_available}
                onClick={() => s.is_available && onSelectSlot(s)}
                title={!s.is_available ? s.reason : 'Click to select slot'}
              >
                {s.slot_label}
                {!s.is_available && (
                  <span className="d-block text-danger opacity-75" style={{ fontSize: '0.65rem' }}>
                    {s.status}
                  </span>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TimeSlotGrid;

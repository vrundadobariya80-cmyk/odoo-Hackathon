import React from 'react';

const BookingCard = ({ booking, onCancel, onReview }) => {
  const {
    id, facility_name, location, facility_image, court_name, sport_type,
    booking_date, start_time, end_time, total_price, status, payment_status,
    can_cancel, review_id
  } = booking;

  const statusClass = status === 'Confirmed' ? 'confirmed' : status === 'Cancelled' ? 'cancelled' : 'pending';

  return (
    <div className="qc-card p-3 mb-3">
      <div className="row g-3 align-items-center">
        <div className="col-md-3">
          <img
            src={facility_image || 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800'}
            alt={facility_name}
            className="img-fluid rounded-3"
            style={{ height: '110px', width: '100%', objectFit: 'cover' }}
          />
        </div>

        <div className="col-md-6">
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge bg-dark">ID: #{id}</span>
            <span className={`status-badge ${statusClass}`}>{status}</span>
            <span className="badge bg-light text-dark border">{payment_status}</span>
          </div>

          <h5 className="fw-bold mb-1 text-dark">{facility_name}</h5>
          <p className="text-muted small mb-2"><i className="bi bi-geo-alt text-danger me-1"></i> {location}</p>

          <div className="d-flex flex-wrap gap-3 small fw-semibold text-secondary">
            <span><i className="bi bi-trophy text-warning me-1"></i> {sport_type}</span>
            <span><i className="bi bi-grid-3x3-gap text-info me-1"></i> {court_name}</span>
            <span><i className="bi bi-calendar3 text-primary me-1"></i> {booking_date}</span>
            <span><i className="bi bi-clock text-success me-1"></i> {start_time} - {end_time}</span>
          </div>
        </div>

        <div className="col-md-3 text-md-end d-flex flex-column justify-content-between h-100">
          <div>
            <span className="text-muted small d-block">Total Paid</span>
            <span className="fs-4 fw-bold text-success">₹{total_price}</span>
          </div>

          <div className="mt-3 d-flex flex-column gap-2 align-items-md-end">
            {can_cancel && (
              <button className="btn btn-outline-danger btn-sm rounded-pill px-3" onClick={() => onCancel(id)}>
                <i className="bi bi-x-circle me-1"></i> Cancel Booking
              </button>
            )}

            {status === 'Confirmed' && !review_id && onReview && (
              <button className="btn btn-outline-warning btn-sm rounded-pill px-3 text-dark fw-semibold" onClick={() => onReview(booking)}>
                <i className="bi bi-star me-1"></i> Write Review
              </button>
            )}

            {review_id && (
              <span className="badge bg-success-subtle text-success small">
                <i className="bi bi-check-all me-1"></i> Reviewed
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;

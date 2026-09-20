import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';

const BookingSuccess = () => {
  const location = useLocation();
  const booking = location.state?.booking;

  if (!booking) {
    return <Navigate to="/my-bookings" replace />;
  }

  const isCash = (booking.payment_method || '').toLowerCase().includes('cash') || (booking.payment_status || '').toLowerCase().includes('venue');

  return (
    <div className="container py-5 my-auto">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="qc-card p-4 p-md-5 text-center">
            <div className="mb-4">
              <div
                className={`text-white rounded-circle d-inline-flex align-items-center justify-content-center shadow-lg ${isCash ? 'bg-warning' : 'bg-success'}`}
                style={{ width: '80px', height: '80px' }}
              >
                <i className="bi bi-check-lg display-4"></i>
              </div>
            </div>

            <h2 className="fw-extrabold text-dark mb-1">
              {isCash ? 'Court Reserved! (Pay at Venue)' : 'Booking Confirmed!'}
            </h2>
            <p className="text-muted small mb-4">
              {isCash
                ? `Your time slot is locked! Please pay ₹${booking.total_price} in cash directly at the venue upon arrival.`
                : 'Your court time slot has been successfully locked and online payment recorded.'}
            </p>

            <div className="p-4 bg-light rounded-4 text-start mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                <span className="text-muted small">Booking Reference ID</span>
                <span className="badge bg-dark fs-6">#{booking.id}</span>
              </div>

              <div className="row g-3 small">
                <div className="col-6">
                  <span className="text-muted d-block">Facility</span>
                  <strong className="text-dark">{booking.facility_name}</strong>
                </div>
                <div className="col-6">
                  <span className="text-muted d-block">Court</span>
                  <strong className="text-dark">{booking.court_name}</strong>
                </div>
                <div className="col-6">
                  <span className="text-muted d-block">Sport</span>
                  <strong className="text-dark">{booking.sport_type}</strong>
                </div>
                <div className="col-6">
                  <span className="text-muted d-block">Date & Time</span>
                  <strong className="text-success">{booking.booking_date} ({booking.start_time} - {booking.end_time})</strong>
                </div>
                <div className="col-6">
                  <span className="text-muted d-block">{isCash ? 'Payable at Venue' : 'Total Paid'}</span>
                  <strong className={`fs-5 ${isCash ? 'text-warning-emphasis' : 'text-success'}`}>₹{booking.total_price}</strong>
                </div>
                <div className="col-6">
                  <span className="text-muted d-block">Payment Method</span>
                  {isCash ? (
                    <span className="badge bg-warning text-dark border border-warning"><i className="bi bi-cash-stack me-1"></i>Pay at Venue</span>
                  ) : (
                    <span className="badge bg-success"><i className="bi bi-check-circle-fill me-1"></i>{booking.payment_method || 'Paid Online'}</span>
                  )}
                </div>
                {booking.owner_name && (
                  <div className="col-12 mt-2 pt-2 border-top">
                    <span className="text-muted d-block">Venue Manager & Owner Contact:</span>
                    <strong className="text-dark"><i className="bi bi-person-fill text-primary me-1"></i>{booking.owner_name}</strong>
                    <span className="text-muted ms-2">({booking.owner_email})</span>
                  </div>
                )}
              </div>
            </div>

            <div className="d-flex flex-column flex-sm-row gap-3">
              <Link to="/my-bookings" className="btn btn-qc-emerald btn-lg flex-grow-1">
                <i className="bi bi-calendar-check me-2"></i> View My Bookings
              </Link>
              <Link to="/venues" className="btn btn-qc-outline btn-lg flex-grow-1">
                Book Another Court
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;

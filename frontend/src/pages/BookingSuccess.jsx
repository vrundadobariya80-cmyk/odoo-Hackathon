import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';

const BookingSuccess = () => {
  const location = useLocation();
  const booking = location.state?.booking;

  if (!booking) {
    return <Navigate to="/my-bookings" replace />;
  }

  return (
    <div className="container py-5 my-auto">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="qc-card p-4 p-md-5 text-center">
            <div className="mb-4">
              <div
                className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center shadow-lg"
                style={{ width: '80px', height: '80px' }}
              >
                <i className="bi bi-check-lg display-4"></i>
              </div>
            </div>

            <h2 className="fw-extrabold text-dark mb-1">Booking Confirmed!</h2>
            <p className="text-muted small mb-4">
              Your court time slot has been successfully locked and payment recorded.
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
                  <span className="text-muted d-block">Total Paid</span>
                  <strong className="fs-5 text-success">₹{booking.total_price}</strong>
                </div>
                <div className="col-6">
                  <span className="text-muted d-block">Payment Status</span>
                  <span className="badge bg-success">{booking.payment_status}</span>
                </div>
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

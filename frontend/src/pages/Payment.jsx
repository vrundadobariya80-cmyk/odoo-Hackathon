import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { createBooking } from '../services/api';
import ToastMessage from '../components/ToastMessage';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingState = location.state;

  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [upiId, setUpiId] = useState('user@upi');
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!bookingState || !bookingState.court || !bookingState.facility || !bookingState.slot) {
    return (
      <div className="container py-5 text-center">
        <h3>Invalid Booking Session</h3>
        <p className="text-muted">Please select a court and time slot first.</p>
        <Link to="/venues" className="btn btn-qc-emerald mt-2">Browse Venues</Link>
      </div>
    );
  }

  const { facility, court, bookingDate, slot } = bookingState;

  const handleConfirmPayment = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        facility_id: facility.id,
        court_id: court.id,
        booking_date: bookingDate,
        start_time: slot.start_time,
        end_time: slot.end_time,
        payment_method: paymentMethod
      };

      const res = await createBooking(payload);
      const confirmedBooking = res.data.booking;

      navigate('/booking-success', { state: { booking: confirmedBooking } });
    } catch (err) {
      setError(err.response?.data?.error || 'Payment processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <h2 className="fw-bold mb-4 text-center">Simulated Payment Checkout</h2>

            <ToastMessage type="danger" message={error} onClose={() => setError('')} />

            <div className="qc-card p-4 p-md-5 mb-4">
              <div className="alert alert-info d-flex align-items-center mb-4">
                <i className="bi bi-info-circle-fill me-2 fs-4"></i>
                <div>
                  <strong>Demo Mode Active:</strong> No real payment gateway or credit card will be charged. Clicking "Pay & Confirm" will simulate a successful transaction.
                </div>
              </div>

              <h5 className="fw-bold mb-3">Booking Order Details</h5>
              <div className="p-3 bg-light rounded-3 mb-4">
                <div className="row g-3 small">
                  <div className="col-6 col-md-3">
                    <span className="text-muted d-block">Facility</span>
                    <strong className="text-dark">{facility.name}</strong>
                  </div>
                  <div className="col-6 col-md-3">
                    <span className="text-muted d-block">Court & Sport</span>
                    <strong className="text-dark">{court.name} ({court.sport_type})</strong>
                  </div>
                  <div className="col-6 col-md-3">
                    <span className="text-muted d-block">Date</span>
                    <strong className="text-dark">{bookingDate}</strong>
                  </div>
                  <div className="col-6 col-md-3">
                    <span className="text-muted d-block">Time Slot</span>
                    <strong className="text-success">{slot.slot_label}</strong>
                  </div>
                </div>
              </div>

              <h5 className="fw-bold mb-3">Select Payment Method</h5>

              <div className="row g-3 mb-4">
                <div className="col-md-4">
                  <div
                    className={`p-3 border rounded-3 cursor-pointer text-center ${paymentMethod === 'UPI' ? 'border-success bg-success-subtle' : ''}`}
                    onClick={() => setPaymentMethod('UPI')}
                    style={{ cursor: 'pointer' }}
                  >
                    <i className="bi bi-qr-code fs-3 text-success d-block mb-1"></i>
                    <strong className="d-block text-dark">UPI Instant</strong>
                    <span className="text-muted fs-7">Google Pay / PhonePe / Paytm</span>
                  </div>
                </div>

                <div className="col-md-4">
                  <div
                    className={`p-3 border rounded-3 cursor-pointer text-center ${paymentMethod === 'Card' ? 'border-success bg-success-subtle' : ''}`}
                    onClick={() => setPaymentMethod('Card')}
                    style={{ cursor: 'pointer' }}
                  >
                    <i className="bi bi-credit-card fs-3 text-primary d-block mb-1"></i>
                    <strong className="d-block text-dark">Credit / Debit Card</strong>
                    <span className="text-muted fs-7">Visa / MasterCard / RuPay</span>
                  </div>
                </div>

                <div className="col-md-4">
                  <div
                    className={`p-3 border rounded-3 cursor-pointer text-center ${paymentMethod === 'Cash' ? 'border-success bg-success-subtle' : ''}`}
                    onClick={() => setPaymentMethod('Cash')}
                    style={{ cursor: 'pointer' }}
                  >
                    <i className="bi bi-cash-stack fs-3 text-warning d-block mb-1"></i>
                    <strong className="d-block text-dark">Pay at Venue</strong>
                    <span className="text-muted fs-7">Cash or Pay on Arrival</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleConfirmPayment}>
                {paymentMethod === 'UPI' && (
                  <div className="mb-4 p-3 bg-light rounded-3">
                    <label className="form-label fw-semibold small text-muted">Demo Virtual Payment Address (VPA)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                    />
                  </div>
                )}

                {paymentMethod === 'Card' && (
                  <div className="mb-4 p-3 bg-light rounded-3">
                    <div className="mb-3">
                      <label className="form-label fw-semibold small text-muted">Demo Card Number</label>
                      <input
                        type="text"
                        className="form-control"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                      />
                    </div>
                    <div className="row g-2">
                      <div className="col-6">
                        <label className="form-label fw-semibold small text-muted">Expiry</label>
                        <input type="text" className="form-control" defaultValue="12/28" />
                      </div>
                      <div className="col-6">
                        <label className="form-label fw-semibold small text-muted">CVV</label>
                        <input type="password" className="form-control" defaultValue="123" />
                      </div>
                    </div>
                  </div>
                )}

                <div className={`d-flex align-items-center justify-content-between p-3 bg-white border border-2 rounded-3 mb-4 ${paymentMethod === 'Cash' ? 'border-warning' : 'border-success'}`}>
                  <div>
                    <span className="text-muted small d-block">
                      {paymentMethod === 'Cash' ? 'Amount Payable at Venue' : 'Total Payable Amount'}
                    </span>
                    <span className={`fs-3 fw-extrabold ${paymentMethod === 'Cash' ? 'text-warning-emphasis' : 'text-success'}`}>
                      ₹{court.price_per_hour}
                    </span>
                  </div>
                  {paymentMethod === 'Cash' ? (
                    <span className="badge bg-warning text-dark px-3 py-2 fw-bold fs-6">
                      <i className="bi bi-cash-stack me-1"></i> Pay at Venue (Cash)
                    </span>
                  ) : paymentMethod === 'Card' ? (
                    <span className="badge bg-primary text-white px-3 py-2 fw-bold fs-6">
                      <i className="bi bi-credit-card-fill me-1"></i> Credit / Debit Card
                    </span>
                  ) : (
                    <span className="badge bg-success text-white px-3 py-2 fw-bold fs-6">
                      <i className="bi bi-qr-code me-1"></i> UPI Instant
                    </span>
                  )}
                </div>

                <button type="submit" className={`btn w-100 btn-lg shadow-sm ${paymentMethod === 'Cash' ? 'btn-warning text-dark fw-bold' : 'btn-qc-emerald'}`} disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Confirming Reservation...
                    </>
                  ) : paymentMethod === 'Cash' ? (
                    <>
                      <i className="bi bi-geo-alt-fill me-2"></i> Confirm Booking (Pay ₹{court.price_per_hour} at Venue)
                    </>
                  ) : (
                    <>
                      <i className="bi bi-lock-fill me-2"></i> Pay & Confirm Booking (₹{court.price_per_hour})
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;

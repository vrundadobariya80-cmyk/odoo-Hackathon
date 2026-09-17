import React, { useState, useEffect } from 'react';
import { fetchUserBookings, cancelBooking, submitReview } from '../services/api';
import BookingCard from '../components/BookingCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ToastMessage from '../components/ToastMessage';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [message, setMessage] = useState(null);

  // Review modal state
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const loadBookings = async () => {
    try {
      const res = await fetchUserBookings();
      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error("Failed to load bookings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking? The slot will be released.")) {
      return;
    }
    try {
      const res = await cancelBooking(bookingId);
      setMessage({ type: 'success', text: res.data.message || 'Booking cancelled.' });
      loadBookings();
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.error || 'Failed to cancel booking.' });
    }
  };

  const handleOpenReviewModal = (b) => {
    setSelectedBookingForReview(b);
    setRating(5);
    setComment('');
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!selectedBookingForReview) return;
    setReviewSubmitting(true);
    try {
      const res = await submitReview({
        booking_id: selectedBookingForReview.id,
        rating,
        comment
      });
      setMessage({ type: 'success', text: res.data.message || 'Review submitted!' });
      setSelectedBookingForReview(null);
      loadBookings();
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.error || 'Failed to submit review.' });
    } finally {
      setReviewSubmitting(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filterStatus === 'All') return true;
    return b.status === filterStatus;
  });

  return (
    <div className="py-5">
      <div className="container">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <h2 className="fw-bold mb-1">My Sports Bookings</h2>
            <p className="text-muted small mb-0">View, manage, or cancel your venue court reservations</p>
          </div>

          <div className="btn-group">
            {['All', 'Confirmed', 'Cancelled'].map((st) => (
              <button
                key={st}
                type="button"
                className={`btn btn-sm ${filterStatus === st ? 'btn-success' : 'btn-outline-secondary'}`}
                onClick={() => setFilterStatus(st)}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {message && (
          <ToastMessage type={message.type} message={message.text} onClose={() => setMessage(null)} />
        )}

        {loading ? (
          <LoadingSpinner message="Fetching your booking history..." />
        ) : filteredBookings.length === 0 ? (
          <div className="qc-card p-5 text-center">
            <i className="bi bi-calendar-x fs-1 text-muted mb-3 d-block"></i>
            <h5 className="fw-bold">No Bookings Found</h5>
            <p className="text-muted small">You haven't made any court reservations matching this filter yet.</p>
          </div>
        ) : (
          filteredBookings.map((b) => (
            <BookingCard
              key={b.id}
              booking={b}
              onCancel={handleCancel}
              onReview={handleOpenReviewModal}
            />
          ))
        )}

        {/* Review Modal */}
        {selectedBookingForReview && (
          <div className="modal show d-block tab-index-n1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg rounded-4">
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title fw-bold">Review Facility</h5>
                  <button type="button" className="btn-close" onClick={() => setSelectedBookingForReview(null)}></button>
                </div>
                <form onSubmit={handleSubmitReview}>
                  <div className="modal-body py-3">
                    <p className="small text-muted mb-3">
                      Share your feedback for <strong>{selectedBookingForReview.facility_name}</strong> ({selectedBookingForReview.court_name})
                    </p>

                    <div className="mb-3">
                      <label className="form-label fw-semibold small">Rating (1 to 5 Stars)</label>
                      <div className="d-flex gap-2 text-warning fs-3 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <i
                            key={star}
                            className={`bi bi-star${star <= rating ? '-fill' : ''} cursor-pointer`}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setRating(star)}
                          ></i>
                        ))}
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold small">Your Review Comment</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Tell us about court condition, lighting, parking..."
                        required
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                  <div className="modal-footer border-0 pt-0">
                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setSelectedBookingForReview(null)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-qc-emerald btn-sm" disabled={reviewSubmitting}>
                      {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;

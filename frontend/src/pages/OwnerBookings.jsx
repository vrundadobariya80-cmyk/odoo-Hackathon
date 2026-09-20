import React, { useState, useEffect } from 'react';
import { fetchOwnerBookings, fetchOwnerCourts, blockSlot } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ToastMessage from '../components/ToastMessage';

const OwnerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [courtFilter, setCourtFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');

  // Selected Booking Modal
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Block slot modal state
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockCourtId, setBlockCourtId] = useState('');
  const [blockDate, setBlockDate] = useState(new Date().toISOString().split('T')[0]);
  const [blockStartTime, setBlockStartTime] = useState('14:00');
  const [blockEndTime, setBlockEndTime] = useState('15:00');
  const [blockReason, setBlockReason] = useState('Routine Turf Maintenance');
  const [blockSubmitting, setBlockSubmitting] = useState(false);

  const loadData = async () => {
    try {
      const bRes = await fetchOwnerBookings();
      setBookings(bRes.data.bookings || []);

      const cRes = await fetchOwnerCourts();
      const cList = cRes.data.courts || [];
      setCourts(cList);
      if (cList.length > 0) setBlockCourtId(cList[0].id);
    } catch (err) {
      console.error("Error loading owner bookings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleBlockSlotSubmit = async (e) => {
    e.preventDefault();
    if (!blockCourtId) return;

    setBlockSubmitting(true);
    try {
      const res = await blockSlot({
        court_id: blockCourtId,
        booking_date: blockDate,
        start_time: blockStartTime,
        end_time: blockEndTime,
        reason: blockReason
      });
      setMessage({ type: 'success', text: res.data.message || 'Time slot blocked!' });
      setShowBlockModal(false);
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.error || 'Failed to block slot.' });
    } finally {
      setBlockSubmitting(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter !== 'All' && b.status !== statusFilter) return false;
    if (courtFilter !== 'All' && Number(b.court_id) !== Number(courtFilter)) return false;
    if (paymentFilter !== 'All') {
      const method = (b.payment_method || '').toLowerCase();
      const status = (b.payment_status || '').toLowerCase();
      if (paymentFilter === 'Cash' && (!method.includes('cash') && !status.includes('venue'))) return false;
      if (paymentFilter === 'Online' && (method.includes('cash') || status.includes('venue'))) return false;
    }
    return true;
  });

  const getPaymentBadge = (booking) => {
    const method = booking.payment_method || 'UPI Instant';
    const status = booking.payment_status || 'Paid (Online)';
    const isCash = method.toLowerCase().includes('cash') || status.toLowerCase().includes('venue');
    const isCard = method.toLowerCase().includes('card');

    if (isCash) {
      return (
        <div>
          <span className="badge bg-warning-subtle text-dark border border-warning px-2 py-1 me-1">
            <i className="bi bi-cash-stack me-1 text-warning"></i> Pay at Venue (Cash)
          </span>
          <span className="badge bg-secondary-subtle text-muted fs-7">Collect at Court</span>
        </div>
      );
    }

    if (isCard) {
      return (
        <div>
          <span className="badge bg-primary-subtle text-primary border border-primary px-2 py-1 me-1">
            <i className="bi bi-credit-card-fill me-1"></i> Credit / Debit Card
          </span>
          <span className="badge bg-success-subtle text-success fs-7"><i className="bi bi-check-circle-fill me-1"></i>Paid Online</span>
        </div>
      );
    }

    return (
      <div>
        <span className="badge bg-success-subtle text-success border border-success px-2 py-1 me-1">
          <i className="bi bi-qr-code me-1"></i> UPI Instant
        </span>
        <span className="badge bg-success-subtle text-success fs-7"><i className="bi bi-check-circle-fill me-1"></i>Paid Online</span>
      </div>
    );
  };

  return (
    <div className="py-5">
      <div className="container">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <h2 className="fw-bold mb-1 text-dark">Facility Bookings & Payment Tracker</h2>
            <p className="text-muted small mb-0">Track incoming customer reservations, check payment methods (Online vs Cash at venue), or block slots.</p>
          </div>

          <button className="btn btn-warning fw-bold text-dark shadow-sm" onClick={() => setShowBlockModal(true)}>
            <i className="bi bi-slash-circle me-1"></i> Block Court Time Slot
          </button>
        </div>

        {message && (
          <ToastMessage type={message.type} message={message.text} onClose={() => setMessage(null)} />
        )}

        {/* Filter Controls */}
        <div className="qc-card p-4 mb-4 border-0 shadow-sm">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label small fw-bold text-muted">Filter by Status</label>
              <select className="form-select form-select-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="All">All Statuses</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-bold text-muted">Filter by Court</label>
              <select className="form-select form-select-sm" value={courtFilter} onChange={(e) => setCourtFilter(e.target.value)}>
                <option value="All">All Courts ({courts.length})</option>
                {courts.map((c) => (
                  <option key={c.id} value={c.id}>{c.facility_name} - {c.name}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-bold text-muted">Filter by Payment Mode</label>
              <select className="form-select form-select-sm" value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)}>
                <option value="All">All Payment Modes</option>
                <option value="Online">Online Payments (UPI / Card)</option>
                <option value="Cash">Pay at Venue (Cash)</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner message="Fetching facility reservations..." />
        ) : filteredBookings.length === 0 ? (
          <div className="qc-card p-5 text-center border-0 shadow-sm">
            <i className="bi bi-calendar-event fs-1 text-muted mb-3 d-block"></i>
            <h5 className="fw-bold">No Reservations Found</h5>
            <p className="text-muted small">No customer bookings match the selected filters.</p>
          </div>
        ) : (
          <div className="qc-card overflow-hidden border-0 shadow-sm">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-dark" style={{ background: '#0b132b' }}>
                  <tr>
                    <th>Booking ID</th>
                    <th>Customer Name & Email</th>
                    <th>Facility & Court</th>
                    <th>Sport</th>
                    <th>Date & Time</th>
                    <th>Payment Method & Status</th>
                    <th>Amount</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((b) => (
                    <tr key={b.id}>
                      <td className="fw-bold">#{b.id}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className="avatar-placeholder rounded-circle bg-light border text-primary fw-bold px-2 py-1 small">
                            {b.user_name ? b.user_name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <div className="fw-bold text-dark">{b.user_name}</div>
                            <div className="text-muted fs-7">{b.user_email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="fw-bold">{b.facility_name}</div>
                        <div className="text-muted small">{b.court_name}</div>
                      </td>
                      <td><span className="badge bg-light text-dark border">{b.sport_type}</span></td>
                      <td>
                        <div><i className="bi bi-calendar3 me-1 text-primary"></i>{b.booking_date}</div>
                        <div className="small text-success fw-semibold"><i className="bi bi-clock me-1"></i>{b.start_time} - {b.end_time}</div>
                      </td>
                      <td>
                        {getPaymentBadge(b)}
                      </td>
                      <td className="fw-bold text-success fs-6">₹{b.total_price}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary fw-semibold rounded-pill px-3"
                          onClick={() => setSelectedBooking(b)}
                        >
                          <i className="bi bi-eye-fill me-1"></i> Info
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* BOOKING DETAILS INSPECTION MODAL */}
        {selectedBooking && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(11, 19, 43, 0.75)', backdropFilter: 'blur(4px)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                <div className="modal-header text-white border-0" style={{ background: '#0b132b' }}>
                  <h5 className="modal-title fw-bold text-white d-flex align-items-center gap-2">
                    <i className="bi bi-receipt-cutoff text-emerald"></i> Reservation Details #{selectedBooking.id}
                  </h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedBooking(null)}></button>
                </div>
                <div className="modal-body p-4 bg-light">
                  {/* Customer Info Card */}
                  <div className="p-3 bg-white rounded-3 border mb-3">
                    <h6 className="fw-bold text-dark mb-2"><i className="bi bi-person-fill text-primary me-1"></i> Customer Contact</h6>
                    <div className="row g-2 small">
                      <div className="col-6">
                        <span className="text-muted d-block">Name:</span>
                        <strong className="text-dark fs-6">{selectedBooking.user_name}</strong>
                      </div>
                      <div className="col-6">
                        <span className="text-muted d-block">Email:</span>
                        <strong className="text-dark">{selectedBooking.user_email}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Booking Court Info */}
                  <div className="p-3 bg-white rounded-3 border mb-3">
                    <h6 className="fw-bold text-dark mb-2"><i className="bi bi-geo-alt-fill text-danger me-1"></i> Venue & Slot</h6>
                    <div className="row g-2 small">
                      <div className="col-6">
                        <span className="text-muted d-block">Facility:</span>
                        <strong>{selectedBooking.facility_name}</strong>
                      </div>
                      <div className="col-6">
                        <span className="text-muted d-block">Court & Sport:</span>
                        <strong>{selectedBooking.court_name} ({selectedBooking.sport_type})</strong>
                      </div>
                      <div className="col-6 mt-2">
                        <span className="text-muted d-block">Date:</span>
                        <strong>{selectedBooking.booking_date}</strong>
                      </div>
                      <div className="col-6 mt-2">
                        <span className="text-muted d-block">Time Slot:</span>
                        <strong className="text-success">{selectedBooking.start_time} - {selectedBooking.end_time}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Payment Info Box */}
                  <div className="p-3 bg-white rounded-3 border">
                    <h6 className="fw-bold text-dark mb-2"><i className="bi bi-credit-card-2-front-fill text-success me-1"></i> Payment Summary</h6>
                    <div className="row g-2 small align-items-center">
                      <div className="col-6">
                        <span className="text-muted d-block">Payment Method:</span>
                        <strong className="text-dark">{selectedBooking.payment_method || 'UPI Instant'}</strong>
                      </div>
                      <div className="col-6">
                        <span className="text-muted d-block">Payment Status:</span>
                        <div>{getPaymentBadge(selectedBooking)}</div>
                      </div>
                      <div className="col-12 mt-2 pt-2 border-top d-flex justify-content-between align-items-center">
                        <span className="fw-semibold text-muted">Total Hourly Fee:</span>
                        <span className="fs-4 fw-extrabold text-success">₹{selectedBooking.total_price}</span>
                      </div>
                    </div>
                  </div>

                  {(selectedBooking.payment_method || '').toLowerCase().includes('cash') && (
                    <div className="alert alert-warning mt-3 mb-0 small d-flex align-items-center gap-2">
                      <i className="bi bi-exclamation-triangle-fill fs-5"></i>
                      <div>
                        <strong>Action for Owner:</strong> Collect <strong>₹{selectedBooking.total_price}</strong> in cash directly from customer at venue upon arrival.
                      </div>
                    </div>
                  )}
                </div>
                <div className="modal-footer border-0 bg-white">
                  <button type="button" className="btn btn-secondary btn-sm px-4 rounded-pill" onClick={() => setSelectedBooking(null)}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Block Slot Modal */}
        {showBlockModal && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg rounded-4">
                <div className="modal-header border-0">
                  <h5 className="modal-title fw-bold text-dark">
                    <i className="bi bi-slash-circle text-danger me-2"></i> Block Court Slot
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setShowBlockModal(false)}></button>
                </div>
                <form onSubmit={handleBlockSlotSubmit}>
                  <div className="modal-body py-2">
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Select Court</label>
                      <select
                        className="form-select"
                        required
                        value={blockCourtId}
                        onChange={(e) => setBlockCourtId(e.target.value)}
                      >
                        {courts.map((c) => (
                          <option key={c.id} value={c.id}>{c.facility_name} - {c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Date</label>
                      <input
                        type="date"
                        className="form-control"
                        required
                        value={blockDate}
                        onChange={(e) => setBlockDate(e.target.value)}
                      />
                    </div>

                    <div className="row g-2 mb-3">
                      <div className="col-6">
                        <label className="form-label small fw-semibold">Start Time (e.g. 14:00)</label>
                        <input
                          type="text"
                          className="form-control"
                          required
                          value={blockStartTime}
                          onChange={(e) => setBlockStartTime(e.target.value)}
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label small fw-semibold">End Time (e.g. 15:00)</label>
                        <input
                          type="text"
                          className="form-control"
                          required
                          value={blockEndTime}
                          onChange={(e) => setBlockEndTime(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Reason for Blocking</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Maintenance, Private Tournament..."
                        required
                        value={blockReason}
                        onChange={(e) => setBlockReason(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="modal-footer border-0">
                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setShowBlockModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-warning btn-sm fw-bold" disabled={blockSubmitting}>
                      {blockSubmitting ? 'Blocking...' : 'Block Slot Now'}
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

export default OwnerBookings;


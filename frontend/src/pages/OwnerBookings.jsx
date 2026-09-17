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
    return true;
  });

  return (
    <div className="py-5">
      <div className="container">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <h2 className="fw-bold mb-1">Facility Bookings & Slot Control</h2>
            <p className="text-muted small mb-0">Track incoming customer reservations or block slots for maintenance</p>
          </div>

          <button className="btn btn-warning fw-bold text-dark" onClick={() => setShowBlockModal(true)}>
            <i className="bi bi-slash-circle me-1"></i> Block Court Time Slot
          </button>
        </div>

        {message && (
          <ToastMessage type={message.type} message={message.text} onClose={() => setMessage(null)} />
        )}

        {/* Filter Controls */}
        <div className="qc-card p-3 mb-4">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label small fw-bold text-muted">Filter by Status</label>
              <select className="form-select form-select-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="All">All Statuses</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-bold text-muted">Filter by Court</label>
              <select className="form-select form-select-sm" value={courtFilter} onChange={(e) => setCourtFilter(e.target.value)}>
                <option value="All">All Courts ({courts.length})</option>
                {courts.map((c) => (
                  <option key={c.id} value={c.id}>{c.facility_name} - {c.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner message="Fetching facility reservations..." />
        ) : filteredBookings.length === 0 ? (
          <div className="qc-card p-5 text-center">
            <i className="bi bi-calendar-event fs-1 text-muted mb-3 d-block"></i>
            <h5 className="fw-bold">No Reservations Found</h5>
            <p className="text-muted small">No customer bookings match the selected filters.</p>
          </div>
        ) : (
          <div className="qc-card overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>Booking ID</th>
                    <th>User</th>
                    <th>Facility & Court</th>
                    <th>Sport</th>
                    <th>Date & Time</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((b) => (
                    <tr key={b.id}>
                      <td className="fw-bold">#{b.id}</td>
                      <td>
                        <div className="fw-bold text-dark">{b.user_name}</div>
                        <div className="text-muted fs-7">{b.user_email}</div>
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
                      <td className="fw-bold text-success">₹{b.total_price}</td>
                      <td>
                        <span className={`status-badge ${b.status === 'Confirmed' ? 'confirmed' : 'cancelled'}`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

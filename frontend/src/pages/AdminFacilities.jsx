import React, { useState, useEffect } from 'react';
import { fetchPendingFacilities, approveFacility, rejectFacility } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ToastMessage from '../components/ToastMessage';

const AdminFacilities = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  // Reject modal state
  const [rejectingFacilityId, setRejectingFacilityId] = useState(null);
  const [rejectionComment, setRejectionComment] = useState('Facility details do not meet safety or description guidelines.');
  const [rejecting, setRejecting] = useState(false);

  const loadPending = async () => {
    try {
      const res = await fetchPendingFacilities();
      setFacilities(res.data.facilities || []);
    } catch (err) {
      console.error("Failed to load pending facilities", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPending();
  }, []);

  const handleApprove = async (id) => {
    try {
      const res = await approveFacility(id);
      setMessage({ type: 'success', text: res.data.message || 'Facility approved!' });
      loadPending();
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.error || 'Failed to approve facility.' });
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectingFacilityId) return;

    setRejecting(true);
    try {
      const res = await rejectFacility(rejectingFacilityId, { rejection_comment: rejectionComment });
      setMessage({ type: 'success', text: res.data.message || 'Facility rejected.' });
      setRejectingFacilityId(null);
      loadPending();
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.error || 'Failed to reject facility.' });
    } finally {
      setRejecting(false);
    }
  };

  return (
    <div className="py-5">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">Facility Approval Queue</h2>
            <p className="text-muted small mb-0">Review pending facility submissions from facility owners</p>
          </div>
          <span className="badge bg-warning text-dark fs-6 px-3 py-2">
            {facilities.length} Pending Approval
          </span>
        </div>

        {message && (
          <ToastMessage type={message.type} message={message.text} onClose={() => setMessage(null)} />
        )}

        {loading ? (
          <LoadingSpinner message="Fetching pending facility queue..." />
        ) : facilities.length === 0 ? (
          <div className="qc-card p-5 text-center">
            <i className="bi bi-check-circle-fill fs-1 text-success mb-3 d-block"></i>
            <h5 className="fw-bold">All Facilities Reviewed</h5>
            <p className="text-muted small">There are currently no pending facility approvals in the queue.</p>
          </div>
        ) : (
          <div className="row g-4">
            {facilities.map((f) => (
              <div key={f.id} className="col-lg-6">
                <div className="qc-card h-100 overflow-hidden">
                  <div className="row g-0">
                    <div className="col-md-5">
                      <img
                        src={f.image}
                        alt={f.name}
                        className="w-100 h-100"
                        style={{ objectFit: 'cover', minHeight: '220px' }}
                      />
                    </div>
                    <div className="col-md-7 p-4 d-flex flex-column justify-content-between">
                      <div>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h5 className="fw-bold mb-0">{f.name}</h5>
                          <span className="status-badge pending">Pending</span>
                        </div>

                        <p className="text-muted small mb-2"><i className="bi bi-geo-alt text-danger me-1"></i> {f.location}</p>
                        <p className="text-secondary small mb-2 line-clamp-2">{f.description}</p>

                        <div className="small text-muted mb-3">
                          <strong>Owner:</strong> {f.owner_name} ({f.owner_email})
                        </div>
                      </div>

                      <div className="d-flex gap-2 pt-2 border-top">
                        <button className="btn btn-success btn-sm w-50" onClick={() => handleApprove(f.id)}>
                          <i className="bi bi-check-lg me-1"></i> Approve
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm w-50"
                          onClick={() => setRejectingFacilityId(f.id)}
                        >
                          <i className="bi bi-x-lg me-1"></i> Reject
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Rejection Modal */}
        {rejectingFacilityId && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg rounded-4">
                <div className="modal-header border-0">
                  <h5 className="modal-title fw-bold text-danger">Reject Facility Submission</h5>
                  <button type="button" className="btn-close" onClick={() => setRejectingFacilityId(null)}></button>
                </div>
                <form onSubmit={handleRejectSubmit}>
                  <div className="modal-body py-2">
                    <label className="form-label small fw-semibold">Reason / Feedback Comment for Owner</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      required
                      value={rejectionComment}
                      onChange={(e) => setRejectionComment(e.target.value)}
                    ></textarea>
                  </div>
                  <div className="modal-footer border-0">
                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setRejectingFacilityId(null)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-danger btn-sm" disabled={rejecting}>
                      {rejecting ? 'Rejecting...' : 'Confirm Rejection'}
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

export default AdminFacilities;

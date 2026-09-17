import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchOwnerCourts, fetchOwnerFacilities, deleteCourt, updateCourt } from '../services/api';
import CourtCard from '../components/CourtCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ToastMessage from '../components/ToastMessage';

const OwnerCourts = () => {
  const [searchParams] = useSearchParams();
  const initialFacilityId = searchParams.get('facility_id') || '';

  const [facilities, setFacilities] = useState([]);
  const [selectedFacilityId, setSelectedFacilityId] = useState(initialFacilityId);
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  // Edit court modal state
  const [editingCourt, setEditingCourt] = useState(null);

  const loadData = async () => {
    try {
      const fRes = await fetchOwnerFacilities();
      setFacilities(fRes.data.facilities || []);

      const cRes = await fetchOwnerCourts(selectedFacilityId);
      setCourts(cRes.data.courts || []);
    } catch (err) {
      console.error("Error loading courts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedFacilityId]);

  const handleDelete = async (courtId) => {
    if (!window.confirm("Are you sure you want to delete this court?")) return;
    try {
      const res = await deleteCourt(courtId);
      setMessage({ type: 'success', text: res.data.message || 'Court deleted.' });
      loadData();
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.error || 'Failed to delete court.' });
    }
  };

  const handleToggleStatus = async (court) => {
    try {
      const updatedStatus = court.is_active ? 0 : 1;
      await updateCourt(court.id, { is_active: updatedStatus });
      setMessage({ type: 'success', text: `Court ${updatedStatus ? 'activated' : 'deactivated'} successfully.` });
      loadData();
    } catch (err) {
      setMessage({ type: 'danger', text: 'Failed to update court status.' });
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingCourt) return;

    try {
      await updateCourt(editingCourt.id, editingCourt);
      setMessage({ type: 'success', text: 'Court details updated successfully!' });
      setEditingCourt(null);
      loadData();
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.error || 'Failed to update court.' });
    }
  };

  return (
    <div className="py-5">
      <div className="container">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <h2 className="fw-bold mb-1">Court Management</h2>
            <p className="text-muted small mb-0">Add, configure, or activate/deactivate courts for your facilities</p>
          </div>

          <div className="d-flex gap-2">
            <Link to="/owner/courts/add" className="btn btn-qc-emerald">
              <i className="bi bi-plus-lg me-1"></i> Add New Court
            </Link>
          </div>
        </div>

        {/* Filter Facility Selector */}
        <div className="qc-card p-3 mb-4">
          <div className="row align-items-center">
            <div className="col-md-3">
              <label className="form-label fw-bold text-dark mb-md-0">Filter By Facility:</label>
            </div>
            <div className="col-md-9">
              <select
                className="form-select"
                value={selectedFacilityId}
                onChange={(e) => setSelectedFacilityId(e.target.value)}
              >
                <option value="">All Facilities ({facilities.length})</option>
                {facilities.map((f) => (
                  <option key={f.id} value={f.id}>{f.name} ({f.location})</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {message && (
          <ToastMessage type={message.type} message={message.text} onClose={() => setMessage(null)} />
        )}

        {loading ? (
          <LoadingSpinner message="Fetching courts list..." />
        ) : courts.length === 0 ? (
          <div className="qc-card p-5 text-center">
            <i className="bi bi-grid-3x3-gap fs-1 text-muted mb-3 d-block"></i>
            <h5 className="fw-bold">No Courts Available</h5>
            <p className="text-muted small mb-3">Add courts (e.g. Court A, Pitch 1) to allow users to select time slots.</p>
            <Link to="/owner/courts/add" className="btn btn-qc-emerald rounded-pill">
              Add First Court
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            {courts.map((court) => (
              <div key={court.id} className="col-md-6 col-lg-4">
                <CourtCard
                  court={court}
                  showManageButtons={true}
                  onEdit={(c) => setEditingCourt({ ...c })}
                  onDelete={handleDelete}
                  onToggleStatus={handleToggleStatus}
                />
              </div>
            ))}
          </div>
        )}

        {/* Edit Court Modal */}
        {editingCourt && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg rounded-4">
                <div className="modal-header border-0">
                  <h5 className="modal-title fw-bold">Edit Court</h5>
                  <button type="button" className="btn-close" onClick={() => setEditingCourt(null)}></button>
                </div>
                <form onSubmit={handleSaveEdit}>
                  <div className="modal-body py-2">
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Court Name</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={editingCourt.name}
                        onChange={(e) => setEditingCourt({ ...editingCourt, name: e.target.value })}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Sport Type</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={editingCourt.sport_type}
                        onChange={(e) => setEditingCourt({ ...editingCourt, sport_type: e.target.value })}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Price Per Hour (₹)</label>
                      <input
                        type="number"
                        className="form-control"
                        required
                        value={editingCourt.price_per_hour}
                        onChange={(e) => setEditingCourt({ ...editingCourt, price_per_hour: e.target.value })}
                      />
                    </div>
                    <div className="row g-2 mb-3">
                      <div className="col-6">
                        <label className="form-label small fw-semibold">Opening Time</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editingCourt.opening_time}
                          onChange={(e) => setEditingCourt({ ...editingCourt, opening_time: e.target.value })}
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label small fw-semibold">Closing Time</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editingCourt.closing_time}
                          onChange={(e) => setEditingCourt({ ...editingCourt, closing_time: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer border-0">
                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setEditingCourt(null)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-qc-emerald btn-sm">
                      Save Changes
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

export default OwnerCourts;

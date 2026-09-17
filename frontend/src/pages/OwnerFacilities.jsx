import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchOwnerFacilities, deleteFacility } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ToastMessage from '../components/ToastMessage';

const OwnerFacilities = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const loadFacilities = async () => {
    try {
      const res = await fetchOwnerFacilities();
      setFacilities(res.data.facilities || []);
    } catch (err) {
      console.error("Failed to load facilities", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFacilities();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this facility? All associated courts will be deleted.")) {
      return;
    }
    try {
      const res = await deleteFacility(id);
      setMessage({ type: 'success', text: res.data.message || 'Facility deleted.' });
      loadFacilities();
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.error || 'Failed to delete facility.' });
    }
  };

  return (
    <div className="py-5">
      <div className="container">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <h2 className="fw-bold mb-1">My Facilities</h2>
            <p className="text-muted small mb-0">Manage your listed sports venues and track admin approval status</p>
          </div>
          <Link to="/owner/facilities/add" className="btn btn-qc-emerald">
            <i className="bi bi-plus-lg me-1"></i> Add New Facility
          </Link>
        </div>

        {message && (
          <ToastMessage type={message.type} message={message.text} onClose={() => setMessage(null)} />
        )}

        {loading ? (
          <LoadingSpinner message="Fetching your facilities..." />
        ) : facilities.length === 0 ? (
          <div className="qc-card p-5 text-center">
            <i className="bi bi-building-add fs-1 text-muted mb-3 d-block"></i>
            <h5 className="fw-bold">No Facilities Added Yet</h5>
            <p className="text-muted small mb-3">Add your first sports facility to start listing courts for user bookings.</p>
            <Link to="/owner/facilities/add" className="btn btn-qc-emerald rounded-pill">
              Add Facility
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            {facilities.map((f) => {
              const statusClass = f.status === 'Approved' ? 'approved' : f.status === 'Rejected' ? 'rejected' : 'pending';

              return (
                <div key={f.id} className="col-md-6 col-lg-4">
                  <div className="qc-card h-100 d-flex flex-column">
                    <div className="qc-card-img-wrapper">
                      <img src={f.image} alt={f.name} className="qc-card-img" />
                      <div className="position-absolute top-0 end-0 m-3">
                        <span className={`status-badge ${statusClass} shadow-sm`}>{f.status}</span>
                      </div>
                    </div>

                    <div className="p-4 d-flex flex-column flex-grow-1">
                      <h5 className="fw-bold mb-1">{f.name}</h5>
                      <p className="text-muted small mb-2"><i className="bi bi-geo-alt text-danger me-1"></i> {f.location}</p>

                      <p className="text-secondary small mb-3 line-clamp-2">{f.description}</p>

                      {/* Rejection alert comment */}
                      {f.status === 'Rejected' && f.rejection_comment && (
                        <div className="alert alert-danger p-2 small mb-3">
                          <strong>Admin Rejection Note:</strong> {f.rejection_comment}
                        </div>
                      )}

                      <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
                        <Link to={`/owner/courts?facility_id=${f.id}`} className="btn btn-sm btn-outline-info">
                          <i className="bi bi-grid-3x3-gap me-1"></i> View Courts
                        </Link>
                        <div className="d-flex gap-1">
                          <Link to={`/owner/facilities/edit/${f.id}`} className="btn btn-sm btn-outline-primary">
                            <i className="bi bi-pencil"></i> Edit
                          </Link>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(f.id)}>
                            <i className="bi bi-trash"></i> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerFacilities;

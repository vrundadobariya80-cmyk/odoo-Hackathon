import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchOwnerFacilities, createCourt } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ToastMessage from '../components/ToastMessage';

const AddCourt = () => {
  const [facilities, setFacilities] = useState([]);
  const [facilityId, setFacilityId] = useState('');
  const [name, setName] = useState('');
  const [sportType, setSportType] = useState('Badminton');
  const [pricePerHour, setPricePerHour] = useState('500');
  const [openingTime, setOpeningTime] = useState('06:00');
  const [closingTime, setClosingTime] = useState('22:00');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const loadFacilities = async () => {
      try {
        const res = await fetchOwnerFacilities();
        const facs = res.data.facilities || [];
        setFacilities(facs);
        if (facs.length > 0) {
          setFacilityId(facs[0].id);
        }
      } catch (err) {
        setError('Failed to fetch facility list.');
      } finally {
        setLoading(false);
      }
    };
    loadFacilities();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!facilityId) {
      setError('Please select a facility first.');
      return;
    }

    setSubmitting(true);

    try {
      await createCourt({
        facility_id: facilityId,
        name,
        sport_type: sportType,
        price_per_hour: Number(pricePerHour),
        opening_time: openingTime,
        closing_time: closingTime
      });
      navigate(`/owner/courts?facility_id=${facilityId}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add court.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Preparing form..." />;

  return (
    <div className="py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="qc-card p-4 p-md-5">
              <h3 className="fw-bold mb-3">Add New Court</h3>

              {facilities.length === 0 ? (
                <div className="alert alert-warning">
                  You need to create a facility first before adding courts.
                </div>
              ) : (
                <>
                  <ToastMessage type="danger" message={error} onClose={() => setError('')} />

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label fw-semibold small text-muted">Select Target Facility</label>
                      <select
                        className="form-select"
                        required
                        value={facilityId}
                        onChange={(e) => setFacilityId(e.target.value)}
                      >
                        {facilities.map((f) => (
                          <option key={f.id} value={f.id}>{f.name} ({f.location})</option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold small text-muted">Court Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Wooden Court 1, Pitch B"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold small text-muted">Sport Category</label>
                      <select
                        className="form-select"
                        value={sportType}
                        onChange={(e) => setSportType(e.target.value)}
                      >
                        <option value="Badminton">Badminton</option>
                        <option value="Football">Football</option>
                        <option value="Cricket">Cricket</option>
                        <option value="Tennis">Tennis</option>
                        <option value="Basketball">Basketball</option>
                        <option value="Table Tennis">Table Tennis</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold small text-muted">Price Per Hour (₹)</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="500"
                        required
                        value={pricePerHour}
                        onChange={(e) => setPricePerHour(e.target.value)}
                      />
                    </div>

                    <div className="row g-3 mb-4">
                      <div className="col-6">
                        <label className="form-label fw-semibold small text-muted">Opening Time</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="06:00"
                          value={openingTime}
                          onChange={(e) => setOpeningTime(e.target.value)}
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label fw-semibold small text-muted">Closing Time</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="22:00"
                          value={closingTime}
                          onChange={(e) => setClosingTime(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="d-flex gap-2">
                      <button type="button" className="btn btn-outline-secondary w-50" onClick={() => navigate('/owner/courts')}>
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-qc-emerald w-50" disabled={submitting}>
                        {submitting ? 'Adding...' : 'Add Court'}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCourt;

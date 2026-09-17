import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createFacility } from '../services/api';
import ToastMessage from '../components/ToastMessage';

const AddFacility = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState('');
  const [sports, setSports] = useState('Badminton, Football');
  const [amenities, setAmenities] = useState('Floodlights, Changing Rooms, Parking');
  const [image, setImage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createFacility({
        name,
        description,
        address,
        location,
        sports,
        amenities,
        image
      });
      navigate('/owner/facilities');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add facility.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-7">
            <div className="qc-card p-4 p-md-5">
              <h3 className="fw-bold mb-2">Add New Sports Facility</h3>
              <p className="text-muted small mb-4">
                Fill in the facility details below. New facilities require Admin approval before becoming visible to users.
              </p>

              <ToastMessage type="danger" message={error} onClose={() => setError('')} />

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold small text-muted">Facility Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. SBR Turf & Sports Arena"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold small text-muted">Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Describe your sports venue, surface quality, floodlights..."
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small text-muted">Full Address</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Opp. Rajpath Club, Sindhu Bhavan Road"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small text-muted">Location / Area</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Sindhu Bhavan Road, Ahmedabad"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold small text-muted">Supported Sports (Comma Separated)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Badminton, Football, Cricket"
                    required
                    value={sports}
                    onChange={(e) => setSports(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold small text-muted">Amenities (Comma Separated)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Floodlights, Changing Rooms, Free Parking, Shower"
                    required
                    value={amenities}
                    onChange={(e) => setAmenities(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold small text-muted">Facility Image URL (Optional)</label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                  />
                </div>

                <div className="d-flex gap-2">
                  <button type="button" className="btn btn-outline-secondary w-50" onClick={() => navigate('/owner/facilities')}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-qc-emerald w-50" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Facility'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFacility;

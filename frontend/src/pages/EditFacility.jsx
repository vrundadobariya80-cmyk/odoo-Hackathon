import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchVenueDetails, updateFacility } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ToastMessage from '../components/ToastMessage';

const EditFacility = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState('');
  const [sports, setSports] = useState('');
  const [amenities, setAmenities] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadFacility = async () => {
      try {
        const res = await fetchVenueDetails(id);
        const f = res.data.facility;
        if (f) {
          setName(f.name);
          setDescription(f.description);
          setAddress(f.address);
          setLocation(f.location);
          setSports(f.sports);
          setAmenities(f.amenities);
          setImage(f.image);
        }
      } catch (err) {
        setError('Failed to fetch facility details.');
      } finally {
        setLoading(false);
      }
    };
    loadFacility();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await updateFacility(id, {
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
      setError(err.response?.data?.error || 'Failed to update facility.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Fetching facility info..." />;

  return (
    <div className="py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-7">
            <div className="qc-card p-4 p-md-5">
              <h3 className="fw-bold mb-3">Edit Facility</h3>

              <ToastMessage type="danger" message={error} onClose={() => setError('')} />

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold small text-muted">Facility Name</label>
                  <input
                    type="text"
                    className="form-control"
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
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold small text-muted">Supported Sports</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={sports}
                    onChange={(e) => setSports(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold small text-muted">Amenities</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={amenities}
                    onChange={(e) => setAmenities(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold small text-muted">Facility Image URL</label>
                  <input
                    type="url"
                    className="form-control"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                  />
                </div>

                <div className="d-flex gap-2">
                  <button type="button" className="btn btn-outline-secondary w-50" onClick={() => navigate('/owner/facilities')}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-qc-emerald w-50" disabled={submitting}>
                    {submitting ? 'Updating...' : 'Save Changes'}
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

export default EditFacility;

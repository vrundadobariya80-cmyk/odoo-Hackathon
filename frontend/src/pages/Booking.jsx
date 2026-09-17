import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { fetchVenueDetails, fetchSlots } from '../services/api';
import TimeSlotGrid from '../components/TimeSlotGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import ToastMessage from '../components/ToastMessage';

const Booking = () => {
  const [searchParams] = useSearchParams();
  const facilityId = searchParams.get('facility_id');
  const courtId = searchParams.get('court_id');

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);

  const [facility, setFacility] = useState(null);
  const [court, setCourt] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const loadFacilityAndCourt = async () => {
      if (!facilityId || !courtId) {
        setError('Invalid venue or court selection.');
        setLoading(false);
        return;
      }
      try {
        const res = await fetchVenueDetails(facilityId);
        const f = res.data.facility;
        const c = res.data.courts.find((item) => item.id === Number(courtId));

        if (!f || !c) {
          setError('Court details could not be found.');
        } else {
          setFacility(f);
          setCourt(c);
        }
      } catch (err) {
        setError('Failed to fetch booking details.');
      } finally {
        setLoading(false);
      }
    };
    loadFacilityAndCourt();
  }, [facilityId, courtId]);

  useEffect(() => {
    const loadSlotData = async () => {
      if (!courtId || !selectedDate) return;
      setSlotsLoading(true);
      setSelectedSlot(null);
      try {
        const res = await fetchSlots(courtId, selectedDate);
        setSlots(res.data.slots || []);
      } catch (err) {
        console.error("Error loading slots", err);
      } finally {
        setSlotsLoading(false);
      }
    };
    loadSlotData();
  }, [courtId, selectedDate]);

  const handleProceedToPayment = () => {
    if (!selectedSlot) {
      setError('Please select an available time slot.');
      return;
    }

    navigate('/payment', {
      state: {
        facility,
        court,
        bookingDate: selectedDate,
        slot: selectedSlot
      }
    });
  };

  if (loading) return <LoadingSpinner message="Preparing booking screen..." />;
  if (error && !facility) {
    return (
      <div className="container py-5 text-center">
        <ToastMessage type="danger" message={error} />
        <Link to="/venues" className="btn btn-qc-emerald mt-3">Back to Venues</Link>
      </div>
    );
  }

  return (
    <div className="py-5">
      <div className="container">
        <h2 className="fw-bold mb-4">Book Your Court Slot</h2>

        <ToastMessage type="danger" message={error} onClose={() => setError('')} />

        <div className="row g-4">
          {/* Main Slot Selector */}
          <div className="col-lg-8">
            <div className="qc-card p-4 mb-4">
              <div className="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom">
                <img
                  src={facility.image}
                  alt={facility.name}
                  className="rounded-3"
                  width="70"
                  height="70"
                  style={{ objectFit: 'cover' }}
                />
                <div>
                  <h5 className="fw-bold mb-1">{facility.name}</h5>
                  <p className="text-muted small mb-0"><i className="bi bi-geo-alt text-danger me-1"></i> {facility.location}</p>
                </div>
              </div>

              {/* Court Details Badge */}
              <div className="p-3 bg-light rounded-3 mb-4 d-flex align-items-center justify-content-between">
                <div>
                  <span className="badge bg-dark mb-1">{court.sport_type}</span>
                  <h6 className="fw-bold mb-0">{court.name}</h6>
                </div>
                <div className="text-end">
                  <span className="text-muted small d-block">Hourly Rate</span>
                  <span className="fs-5 fw-bold text-success">₹{court.price_per_hour}</span>
                </div>
              </div>

              {/* Date Selection */}
              <div className="mb-4">
                <label className="form-label fw-bold text-dark mb-2">Select Booking Date</label>
                <input
                  type="date"
                  className="form-control form-control-lg max-w-xs"
                  min={todayStr}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>

              {/* Slots Grid */}
              <div>
                <h6 className="fw-bold mb-3">Available Hourly Time Slots</h6>
                {slotsLoading ? (
                  <LoadingSpinner message="Checking real-time slot availability..." />
                ) : (
                  <TimeSlotGrid
                    slots={slots}
                    selectedSlot={selectedSlot}
                    onSelectSlot={(slot) => {
                      setSelectedSlot(slot);
                      setError('');
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Booking Summary Panel */}
          <div className="col-lg-4">
            <div className="qc-card p-4 sticky-top" style={{ top: '100px' }}>
              <h5 className="fw-bold mb-3 pb-2 border-bottom">Booking Summary</h5>

              <div className="d-flex flex-column gap-3 small mb-4">
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Facility:</span>
                  <span className="fw-bold text-end">{facility.name}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Court:</span>
                  <span className="fw-bold text-end">{court.name}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Sport:</span>
                  <span className="badge bg-dark">{court.sport_type}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Date:</span>
                  <span className="fw-bold">{selectedDate}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Selected Slot:</span>
                  <span className={`fw-bold ${selectedSlot ? 'text-success' : 'text-danger'}`}>
                    {selectedSlot ? selectedSlot.slot_label : 'None Selected'}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-light rounded-3 mb-4">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold text-dark">Total Amount:</span>
                  <span className="fs-3 fw-extrabold text-success">
                    ₹{selectedSlot ? court.price_per_hour : 0}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-qc-emerald w-100 btn-lg shadow-sm"
                disabled={!selectedSlot}
                onClick={handleProceedToPayment}
              >
                Proceed to Payment <i className="bi bi-arrow-right me-1"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;

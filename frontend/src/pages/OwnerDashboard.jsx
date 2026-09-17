import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchOwnerDashboard } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const OwnerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await fetchOwnerDashboard();
        setData(res.data);
      } catch (err) {
        console.error("Failed to load owner dashboard", err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading) return <LoadingSpinner message="Loading owner analytics..." />;

  const { total_facilities, active_courts, total_bookings, total_earnings, chart_data } = data || {};

  return (
    <div className="py-5">
      <div className="container">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <h2 className="fw-bold mb-1">Facility Owner Portal</h2>
            <p className="text-muted small mb-0">Manage your venues, courts, bookings, and earnings</p>
          </div>
          <div className="d-flex gap-2">
            <Link to="/owner/facilities/add" className="btn btn-qc-emerald btn-sm shadow-sm">
              <i className="bi bi-plus-lg me-1"></i> Add New Facility
            </Link>
            <Link to="/owner/courts/add" className="btn btn-qc-outline btn-sm">
              <i className="bi bi-plus-lg me-1"></i> Add Court
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row g-4 mb-4">
          <div className="col-sm-6 col-lg-3">
            <div className="qc-card p-4 border-start border-4 border-success">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <span className="text-muted small d-block">Simulated Earnings</span>
                  <h3 className="fw-extrabold text-success mb-0">₹{total_earnings}</h3>
                </div>
                <div className="bg-success-subtle text-success p-3 rounded-circle">
                  <i className="bi bi-currency-rupee fs-3"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-lg-3">
            <div className="qc-card p-4 border-start border-4 border-primary">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <span className="text-muted small d-block">Total Bookings</span>
                  <h3 className="fw-extrabold text-primary mb-0">{total_bookings}</h3>
                </div>
                <div className="bg-primary-subtle text-primary p-3 rounded-circle">
                  <i className="bi bi-calendar-check fs-3"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-lg-3">
            <div className="qc-card p-4 border-start border-4 border-info">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <span className="text-muted small d-block">Total Facilities</span>
                  <h3 className="fw-extrabold text-info mb-0">{total_facilities}</h3>
                </div>
                <div className="bg-info-subtle text-info p-3 rounded-circle">
                  <i className="bi bi-building fs-3"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-lg-3">
            <div className="qc-card p-4 border-start border-4 border-warning">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <span className="text-muted small d-block">Active Courts</span>
                  <h3 className="fw-extrabold text-warning mb-0">{active_courts}</h3>
                </div>
                <div className="bg-warning-subtle text-warning p-3 rounded-circle">
                  <i className="bi bi-grid-3x3-gap fs-3"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Charts & Quick Links */}
        <div className="row g-4">
          {/* Daily Bookings Chart */}
          <div className="col-lg-7">
            <div className="qc-card p-4 h-100">
              <h5 className="fw-bold mb-3">Weekly Booking Activity & Revenue</h5>
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr className="text-muted small">
                      <th>Day</th>
                      <th>Bookings</th>
                      <th>Revenue (₹)</th>
                      <th>Activity Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chart_data?.daily?.map((row, idx) => (
                      <tr key={idx}>
                        <td className="fw-bold">{row.day}</td>
                        <td><span className="badge bg-light text-dark border">{row.bookings} slots</span></td>
                        <td className="fw-bold text-success">₹{row.earnings}</td>
                        <td style={{ width: '40%' }}>
                          <div className="progress" style={{ height: '8px' }}>
                            <div
                              className="progress-bar bg-success"
                              style={{ width: `${(row.bookings / 15) * 100}%` }}
                            ></div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Quick Management Cards */}
          <div className="col-lg-5">
            <div className="qc-card p-4 mb-4">
              <h5 className="fw-bold mb-3">Quick Navigation</h5>
              <div className="d-grid gap-2">
                <Link to="/owner/facilities" className="btn btn-outline-primary d-flex align-items-center justify-content-between p-3 text-start">
                  <div>
                    <strong className="d-block">Manage My Facilities</strong>
                    <span className="small text-muted">View status, edit, or submit new venue</span>
                  </div>
                  <i className="bi bi-chevron-right"></i>
                </Link>

                <Link to="/owner/courts" className="btn btn-outline-info d-flex align-items-center justify-content-between p-3 text-start">
                  <div>
                    <strong className="d-block">Manage Courts & Pricing</strong>
                    <span className="small text-muted">Set hourly prices & operating hours</span>
                  </div>
                  <i className="bi bi-chevron-right"></i>
                </Link>

                <Link to="/owner/bookings" className="btn btn-outline-success d-flex align-items-center justify-content-between p-3 text-start">
                  <div>
                    <strong className="d-block">Facility Bookings & Block Slots</strong>
                    <span className="small text-muted">View user reservations or block slots for maintenance</span>
                  </div>
                  <i className="bi bi-chevron-right"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;

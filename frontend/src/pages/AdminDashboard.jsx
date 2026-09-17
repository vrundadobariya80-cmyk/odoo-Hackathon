import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAdminDashboard } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await fetchAdminDashboard();
        setData(res.data);
      } catch (err) {
        console.error("Error loading admin dashboard", err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading) return <LoadingSpinner message="Loading system administration statistics..." />;

  const { stats, chart_data } = data || {};

  return (
    <div className="py-5">
      <div className="container">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <h2 className="fw-bold mb-1">QuickCourt Admin Control Panel</h2>
            <p className="text-muted small mb-0">Platform overview, facility verification, and user management</p>
          </div>
          <div className="d-flex gap-2">
            <Link to="/admin/facilities" className="btn btn-warning fw-bold text-dark btn-sm">
              <i className="bi bi-clock-history me-1"></i> Pending Approvals ({stats?.pending_facilities || 0})
            </Link>
            <Link to="/admin/users" className="btn btn-danger btn-sm">
              <i className="bi bi-people me-1"></i> Manage Users
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="row g-4 mb-4">
          <div className="col-sm-6 col-lg-3">
            <div className="qc-card p-4 border-start border-4 border-warning">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <span className="text-muted small d-block">Pending Approvals</span>
                  <h3 className="fw-extrabold text-warning mb-0">{stats?.pending_facilities}</h3>
                </div>
                <div className="bg-warning-subtle text-warning p-3 rounded-circle">
                  <i className="bi bi-hourglass-split fs-3"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-lg-3">
            <div className="qc-card p-4 border-start border-4 border-success">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <span className="text-muted small d-block">Total Platform Earnings</span>
                  <h3 className="fw-extrabold text-success mb-0">₹{stats?.total_earnings}</h3>
                </div>
                <div className="bg-success-subtle text-success p-3 rounded-circle">
                  <i className="bi bi-graph-up-arrow fs-3"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-lg-3">
            <div className="qc-card p-4 border-start border-4 border-primary">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <span className="text-muted small d-block">Total Users</span>
                  <h3 className="fw-extrabold text-primary mb-0">{stats?.total_users}</h3>
                </div>
                <div className="bg-primary-subtle text-primary p-3 rounded-circle">
                  <i className="bi bi-people fs-3"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-lg-3">
            <div className="qc-card p-4 border-start border-4 border-info">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <span className="text-muted small d-block">Facility Owners</span>
                  <h3 className="fw-extrabold text-info mb-0">{stats?.total_owners}</h3>
                </div>
                <div className="bg-info-subtle text-info p-3 rounded-circle">
                  <i className="bi bi-building fs-3"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity & Quick Navigation */}
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="qc-card p-4 h-100">
              <h5 className="fw-bold mb-3">Platform Growth & Monthly Bookings</h5>
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr className="text-muted small">
                      <th>Month</th>
                      <th>Bookings</th>
                      <th>New User Registrations</th>
                      <th>Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chart_data?.monthly_activity?.map((row, idx) => (
                      <tr key={idx}>
                        <td className="fw-bold">{row.month}</td>
                        <td><span className="badge bg-success-subtle text-success">{row.bookings} bookings</span></td>
                        <td><span className="badge bg-light text-dark border">+{row.registrations} users</span></td>
                        <td style={{ width: '35%' }}>
                          <div className="progress" style={{ height: '8px' }}>
                            <div className="progress-bar bg-primary" style={{ width: `${(row.bookings / 200) * 100}%` }}></div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="qc-card p-4 h-100">
              <h5 className="fw-bold mb-3">Admin Actions</h5>
              <div className="d-grid gap-3">
                <Link to="/admin/facilities" className="btn btn-warning p-3 text-start text-dark fw-bold border">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fs-6">Pending Facility Requests</div>
                      <small className="fw-normal opacity-75">Review and approve new venues</small>
                    </div>
                    <span className="badge bg-dark rounded-circle">{stats?.pending_facilities}</span>
                  </div>
                </Link>

                <Link to="/admin/users" className="btn btn-outline-danger p-3 text-start">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-bold text-dark">User Management & Bans</div>
                      <small className="text-muted">Search, inspect roles, or suspend users</small>
                    </div>
                    <i className="bi bi-chevron-right"></i>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

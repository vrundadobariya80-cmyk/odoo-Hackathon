import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark qc-navbar sticky-top">
      <div className="container">
        <Link className="navbar-brand qc-brand" to="/">
          <i className="bi bi-lightning-charge-fill text-warning"></i>
          Quick<span>Court</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarQuickCourt"
          aria-controls="navbarQuickCourt"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarQuickCourt">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link qc-nav-link ${isActive ? 'active' : ''}`} to="/">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link qc-nav-link ${isActive ? 'active' : ''}`} to="/venues">
                Venues
              </NavLink>
            </li>
            {user && user.role === 'user' && (
              <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link qc-nav-link ${isActive ? 'active' : ''}`} to="/my-bookings">
                  My Bookings
                </NavLink>
              </li>
            )}
            {user && user.role === 'owner' && (
              <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link qc-nav-link ${isActive ? 'active' : ''}`} to="/owner/dashboard">
                  <i className="bi bi-speedometer2 me-1"></i> Owner Dashboard
                </NavLink>
              </li>
            )}
            {user && user.role === 'admin' && (
              <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link qc-nav-link ${isActive ? 'active' : ''}`} to="/admin/dashboard">
                  <i className="bi bi-shield-lock-fill me-1"></i> Admin Dashboard
                </NavLink>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-2 mt-3 mt-lg-0">
            {user ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-light dropdown-toggle d-flex align-items-center gap-2 rounded-pill px-3 py-1"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                    alt="avatar"
                    className="rounded-circle"
                    width="28"
                    height="28"
                    style={{ objectFit: 'cover' }}
                  />
                  <span className="fw-semibold">{user.full_name}</span>
                  <span className={`qc-badge-role ${user.role === 'admin' ? 'bg-danger' : user.role === 'owner' ? 'bg-primary' : 'bg-success'}`}>
                    {user.role}
                  </span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2" aria-labelledby="userDropdown">
                  <li>
                    <Link className="dropdown-item py-2" to="/profile">
                      <i className="bi bi-person-circle me-2 text-primary"></i> My Profile
                    </Link>
                  </li>
                  {user.role === 'user' && (
                    <li>
                      <Link className="dropdown-item py-2" to="/my-bookings">
                        <i className="bi bi-calendar-check me-2 text-success"></i> My Bookings
                      </Link>
                    </li>
                  )}
                  {user.role === 'owner' && (
                    <>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <Link className="dropdown-item py-2" to="/owner/facilities">
                          <i className="bi bi-building me-2 text-primary"></i> My Facilities
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item py-2" to="/owner/courts">
                          <i className="bi bi-grid-3x3-gap me-2 text-info"></i> Manage Courts
                        </Link>
                      </li>
                    </>
                  )}
                  {user.role === 'admin' && (
                    <>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <Link className="dropdown-item py-2" to="/admin/facilities">
                          <i className="bi bi-check2-circle me-2 text-warning"></i> Pending Approvals
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item py-2" to="/admin/users">
                          <i className="bi bi-people me-2 text-danger"></i> Manage Users
                        </Link>
                      </li>
                    </>
                  )}
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item py-2 text-danger" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i> Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-light me-2 rounded-pill px-4">
                  Login
                </Link>
                <Link to="/signup" className="btn btn-qc-emerald rounded-pill px-4">
                  Signup
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

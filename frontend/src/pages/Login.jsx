import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ToastMessage from '../components/ToastMessage';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(email, password);
      if (data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (data.user.role === 'owner') {
        navigate('/owner/dashboard');
      } else {
        const from = location.state?.from?.pathname || '/venues';
        navigate(from);
      }
    } catch (err) {
      const resp = err.response?.data;
      if (resp?.needs_verification) {
        navigate(`/verify-otp?email=${encodeURIComponent(resp.email)}`);
      } else if (resp?.error) {
        setError(resp.error);
      } else if (err.code === 'ERR_NETWORK' || !err.response) {
        setError('Cannot connect to server. Please check if the backend server is running.');
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePresetLogin = (presetEmail, presetPassword) => {
    setEmail(presetEmail);
    setPassword(presetPassword);
  };

  return (
    <div className="auth-page-wrapper">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="auth-card-wrapper shadow-lg">
              <div className="row g-0">
                {/* Left Side: Branding Hero */}
                <div className="col-lg-6 auth-hero-side d-none d-lg-flex">
                  <div>
                    <div className="qc-brand mb-4 fs-3">
                      <div className="qc-footer-logo-icon me-2">⚡</div>
                      Quick<span>Court</span>
                    </div>

                    <h2 className="fw-extrabold text-white mb-3 fs-2">
                      Elevate Your Game.<br />
                      <span className="text-gradient-emerald">Book Courts Instantly.</span>
                    </h2>

                    <p className="text-light opacity-80 small mb-4 leading-relaxed">
                      Access verified FIFA-grade turfs, BWF indoor badminton arenas, and clay tennis courts across Ahmedabad with zero booking delays.
                    </p>

                    <div className="d-flex flex-column gap-3 pt-2">
                      <div className="d-flex align-items-center gap-3">
                        <div className="bg-emerald bg-opacity-20 text-emerald p-2 rounded-circle fs-6">
                          <i className="bi bi-lightning-charge-fill"></i>
                        </div>
                        <span className="text-light opacity-90 small fw-semibold">Real-Time Hourly Slot Locking</span>
                      </div>
                      <div className="d-flex align-items-center gap-3">
                        <div className="bg-emerald bg-opacity-20 text-emerald p-2 rounded-circle fs-6">
                          <i className="bi bi-shield-check"></i>
                        </div>
                        <span className="text-light opacity-90 small fw-semibold">100% Quality Checked Venues</span>
                      </div>
                      <div className="d-flex align-items-center gap-3">
                        <div className="bg-emerald bg-opacity-20 text-emerald p-2 rounded-circle fs-6">
                          <i className="bi bi-wallet2"></i>
                        </div>
                        <span className="text-light opacity-90 small fw-semibold">Pay Online (UPI) or Cash at Venue</span>
                      </div>
                    </div>
                  </div>

                  {/* Customer testimonial quote pill */}
                  <div className="mt-5 p-3 rounded-4 bg-white bg-opacity-10 border border-white border-opacity-15 backdrop-blur">
                    <p className="text-light small fst-italic mb-2">
                      "Booked our 8 PM box cricket slot in Bodakdev in under 30 seconds. Seamless confirmation!"
                    </p>
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge bg-emerald text-white rounded-pill fs-7">Verified Player</span>
                      <span className="text-light opacity-75 fs-7">• Rohan S.</span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Form */}
                <div className="col-lg-6 p-4 p-md-5 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex align-items-center justify-content-between mb-4">
                      <div>
                        <h3 className="fw-extrabold text-dark mb-1">Welcome Back</h3>
                        <p className="text-muted small mb-0">Sign in to manage reservations & book courts</p>
                      </div>
                      <div className="bg-success-subtle text-emerald p-2.5 rounded-circle d-lg-none fs-4">
                        ⚡
                      </div>
                    </div>

                    <ToastMessage type="danger" message={error} onClose={() => setError('')} />

                    <form onSubmit={handleLogin}>
                      {/* Email Input */}
                      <div className="mb-3">
                        <label className="form-label fw-semibold small text-muted">Email Address</label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0 text-muted">
                            <i className="bi bi-envelope"></i>
                          </span>
                          <input
                            type="email"
                            className="form-control form-control-lg border-start-0 ps-0 shadow-none text-dark fw-semibold fs-6"
                            placeholder="name@example.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Password Input with Show/Hide Toggle */}
                      <div className="mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <label className="form-label fw-semibold small text-muted mb-0">Password</label>
                        </div>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0 text-muted">
                            <i className="bi bi-lock"></i>
                          </span>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            className="form-control form-control-lg border-start-0 border-end-0 ps-0 shadow-none text-dark fw-semibold fs-6"
                            placeholder="••••••••"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          <button
                            type="button"
                            className="input-group-text bg-light border-start-0 text-muted cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                          </button>
                        </div>
                      </div>

                      <button type="submit" className="btn btn-qc-emerald w-100 btn-lg shadow-md fw-bold" disabled={loading}>
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Signing In...
                          </>
                        ) : (
                          <>
                            Sign In <i className="bi bi-arrow-right ms-1"></i>
                          </>
                        )}
                      </button>
                    </form>

                    {/* Quick Demo Credentials Preset */}
                    <div className="mt-4 pt-3 border-top">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="small text-dark fw-bold">⚡ 1-Click Demo Login Presets:</span>
                        <span className="badge bg-warning bg-opacity-20 text-dark fs-7">Dev Demo</span>
                      </div>
                      <div className="d-flex flex-column gap-2">
                        <div
                          className={`preset-account-btn d-flex justify-content-between align-items-center ${
                            email === 'user@quickcourt.com' ? 'border-emerald bg-success-subtle' : ''
                          }`}
                          onClick={() => handlePresetLogin('user@quickcourt.com', 'User@123')}
                        >
                          <div className="d-flex align-items-center gap-2">
                            <i className="bi bi-person-fill text-success fs-5"></i>
                            <div>
                              <strong className="d-block text-dark small">Player User</strong>
                              <span className="text-muted fs-7">user@quickcourt.com</span>
                            </div>
                          </div>
                          <span className="btn btn-sm btn-outline-success rounded-pill px-2.5 fs-7 fw-bold">Select</span>
                        </div>

                        <div
                          className={`preset-account-btn d-flex justify-content-between align-items-center ${
                            email === 'owner@quickcourt.com' ? 'border-emerald bg-success-subtle' : ''
                          }`}
                          onClick={() => handlePresetLogin('owner@quickcourt.com', 'Owner@123')}
                        >
                          <div className="d-flex align-items-center gap-2">
                            <i className="bi bi-building-fill text-primary fs-5"></i>
                            <div>
                              <strong className="d-block text-dark small">Facility Owner</strong>
                              <span className="text-muted fs-7">owner@quickcourt.com</span>
                            </div>
                          </div>
                          <span className="btn btn-sm btn-outline-primary rounded-pill px-2.5 fs-7 fw-bold">Select</span>
                        </div>

                        <div
                          className={`preset-account-btn d-flex justify-content-between align-items-center ${
                            email === 'admin@quickcourt.com' ? 'border-emerald bg-success-subtle' : ''
                          }`}
                          onClick={() => handlePresetLogin('admin@quickcourt.com', 'Admin@123')}
                        >
                          <div className="d-flex align-items-center gap-2">
                            <i className="bi bi-shield-lock-fill text-danger fs-5"></i>
                            <div>
                              <strong className="d-block text-dark small">Platform Admin</strong>
                              <span className="text-muted fs-7">admin@quickcourt.com</span>
                            </div>
                          </div>
                          <span className="btn btn-sm btn-outline-danger rounded-pill px-2.5 fs-7 fw-bold">Select</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center mt-4 pt-2">
                    <span className="text-muted small">Don't have an account? </span>
                    <Link to="/signup" className="text-emerald fw-bold text-decoration-none small ms-1">
                      Sign up now <i className="bi bi-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

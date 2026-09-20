import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { signupUser } from '../services/api';
import ToastMessage from '../components/ToastMessage';

const Signup = () => {
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') || 'user';

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState(defaultRole);
  const [avatar, setAvatar] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const sampleAvatars = [
    { label: 'Player 1', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150' },
    { label: 'Player 2', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
    { label: 'Owner 1', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
    { label: 'Owner 2', url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const res = await signupUser({
        full_name: fullName,
        email,
        password,
        role,
        avatar
      });

      const demoOtp = res.data.otp;
      navigate(`/verify-otp?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(demoOtp)}`);
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.code === 'ERR_NETWORK' || !err.response) {
        setError('Cannot connect to server. Please check if the backend server is running.');
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-11">
            <div className="auth-card-wrapper shadow-lg">
              <div className="row g-0">
                {/* Left Side: Hero branding */}
                <div className="col-lg-5 auth-hero-side d-none d-lg-flex">
                  <div>
                    <div className="qc-brand mb-4 fs-3">
                      <div className="qc-footer-logo-icon me-2">⚡</div>
                      Quick<span>Court</span>
                    </div>

                    <h2 className="fw-extrabold text-white mb-3 fs-2">
                      Join the #1 Sports<br />
                      <span className="text-gradient-emerald">Community in Ahmedabad.</span>
                    </h2>

                    <p className="text-light opacity-80 small mb-4 leading-relaxed">
                      Whether you're looking to book hourly slots or list your local sports facility, QuickCourt connects sports enthusiasts with top venues.
                    </p>

                    <div className="d-flex flex-column gap-3 pt-2">
                      <div className="d-flex align-items-center gap-3">
                        <div className="bg-emerald bg-opacity-20 text-emerald p-2 rounded-circle fs-6">
                          <i className="bi bi-trophy-fill"></i>
                        </div>
                        <div>
                          <strong className="d-block text-white small">For Sports Players</strong>
                          <span className="text-light opacity-75 fs-7">Instant hourly slot locking & flexible pay options</span>
                        </div>
                      </div>

                      <div className="d-flex align-items-center gap-3">
                        <div className="bg-emerald bg-opacity-20 text-emerald p-2 rounded-circle fs-6">
                          <i className="bi bi-building-fill"></i>
                        </div>
                        <div>
                          <strong className="d-block text-white small">For Facility Owners</strong>
                          <span className="text-light opacity-75 fs-7">Manage courts, block slots & track earnings</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 p-3 rounded-4 bg-white bg-opacity-10 border border-white border-opacity-15 backdrop-blur">
                    <div className="d-flex align-items-center gap-2 text-warning mb-1">
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                    </div>
                    <p className="text-light small mb-0">"The fastest way to book sports turfs without back-and-forth phone calls!"</p>
                  </div>
                </div>

                {/* Right Side: Signup Form */}
                <div className="col-lg-7 p-4 p-md-5">
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <div>
                      <h3 className="fw-extrabold text-dark mb-1">Create Your Account</h3>
                      <p className="text-muted small mb-0">Get started in under 1 minute</p>
                    </div>
                    <div className="bg-success-subtle text-emerald p-2.5 rounded-circle d-lg-none fs-4">
                      ⚡
                    </div>
                  </div>

                  <ToastMessage type="danger" message={error} onClose={() => setError('')} />

                  <form onSubmit={handleSubmit}>
                    {/* Role Selector Cards */}
                    <div className="mb-4">
                      <label className="form-label fw-semibold small text-muted d-block">I want to register as:</label>
                      <div className="row g-2">
                        <div className="col-6">
                          <div
                            className={`role-option-card text-center ${role === 'user' ? 'selected' : ''}`}
                            onClick={() => setRole('user')}
                          >
                            <i className="bi bi-person-circle fs-3 text-emerald d-block mb-1"></i>
                            <strong className="d-block text-dark small">Player / User</strong>
                            <span className="text-muted fs-7">Book courts & play</span>
                          </div>
                        </div>
                        <div className="col-6">
                          <div
                            className={`role-option-card text-center ${role === 'owner' ? 'selected' : ''}`}
                            onClick={() => setRole('owner')}
                          >
                            <i className="bi bi-building fs-3 text-primary d-block mb-1"></i>
                            <strong className="d-block text-dark small">Facility Owner</strong>
                            <span className="text-muted fs-7">List & manage venues</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Full Name */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold small text-muted">Full Name</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0 text-muted">
                          <i className="bi bi-person"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control border-start-0 ps-0 shadow-none text-dark fw-semibold"
                          placeholder="e.g. John Doe"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold small text-muted">Email Address</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0 text-muted">
                          <i className="bi bi-envelope"></i>
                        </span>
                        <input
                          type="email"
                          className="form-control border-start-0 ps-0 shadow-none text-dark fw-semibold"
                          placeholder="name@example.com"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Password & Confirm Password */}
                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold small text-muted">Password</label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0 text-muted">
                            <i className="bi bi-lock"></i>
                          </span>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            className="form-control border-start-0 border-end-0 ps-0 shadow-none text-dark fw-semibold"
                            placeholder="••••••••"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          <button
                            type="button"
                            className="input-group-text bg-light border-start-0 text-muted"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                          </button>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold small text-muted">Confirm Password</label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0 text-muted">
                            <i className="bi bi-shield-lock"></i>
                          </span>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            className="form-control border-start-0 ps-0 shadow-none text-dark fw-semibold"
                            placeholder="••••••••"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Avatar Selection */}
                    <div className="mb-4">
                      <label className="form-label fw-semibold small text-muted">Avatar Profile Photo (Optional)</label>
                      <input
                        type="url"
                        className="form-control mb-2"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={avatar}
                        onChange={(e) => setAvatar(e.target.value)}
                      />
                      <div className="d-flex align-items-center gap-2">
                        <span className="text-muted fs-7 fw-semibold">Or pick a sample avatar:</span>
                        <div className="d-flex gap-2">
                          {sampleAvatars.map((av, idx) => (
                            <img
                              key={idx}
                              src={av.url}
                              alt={av.label}
                              className={`rounded-circle border cursor-pointer ${avatar === av.url ? 'border-emerald ring-2' : ''}`}
                              width="34"
                              height="34"
                              style={{ objectFit: 'cover' }}
                              onClick={() => setAvatar(av.url)}
                              title={av.label}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <button type="submit" className="btn btn-qc-emerald w-100 btn-lg shadow-md fw-bold" disabled={loading}>
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Creating Account...
                        </>
                      ) : (
                        <>
                          Sign Up & Receive OTP <i className="bi bi-arrow-right ms-1"></i>
                        </>
                      )}
                    </button>
                  </form>

                  <div className="text-center mt-4 pt-2 border-top">
                    <span className="text-muted small">Already registered? </span>
                    <Link to="/login" className="text-emerald fw-bold text-decoration-none small ms-1">
                      Sign in here <i className="bi bi-arrow-right"></i>
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

export default Signup;

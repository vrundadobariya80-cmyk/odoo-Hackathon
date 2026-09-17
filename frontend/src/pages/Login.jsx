import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ToastMessage from '../components/ToastMessage';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      } else {
        setError(resp?.error || 'Login failed. Please check your credentials.');
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
    <div className="container py-5 my-auto">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-5">
          <div className="qc-card p-4 p-md-5">
            <div className="text-center mb-4">
              <div className="bg-success-subtle text-success d-inline-flex p-3 rounded-circle mb-3">
                <i className="bi bi-box-arrow-in-right fs-2"></i>
              </div>
              <h3 className="fw-bold text-dark">Welcome Back</h3>
              <p className="text-muted small">Log in to manage your bookings and sports courts</p>
            </div>

            <ToastMessage type="danger" message={error} onClose={() => setError('')} />

            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label fw-semibold small text-muted">Email Address</label>
                <input
                  type="email"
                  className="form-control form-control-lg"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold small text-muted">Password</label>
                <input
                  type="password"
                  className="form-control form-control-lg"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-qc-emerald w-100 btn-lg shadow-sm" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Logging in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Quick Demo Credentials Preset */}
            <div className="mt-4 pt-3 border-top">
              <p className="small text-muted text-center fw-semibold mb-2">⚡ One-Click Demo Preset Accounts:</p>
              <div className="d-flex flex-column gap-2">
                <button
                  type="button"
                  className="btn btn-outline-success btn-sm w-100 d-flex justify-content-between align-items-center"
                  onClick={() => handlePresetLogin('user@quickcourt.com', 'User@123')}
                >
                  <span><i className="bi bi-person me-1"></i> User Demo</span>
                  <span className="small text-muted">user@quickcourt.com</span>
                </button>
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm w-100 d-flex justify-content-between align-items-center"
                  onClick={() => handlePresetLogin('owner@quickcourt.com', 'Owner@123')}
                >
                  <span><i className="bi bi-building me-1"></i> Facility Owner Demo</span>
                  <span className="small text-muted">owner@quickcourt.com</span>
                </button>
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm w-100 d-flex justify-content-between align-items-center"
                  onClick={() => handlePresetLogin('admin@quickcourt.com', 'Admin@123')}
                >
                  <span><i className="bi bi-shield-lock me-1"></i> Admin Demo</span>
                  <span className="small text-muted">admin@quickcourt.com</span>
                </button>
              </div>
            </div>

            <div className="text-center mt-4 pt-2">
              <span className="text-muted small">Don't have an account? </span>
              <Link to="/signup" className="text-success fw-bold text-decoration-none small">
                Sign up now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

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
  const [role, setRole] = useState(defaultRole);
  const [avatar, setAvatar] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 my-auto">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="qc-card p-4 p-md-5">
            <div className="text-center mb-4">
              <div className="bg-success-subtle text-success d-inline-flex p-3 rounded-circle mb-3">
                <i className="bi bi-person-plus-fill fs-2"></i>
              </div>
              <h3 className="fw-bold text-dark">Create Your QuickCourt Account</h3>
              <p className="text-muted small">Join thousands of sports enthusiasts and facility owners</p>
            </div>

            <ToastMessage type="danger" message={error} onClose={() => setError('')} />

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold small text-muted">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="John Doe"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold small text-muted">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold small text-muted">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold small text-muted">Confirm Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="••••••••"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold small text-muted">Select Account Role</label>
                <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="user">User (Book Sports Courts)</option>
                  <option value="owner">Facility Owner (List & Manage Venues)</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold small text-muted">Avatar Image URL (Optional)</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-qc-emerald w-100 btn-lg shadow-sm" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Creating Account...
                  </>
                ) : (
                  'Sign Up & Get OTP'
                )}
              </button>
            </form>

            <div className="text-center mt-4 pt-2">
              <span className="text-muted small">Already registered? </span>
              <Link to="/login" className="text-success fw-bold text-decoration-none small">
                Sign in here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;

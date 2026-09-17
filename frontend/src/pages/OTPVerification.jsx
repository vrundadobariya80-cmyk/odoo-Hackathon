import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { verifyOTP } from '../services/api';
import ToastMessage from '../components/ToastMessage';

const OTPVerification = () => {
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get('email') || '';
  const otpParam = searchParams.get('otp') || '';

  const [email] = useState(emailParam);
  const [otp, setOtp] = useState(otpParam);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await verifyOTP({ email, otp });
      setSuccess(res.data.message || 'Verification successful!');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid OTP code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 my-auto">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-5">
          <div className="qc-card p-4 p-md-5">
            <div className="text-center mb-4">
              <div className="bg-success-subtle text-success d-inline-flex p-3 rounded-circle mb-3">
                <i className="bi bi-shield-check fs-2"></i>
              </div>
              <h3 className="fw-bold text-dark">Verify Your Account</h3>
              <p className="text-muted small">
                We sent a 6-digit verification OTP code to <strong>{email || 'your email'}</strong>
              </p>
            </div>

            {/* Development Mode Demo OTP Display */}
            {otpParam && (
              <div className="alert alert-warning border border-warning shadow-sm mb-4 text-center">
                <div className="fw-bold text-dark small mb-1">
                  <i className="bi bi-code-square me-1"></i> Development Demo Mode OTP:
                </div>
                <div className="fs-3 fw-bold tracking-widest text-dark letter-spacing-2">{otpParam}</div>
                <small className="text-muted d-block mt-1">This code has been auto-filled for testing.</small>
              </div>
            )}

            <ToastMessage type="danger" message={error} onClose={() => setError('')} />
            <ToastMessage type="success" message={success} />

            <form onSubmit={handleVerify}>
              <div className="mb-4 text-center">
                <label className="form-label fw-semibold small text-muted">Enter 6-Digit OTP Code</label>
                <input
                  type="text"
                  className="form-control form-control-lg text-center fw-bold fs-3 letter-spacing-2"
                  maxLength="6"
                  placeholder="123456"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-qc-emerald w-100 btn-lg shadow-sm" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Verifying...
                  </>
                ) : (
                  'Verify & Continue to Login'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;

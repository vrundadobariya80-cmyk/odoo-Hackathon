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
      setSuccess(res.data.message || 'Account verified successfully!');
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
    <div className="auth-page-wrapper">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-5">
            <div className="qc-card p-4 p-md-5 shadow-lg border-0 rounded-4">
              <div className="text-center mb-4">
                <div className="bg-success-subtle text-emerald d-inline-flex p-3.5 rounded-circle mb-3 shadow-sm fs-2">
                  <i className="bi bi-shield-check"></i>
                </div>
                <h3 className="fw-extrabold text-dark mb-1">Verify Your Account</h3>
                <p className="text-muted small mb-0">
                  We sent a 6-digit verification code to<br />
                  <strong className="text-dark">{email || 'your email'}</strong>
                </p>
              </div>

              {/* Development Mode Demo OTP Display */}
              {otpParam && (
                <div className="p-3 bg-warning bg-opacity-15 border border-warning border-opacity-30 rounded-3 mb-4 text-center">
                  <div className="fw-bold text-dark small mb-1 d-flex align-items-center justify-content-center gap-1">
                    <i className="bi bi-code-square text-warning"></i> Development Demo OTP Code:
                  </div>
                  <div className="fs-2 fw-extrabold tracking-widest text-dark my-1">{otpParam}</div>
                  <small className="text-muted d-block fs-7">Auto-filled for rapid demo testing</small>
                </div>
              )}

              <ToastMessage type="danger" message={error} onClose={() => setError('')} />
              <ToastMessage type="success" message={success} />

              <form onSubmit={handleVerify}>
                <div className="mb-4 text-center">
                  <label className="form-label fw-semibold small text-muted d-block mb-2">Enter 6-Digit OTP Code</label>
                  <input
                    type="text"
                    className="form-control form-control-lg text-center fw-extrabold fs-2 tracking-widest border-2 shadow-none text-dark"
                    maxLength="6"
                    placeholder="123456"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-qc-emerald w-100 btn-lg shadow-md fw-bold" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Verifying Code...
                    </>
                  ) : (
                    <>
                      Verify & Proceed to Sign In <i className="bi bi-arrow-right ms-1"></i>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/api';
import ToastMessage from '../components/ToastMessage';

// Preset avatar options for quick selection
const AVATAR_PRESETS = [
  { id: 1, label: 'Pro Athlete', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150' },
  { id: 2, label: 'Sport Champion', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
  { id: 3, label: 'Courts Enthusiast', url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150' },
  { id: 4, label: 'Fitness Star', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
  { id: 5, label: 'Speed Runner', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
  { id: 6, label: 'Badminton Ace', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150' }
];

const Profile = () => {
  const { user, updateUserState } = useAuth();

  const [activeTab, setActiveTab] = useState('personal'); // 'personal', 'security', 'activity'
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  // Avatar option mode: 'gallery', 'camera', 'presets', 'url'
  const [avatarMode, setAvatarMode] = useState('gallery');

  // Password UI states
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // File Input & Camera refs
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [mediaStream, setMediaStream] = useState(null);
  const [cameraError, setCameraError] = useState('');

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setAvatar(user.avatar || '');
    }
  }, [user]);

  // Handle stream attach to video element when camera modal is active
  useEffect(() => {
    if (showCameraModal && mediaStream && videoRef.current) {
      videoRef.current.srcObject = mediaStream;
    }
  }, [showCameraModal, mediaStream]);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [mediaStream]);

  // Handle Gallery/Local File Upload
  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'danger', text: 'Selected image is too large. Please choose an image under 5MB.' });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result);
      setMessage({ type: 'success', text: 'Image uploaded from gallery! Click "Save Changes" to apply.' });
    };
    reader.readAsDataURL(file);
  };

  // Start Webcam
  const startCamera = async () => {
    setCameraError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 400 }, height: { ideal: 400 }, facingMode: 'user' }
      });
      setMediaStream(stream);
      setShowCameraModal(true);
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraError('Could not access camera. Please allow camera permissions or choose from gallery.');
      setMessage({ type: 'danger', text: 'Camera permission denied or camera not found.' });
    }
  };

  // Stop Webcam
  const stopCamera = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
    }
    setShowCameraModal(false);
  };

  // Capture Photo Snapshot
  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 320;
      canvas.height = video.videoHeight || 320;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setAvatar(dataUrl);
      stopCamera();
      setMessage({ type: 'success', text: 'Photo captured! Click "Save Changes" to apply.' });
    }
  };

  // Password strength check helper
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: 'bg-secondary' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { score: 33, label: 'Weak', color: 'bg-danger' };
    if (score <= 4) return { score: 66, label: 'Good', color: 'bg-warning' };
    return { score: 100, label: 'Strong', color: 'bg-success' };
  };

  const strength = getPasswordStrength(newPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (activeTab === 'security' && newPassword && !currentPassword) {
      setMessage({ type: 'danger', text: 'Please enter your current password to verify identity.' });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        full_name: fullName,
        avatar,
        current_password: currentPassword,
        new_password: newPassword
      };

      const res = await updateProfile(payload);
      if (res.data && res.data.user) {
        updateUserState(res.data.user);
      }
      setMessage({ type: 'success', text: res.data.message || 'Profile updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.error || 'Failed to update profile.' });
    } finally {
      setLoading(false);
    }
  };

  const defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';

  return (
    <div className="py-4 py-md-5">
      <div className="container">
        {/* Toast Notification */}
        {message && (
          <div className="mb-4">
            <ToastMessage type={message.type} message={message.text} onClose={() => setMessage(null)} />
          </div>
        )}

        {/* Profile Hero Card */}
        <div className="qc-card mb-4 border-0 shadow-lg position-relative overflow-hidden">
          {/* Header Cover Banner */}
          <div
            style={{
              height: '140px',
              background: 'linear-gradient(135deg, #0b132b 0%, #1c2541 60%, #10b981 100%)',
              position: 'relative'
            }}
          >
            <div
              className="position-absolute w-100 h-100"
              style={{
                background: 'radial-gradient(circle at right, rgba(16,185,129,0.2) 0%, transparent 70%)',
                pointerEvents: 'none'
              }}
            />
          </div>

          <div className="px-4 pb-4">
            <div className="d-flex flex-column flex-md-row align-items-center align-items-md-end gap-3" style={{ marginTop: '-50px' }}>
              {/* Avatar Preview */}
              <div className="position-relative">
                <img
                  src={avatar || defaultAvatar}
                  onError={(e) => { e.target.src = defaultAvatar; }}
                  alt={fullName}
                  className="rounded-circle border border-4 border-white shadow-lg bg-white"
                  width="110"
                  height="110"
                  style={{ objectFit: 'cover' }}
                />
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('personal');
                    fileInputRef.current?.click();
                  }}
                  className="position-absolute bottom-0 end-0 bg-emerald text-white rounded-circle border-0 p-1 d-flex align-items-center justify-content-center shadow"
                  style={{ width: '32px', height: '32px', background: '#10b981', cursor: 'pointer' }}
                  title="Change profile picture"
                >
                  <i className="bi bi-camera-fill text-white fs-6"></i>
                </button>
              </div>

              {/* User Identity Info */}
              <div className="flex-grow-1 text-center text-md-start mt-2 mt-md-0">
                <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-start gap-2 mb-1">
                  <h2 className="fw-bold mb-0 text-dark">{user?.full_name || fullName}</h2>
                  <span
                    className={`badge ${
                      user?.role === 'admin'
                        ? 'bg-danger'
                        : user?.role === 'owner'
                        ? 'bg-primary'
                        : 'bg-success'
                    } rounded-pill px-3 py-1 text-uppercase fw-semibold`}
                    style={{ fontSize: '0.75rem' }}
                  >
                    <i className={`bi ${user?.role === 'admin' ? 'bi-shield-check' : user?.role === 'owner' ? 'bi-building' : 'bi-person-check'} me-1`}></i>
                    {user?.role} Account
                  </span>
                </div>
                <p className="text-muted small mb-0 d-flex align-items-center justify-content-center justify-content-md-start gap-3">
                  <span><i className="bi bi-envelope-fill me-1 text-emerald"></i>{user?.email}</span>
                  <span>•</span>
                  <span><i className="bi bi-shield-lock-fill me-1 text-primary"></i>ID: QC-00{user?.id}</span>
                </p>
              </div>

              {/* Role Shortcut Button */}
              <div className="mt-3 mt-md-0">
                {user?.role === 'owner' ? (
                  <Link to="/owner/dashboard" className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-semibold">
                    <i className="bi bi-speedometer2 me-1"></i> Owner Dashboard
                  </Link>
                ) : user?.role === 'admin' ? (
                  <Link to="/admin/dashboard" className="btn btn-sm btn-outline-danger rounded-pill px-3 fw-semibold">
                    <i className="bi bi-shield-lock me-1"></i> Admin Console
                  </Link>
                ) : (
                  <Link to="/my-bookings" className="btn btn-sm btn-qc-outline rounded-pill px-3 fw-semibold">
                    <i className="bi bi-calendar-check me-1"></i> My Bookings
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Settings Tabs Card */}
        <div className="row g-4">
          {/* Navigation Side Tabs */}
          <div className="col-lg-3">
            <div className="qc-card p-3 border-0 shadow-sm">
              <div className="nav flex-column nav-pills custom-profile-tabs gap-2">
                <button
                  type="button"
                  className={`nav-link text-start rounded-3 d-flex align-items-center gap-3 p-3 fw-semibold transition-all ${
                    activeTab === 'personal' ? 'active bg-emerald text-white shadow-sm' : 'text-dark hover-bg-light'
                  }`}
                  onClick={() => setActiveTab('personal')}
                >
                  <i className="bi bi-person-lines-fill fs-5"></i>
                  <div>
                    <div>Personal Info</div>
                    <small className={`fw-normal d-block ${activeTab === 'personal' ? 'text-white-50' : 'text-muted'}`}>Name & Photo</small>
                  </div>
                </button>

                <button
                  type="button"
                  className={`nav-link text-start rounded-3 d-flex align-items-center gap-3 p-3 fw-semibold transition-all ${
                    activeTab === 'security' ? 'active bg-emerald text-white shadow-sm' : 'text-dark hover-bg-light'
                  }`}
                  onClick={() => setActiveTab('security')}
                >
                  <i className="bi bi-shield-lock-fill fs-5"></i>
                  <div>
                    <div>Security & Password</div>
                    <small className={`fw-normal d-block ${activeTab === 'security' ? 'text-white-50' : 'text-muted'}`}>Credentials & Safety</small>
                  </div>
                </button>

                <button
                  type="button"
                  className={`nav-link text-start rounded-3 d-flex align-items-center gap-3 p-3 fw-semibold transition-all ${
                    activeTab === 'activity' ? 'active bg-emerald text-white shadow-sm' : 'text-dark hover-bg-light'
                  }`}
                  onClick={() => setActiveTab('activity')}
                >
                  <i className="bi bi-person-badge-fill fs-5"></i>
                  <div>
                    <div>Account Status</div>
                    <small className={`fw-normal d-block ${activeTab === 'activity' ? 'text-white-50' : 'text-muted'}`}>Role & Permissions</small>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Form Content Area */}
          <div className="col-lg-9">
            <div className="qc-card p-4 p-md-5 border-0 shadow-sm">
              <form onSubmit={handleSubmit}>
                {/* TAB 1: PERSONAL INFO */}
                {activeTab === 'personal' && (
                  <div>
                    <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-4">
                      <div>
                        <h4 className="fw-bold mb-1 text-dark">Personal Information</h4>
                        <p className="text-muted small mb-0">Update your display name and profile picture avatar.</p>
                      </div>
                      <span className="badge bg-light text-dark border px-3 py-2">
                        <i className="bi bi-pencil-square me-1 text-emerald"></i> Edit Mode
                      </span>
                    </div>

                    {/* Full Name */}
                    <div className="mb-4">
                      <label className="form-label fw-semibold text-dark">Full Name</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light text-muted border-end-0">
                          <i className="bi bi-person-fill"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control border-start-0 ps-0"
                          placeholder="Enter your full name"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Email (Read Only) */}
                    <div className="mb-4">
                      <label className="form-label fw-semibold text-dark">
                        Email Address <span className="badge bg-success-subtle text-success small ms-2"><i className="bi bi-check-circle-fill me-1"></i>Verified</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light text-muted border-end-0">
                          <i className="bi bi-envelope-fill"></i>
                        </span>
                        <input
                          type="email"
                          className="form-control border-start-0 ps-0 bg-light"
                          value={user?.email || ''}
                          disabled
                          readOnly
                        />
                      </div>
                    </div>

                    {/* Hidden File Input for Gallery Selection */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      className="d-none"
                      onChange={handleFileUpload}
                    />

                    {/* Profile Picture Upload Options */}
                    <div className="mb-4">
                      <label className="form-label fw-semibold text-dark mb-2">Profile Picture Options</label>

                      {/* Mode Selector Buttons */}
                      <div className="d-flex flex-wrap gap-2 mb-3">
                        <button
                          type="button"
                          className={`btn btn-sm px-3 fw-semibold ${
                            avatarMode === 'gallery' ? 'btn-emerald text-white' : 'btn-outline-secondary'
                          }`}
                          onClick={() => {
                            setAvatarMode('gallery');
                            fileInputRef.current?.click();
                          }}
                        >
                          <i className="bi bi-folder-fill me-1"></i> Choose from Gallery
                        </button>

                        <button
                          type="button"
                          className={`btn btn-sm px-3 fw-semibold ${
                            avatarMode === 'camera' ? 'btn-emerald text-white' : 'btn-outline-secondary'
                          }`}
                          onClick={() => {
                            setAvatarMode('camera');
                            startCamera();
                          }}
                        >
                          <i className="bi bi-camera-fill me-1"></i> Take Photo
                        </button>

                        <button
                          type="button"
                          className={`btn btn-sm px-3 fw-semibold ${
                            avatarMode === 'presets' ? 'btn-emerald text-white' : 'btn-outline-secondary'
                          }`}
                          onClick={() => setAvatarMode('presets')}
                        >
                          <i className="bi bi-grid-fill me-1"></i> Sports Avatars
                        </button>

                        <button
                          type="button"
                          className={`btn btn-sm px-3 fw-semibold ${
                            avatarMode === 'url' ? 'btn-emerald text-white' : 'btn-outline-secondary'
                          }`}
                          onClick={() => setAvatarMode('url')}
                        >
                          <i className="bi bi-link-45deg me-1"></i> Web URL
                        </button>
                      </div>

                      {/* Action Box based on Selected Mode */}
                      <div className="p-3 border rounded-3 bg-light">
                        {avatarMode === 'gallery' && (
                          <div className="text-center py-3">
                            <div className="mb-2 text-emerald">
                              <i className="bi bi-cloud-arrow-up-fill fs-1"></i>
                            </div>
                            <h6 className="fw-bold mb-1">Select Photo from Your Device</h6>
                            <p className="text-muted small mb-3">Supports JPG, PNG, WEBP (Max size: 5MB)</p>
                            <button
                              type="button"
                              className="btn btn-qc-emerald btn-sm px-4 fw-semibold"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <i className="bi bi-image me-1"></i> Open File Picker
                            </button>
                          </div>
                        )}

                        {avatarMode === 'camera' && (
                          <div className="text-center py-3">
                            <div className="mb-2 text-primary">
                              <i className="bi bi-camera-video-fill fs-1"></i>
                            </div>
                            <h6 className="fw-bold mb-1">Take Live Photo via Webcam</h6>
                            <p className="text-muted small mb-3">Snap a new photo directly using your device camera.</p>
                            <button
                              type="button"
                              className="btn btn-primary btn-sm px-4 fw-semibold"
                              onClick={startCamera}
                            >
                              <i className="bi bi-camera-fill me-1"></i> Launch Camera
                            </button>
                          </div>
                        )}

                        {avatarMode === 'presets' && (
                          <div>
                            <div className="small fw-semibold text-muted mb-2">Select a Sports Character:</div>
                            <div className="row g-3">
                              {AVATAR_PRESETS.map((preset) => {
                                const isSelected = avatar === preset.url;
                                return (
                                  <div key={preset.id} className="col-4 col-sm-2">
                                    <div
                                      onClick={() => setAvatar(preset.url)}
                                      className={`text-center p-2 rounded-3 cursor-pointer border transition-all ${
                                        isSelected
                                          ? 'border-emerald bg-emerald-soft shadow-sm ring-2'
                                          : 'border-light-subtle hover-border-emerald bg-white'
                                      }`}
                                      style={{ cursor: 'pointer' }}
                                    >
                                      <img
                                        src={preset.url}
                                        alt={preset.label}
                                        className="rounded-circle mb-1"
                                        width="48"
                                        height="48"
                                        style={{ objectFit: 'cover' }}
                                      />
                                      <div className="text-truncate small fw-semibold text-dark" style={{ fontSize: '0.72rem' }}>
                                        {preset.label}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {avatarMode === 'url' && (
                          <div>
                            <label className="form-label fw-semibold text-dark small">Paste External Image Link</label>
                            <div className="input-group">
                              <span className="input-group-text bg-white text-muted border-end-0">
                                <i className="bi bi-link-45deg"></i>
                              </span>
                              <input
                                type="url"
                                className="form-control border-start-0 ps-0"
                                placeholder="https://example.com/my-photo.jpg"
                                value={avatar}
                                onChange={(e) => setAvatar(e.target.value)}
                              />
                              {avatar && (
                                <button
                                  type="button"
                                  className="btn btn-outline-secondary"
                                  onClick={() => setAvatar('')}
                                  title="Clear URL"
                                >
                                  <i className="bi bi-x-lg"></i>
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: SECURITY & PASSWORD */}
                {activeTab === 'security' && (
                  <div>
                    <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-4">
                      <div>
                        <h4 className="fw-bold mb-1 text-dark">Security Settings</h4>
                        <p className="text-muted small mb-0">Change your password to keep your account safe.</p>
                      </div>
                      <span className="badge bg-light text-dark border px-3 py-2">
                        <i className="bi bi-key-fill me-1 text-emerald"></i> Password Manager
                      </span>
                    </div>

                    {/* Current Password */}
                    <div className="mb-4">
                      <label className="form-label fw-semibold text-dark">Current Password</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light text-muted border-end-0">
                          <i className="bi bi-lock-fill"></i>
                        </span>
                        <input
                          type={showCurrentPass ? 'text' : 'password'}
                          className="form-control border-start-0 border-end-0 ps-0"
                          placeholder="Enter current password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          className="btn btn-light border border-start-0 text-muted"
                          onClick={() => setShowCurrentPass(!showCurrentPass)}
                        >
                          <i className={`bi ${showCurrentPass ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold text-dark">New Password</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light text-muted border-end-0">
                          <i className="bi bi-key-fill"></i>
                        </span>
                        <input
                          type={showNewPass ? 'text' : 'password'}
                          className="form-control border-start-0 border-end-0 ps-0"
                          placeholder="Enter new password (min 6 characters)"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          className="btn btn-light border border-start-0 text-muted"
                          onClick={() => setShowNewPass(!showNewPass)}
                        >
                          <i className={`bi ${showNewPass ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
                        </button>
                      </div>

                      {/* Strength meter bar */}
                      {newPassword && (
                        <div className="mt-2">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <span className="small text-muted">Password Strength:</span>
                            <span className={`small fw-bold ${strength.color.replace('bg-', 'text-')}`}>
                              {strength.label}
                            </span>
                          </div>
                          <div className="progress" style={{ height: '6px' }}>
                            <div
                              className={`progress-bar ${strength.color} transition-all`}
                              role="progressbar"
                              style={{ width: `${strength.score}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 3: ACCOUNT STATUS & DETAILS */}
                {activeTab === 'activity' && (
                  <div>
                    <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-4">
                      <div>
                        <h4 className="fw-bold mb-1 text-dark">Account Overview</h4>
                        <p className="text-muted small mb-0">System roles, verification status, and permissions.</p>
                      </div>
                      <span className="badge bg-light text-dark border px-3 py-2">
                        <i className="bi bi-shield-check me-1 text-emerald"></i> Active Account
                      </span>
                    </div>

                    <div className="row g-3 mb-4">
                      <div className="col-md-6">
                        <div className="p-3 border rounded-3 bg-light d-flex align-items-center gap-3">
                          <div className="p-3 bg-white rounded-circle text-primary shadow-sm">
                            <i className="bi bi-person-badge fs-4"></i>
                          </div>
                          <div>
                            <span className="text-muted small d-block">Account Type</span>
                            <h6 className="fw-bold mb-0 text-capitalize">{user?.role || 'User'}</h6>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="p-3 border rounded-3 bg-light d-flex align-items-center gap-3">
                          <div className="p-3 bg-white rounded-circle text-success shadow-sm">
                            <i className="bi bi-shield-check fs-4"></i>
                          </div>
                          <div>
                            <span className="text-muted small d-block">OTP Verification</span>
                            <h6 className="fw-bold mb-0 text-success">Verified & Active</h6>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 border rounded-3 bg-white mb-4">
                      <h6 className="fw-bold text-dark mb-2"><i className="bi bi-info-circle text-emerald me-2"></i>Permissions Overview</h6>
                      <ul className="list-unstyled mb-0 text-muted small space-y-2">
                        <li className="mb-1"><i className="bi bi-check2-circle me-2 text-success"></i>Book court slots across all verified local sports venues.</li>
                        <li className="mb-1"><i className="bi bi-check2-circle me-2 text-success"></i>Manage future court reservations and simulate payments.</li>
                        {user?.role === 'owner' && (
                          <li className="mb-1"><i className="bi bi-check2-circle me-2 text-success"></i>List facilities, add courts, set hourly rates, and block maintenance slots.</li>
                        )}
                        {user?.role === 'admin' && (
                          <li className="mb-1"><i className="bi bi-check2-circle me-2 text-success"></i>Approve facility listings, manage user bans, and platform analytics.</li>
                        )}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Submit Action Button */}
                {activeTab !== 'activity' && (
                  <div className="d-flex justify-content-end gap-2 pt-3 border-top">
                    <button
                      type="submit"
                      className="btn btn-qc-emerald px-4 shadow-sm fw-semibold d-inline-flex align-items-center gap-2"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          <span>Saving Changes...</span>
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle-fill"></i>
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* WEBCAM CAMERA MODAL */}
      {showCameraModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: 'rgba(11, 19, 43, 0.75)', backdropFilter: 'blur(5px)' }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-navy text-white border-0" style={{ background: '#0b132b' }}>
                <h5 className="modal-title fw-bold text-white d-flex align-items-center gap-2">
                  <i className="bi bi-camera-fill text-emerald"></i> Take Profile Photo
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={stopCamera}
                ></button>
              </div>

              <div className="modal-body text-center p-4 bg-light">
                {cameraError ? (
                  <div className="alert alert-danger mb-0">{cameraError}</div>
                ) : (
                  <div>
                    <div
                      className="mx-auto rounded-circle overflow-hidden border border-4 border-emerald shadow mb-3"
                      style={{ width: '240px', height: '240px', background: '#000' }}
                    >
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <p className="text-muted small mb-0">Center your face in the circle preview</p>
                  </div>
                )}
              </div>

              <div className="modal-footer border-0 bg-white justify-content-between">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm px-3"
                  onClick={stopCamera}
                >
                  Cancel
                </button>
                {!cameraError && (
                  <button
                    type="button"
                    className="btn btn-qc-emerald btn-sm px-4 fw-semibold"
                    onClick={capturePhoto}
                  >
                    <i className="bi bi-camera-fill me-1"></i> Capture Photo
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;



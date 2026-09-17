import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/api';
import ToastMessage from '../components/ToastMessage';

const Profile = () => {
  const { user, updateUserState } = useAuth();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const payload = {
        full_name: fullName,
        avatar,
        current_password: currentPassword,
        new_password: newPassword
      };

      const res = await updateProfile(payload);
      updateUserState(res.data.user);
      setMessage({ type: 'success', text: res.data.message || 'Profile updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.error || 'Failed to update profile.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="qc-card p-4 p-md-5">
              <div className="text-center mb-4">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                  alt="avatar"
                  className="rounded-circle border border-3 border-success mb-3 shadow-sm"
                  width="90"
                  height="90"
                  style={{ objectFit: 'cover' }}
                />
                <h3 className="fw-bold text-dark mb-1">{user?.full_name}</h3>
                <span className={`badge ${user?.role === 'admin' ? 'bg-danger' : user?.role === 'owner' ? 'bg-primary' : 'bg-success'} rounded-pill px-3 py-1 text-uppercase`}>
                  {user?.role} Account
                </span>
                <p className="text-muted small mt-2">{user?.email}</p>
              </div>

              {message && (
                <ToastMessage type={message.type} message={message.text} onClose={() => setMessage(null)} />
              )}

              <form onSubmit={handleSubmit}>
                <h6 className="fw-bold mb-3 border-bottom pb-2">Personal Details</h6>

                <div className="mb-3">
                  <label className="form-label fw-semibold small text-muted">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold small text-muted">Avatar Image URL</label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://..."
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                  />
                </div>

                <h6 className="fw-bold mb-3 border-bottom pb-2">Change Password (Optional)</h6>

                <div className="mb-3">
                  <label className="form-label fw-semibold small text-muted">Current Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter current password if changing"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold small text-muted">New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-qc-emerald w-100 shadow-sm" disabled={loading}>
                  {loading ? 'Saving Changes...' : 'Save Profile Changes'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

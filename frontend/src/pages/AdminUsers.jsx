import React, { useState, useEffect } from 'react';
import { fetchAdminUsers, banUser, unbanUser } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ToastMessage from '../components/ToastMessage';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetchAdminUsers({
        search,
        role: roleFilter,
        status: statusFilter
      });
      setUsers(res.data.users || []);
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [roleFilter, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadUsers();
  };

  const handleBanToggle = async (userItem) => {
    try {
      if (userItem.is_banned) {
        await unbanUser(userItem.id);
        setMessage({ type: 'success', text: `User ${userItem.full_name} has been reactivated.` });
      } else {
        if (!window.confirm(`Are you sure you want to ban ${userItem.full_name}? They will be unable to log in.`)) return;
        await banUser(userItem.id);
        setMessage({ type: 'success', text: `User ${userItem.full_name} has been suspended.` });
      }
      loadUsers();
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.error || 'Failed to update user status.' });
    }
  };

  return (
    <div className="py-5">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">User Management & Moderation</h2>
            <p className="text-muted small mb-0">Search registered users, filter roles, and manage access restrictions</p>
          </div>
        </div>

        {message && (
          <ToastMessage type={message.type} message={message.text} onClose={() => setMessage(null)} />
        )}

        {/* Filter Controls */}
        <div className="qc-card p-3 mb-4">
          <form onSubmit={handleSearchSubmit} className="row g-3 align-items-center">
            <div className="col-md-5">
              <input
                type="text"
                className="form-control"
                placeholder="Search user by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <select className="form-select" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                <option value="">All Roles</option>
                <option value="user">User</option>
                <option value="owner">Facility Owner</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="col-md-2">
              <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="banned">Banned</option>
              </select>
            </div>
            <div className="col-md-2">
              <button type="submit" className="btn btn-qc-emerald w-100">
                Search
              </button>
            </div>
          </form>
        </div>

        {loading ? (
          <LoadingSpinner message="Fetching users..." />
        ) : users.length === 0 ? (
          <div className="qc-card p-5 text-center">
            <i className="bi bi-people fs-1 text-muted mb-3 d-block"></i>
            <h5 className="fw-bold">No Users Found</h5>
            <p className="text-muted small">No registered accounts match your current filter parameters.</p>
          </div>
        ) : (
          <div className="qc-card overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Registered Date</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td className="fw-bold text-dark">{u.full_name}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`badge ${u.role === 'admin' ? 'bg-danger' : u.role === 'owner' ? 'bg-primary' : 'bg-success'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${u.is_banned ? 'banned' : 'active'}`}>
                          {u.is_banned ? 'Banned' : 'Active'}
                        </span>
                      </td>
                      <td className="text-muted small">{u.created_at}</td>
                      <td className="text-end">
                        {u.role !== 'admin' && (
                          <button
                            className={`btn btn-sm ${u.is_banned ? 'btn-outline-success' : 'btn-outline-danger'}`}
                            onClick={() => handleBanToggle(u)}
                          >
                            {u.is_banned ? 'Unban User' : 'Ban User'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;

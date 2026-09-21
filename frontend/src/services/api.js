import axios from 'axios';

// Get base URL. On Vercel or local dev, default to relative '/api' so Vercel rewrites and Vite proxy handle requests as same-origin.
// This prevents mobile browsers (iOS Safari, Android Chrome) from blocking cross-site/third-party cookies.
const getBaseURL = () => {
  let envURL = import.meta.env.VITE_API_BASE_URL;
  // If running on Vercel deployment or envURL is not set, use relative '/api' for same-origin proxying
  if (!envURL || (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app'))) {
    return '/api';
  }
  // Remove trailing slashes
  envURL = envURL.replace(/\/+$/, '');
  // If VITE_API_BASE_URL doesn't end with /api, append it so endpoints (e.g. /auth/login) hit /api/auth/login
  if (!envURL.endsWith('/api')) {
    return `${envURL}/api`;
  }
  return envURL;
};

const API = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Auth Services
export const signupUser = (data) => API.post('/auth/signup', data);
export const verifyOTP = (data) => API.post('/auth/verify-otp', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const logoutUser = () => API.post('/auth/logout');
export const getCurrentUser = () => API.get('/auth/me');

// Venues & Courts Services
export const fetchVenues = (params) => API.get('/venues', { params });
export const fetchVenueDetails = (id) => API.get(`/venues/${id}`);
export const fetchCourts = (facilityId) => API.get(`/courts/${facilityId}`);
export const fetchSlots = (courtId, date) => API.get(`/slots/${courtId}`, { params: { date } });

// Bookings & Payments
export const createBooking = (data) => API.post('/bookings', data);
export const fetchUserBookings = () => API.get('/bookings');
export const cancelBooking = (id) => API.put(`/bookings/${id}/cancel`);

// User Profile & Reviews
export const fetchProfile = () => API.get('/profile');
export const updateProfile = (data) => API.put('/profile', data);
export const submitReview = (data) => API.post('/reviews', data);

// Facility Owner Services
export const fetchOwnerDashboard = () => API.get('/owner/dashboard');
export const fetchOwnerFacilities = () => API.get('/owner/facilities');
export const createFacility = (data) => API.post('/owner/facilities', data);
export const updateFacility = (id, data) => API.put(`/owner/facilities/${id}`, data);
export const deleteFacility = (id) => API.delete(`/owner/facilities/${id}`);

export const fetchOwnerCourts = (facilityId) => API.get('/owner/courts', { params: { facility_id: facilityId } });
export const createCourt = (data) => API.post('/owner/courts', data);
export const updateCourt = (id, data) => API.put(`/owner/courts/${id}`, data);
export const deleteCourt = (id) => API.delete(`/owner/courts/${id}`);

export const blockSlot = (data) => API.post('/owner/block-slot', data);
export const fetchOwnerBookings = () => API.get('/owner/bookings');

// Admin Services
export const fetchAdminDashboard = () => API.get('/admin/dashboard');
export const fetchPendingFacilities = () => API.get('/admin/facilities/pending');
export const approveFacility = (id) => API.put(`/admin/facilities/${id}/approve`);
export const rejectFacility = (id, data) => API.put(`/admin/facilities/${id}/reject`, data);

export const fetchAdminUsers = (params) => API.get('/admin/users', { params });
export const banUser = (id) => API.put(`/admin/users/${id}/ban`);
export const unbanUser = (id) => API.put(`/admin/users/${id}/unban`);

export default API;

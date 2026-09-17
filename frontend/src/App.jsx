import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ProtectedRoute, RoleProtectedRoute } from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import OTPVerification from './pages/OTPVerification';
import Venues from './pages/Venues';
import VenueDetails from './pages/VenueDetails';

// User Pages
import Booking from './pages/Booking';
import Payment from './pages/Payment';
import BookingSuccess from './pages/BookingSuccess';
import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile';

// Facility Owner Pages
import OwnerDashboard from './pages/OwnerDashboard';
import OwnerFacilities from './pages/OwnerFacilities';
import AddFacility from './pages/AddFacility';
import EditFacility from './pages/EditFacility';
import OwnerCourts from './pages/OwnerCourts';
import AddCourt from './pages/AddCourt';
import OwnerBookings from './pages/OwnerBookings';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminFacilities from './pages/AdminFacilities';
import AdminUsers from './pages/AdminUsers';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main className="flex-grow-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-otp" element={<OTPVerification />} />
            <Route path="/venues" element={<Venues />} />
            <Route path="/venues/:id" element={<VenueDetails />} />

            {/* Authenticated User Routes */}
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/booking" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
            <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
            <Route path="/booking-success" element={<ProtectedRoute><BookingSuccess /></ProtectedRoute>} />
            <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />

            {/* Facility Owner Routes */}
            <Route path="/owner/dashboard" element={<RoleProtectedRoute allowedRoles={['owner', 'admin']}><OwnerDashboard /></RoleProtectedRoute>} />
            <Route path="/owner/facilities" element={<RoleProtectedRoute allowedRoles={['owner', 'admin']}><OwnerFacilities /></RoleProtectedRoute>} />
            <Route path="/owner/facilities/add" element={<RoleProtectedRoute allowedRoles={['owner', 'admin']}><AddFacility /></RoleProtectedRoute>} />
            <Route path="/owner/facilities/edit/:id" element={<RoleProtectedRoute allowedRoles={['owner', 'admin']}><EditFacility /></RoleProtectedRoute>} />
            <Route path="/owner/courts" element={<RoleProtectedRoute allowedRoles={['owner', 'admin']}><OwnerCourts /></RoleProtectedRoute>} />
            <Route path="/owner/courts/add" element={<RoleProtectedRoute allowedRoles={['owner', 'admin']}><AddCourt /></RoleProtectedRoute>} />
            <Route path="/owner/bookings" element={<RoleProtectedRoute allowedRoles={['owner', 'admin']}><OwnerBookings /></RoleProtectedRoute>} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<RoleProtectedRoute allowedRoles={['admin']}><AdminDashboard /></RoleProtectedRoute>} />
            <Route path="/admin/facilities" element={<RoleProtectedRoute allowedRoles={['admin']}><AdminFacilities /></RoleProtectedRoute>} />
            <Route path="/admin/users" element={<RoleProtectedRoute allowedRoles={['admin']}><AdminUsers /></RoleProtectedRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout & Common
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import RoleGuard from './components/common/RoleGuard';
import DashboardLayout from './components/dashboard/DashboardLayout';
import ErrorBoundary from './components/common/ErrorBoundary';

// Public Pages
import Home from './pages/Home';
import ExploreHotels from './pages/ExploreHotels';
import HotelDetails from './pages/HotelDetails';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Offers from './pages/Offers';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Guest Dashboard Pages
import GuestDashboard from './pages/guest/GuestDashboard';
import MyBookings from './pages/guest/MyBookings';
import BookingDetails from './pages/guest/BookingDetails';
import SavedHotels from './pages/guest/SavedHotels';
import GuestProfile from './pages/guest/GuestProfile';
import GuestServiceRequests from './pages/guest/GuestServiceRequests';

// Staff Dashboard Pages
import StaffDashboard from './pages/staff/StaffDashboard';
import CheckInOutDesk from './pages/staff/CheckInOutDesk';
import RoomStatusManager from './pages/staff/RoomStatusManager';
import HousekeepingTasks from './pages/staff/HousekeepingTasks';

// Manager Dashboard Pages
import ManagerDashboard from './pages/manager/ManagerDashboard';
import ManageHotels from './pages/manager/ManageHotels';
import ManageRooms from './pages/manager/ManageRooms';
import ManagerBookings from './pages/manager/ManagerBookings';

// Admin Dashboard Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import HotelApprovals from './pages/admin/HotelApprovals';
import PaymentMonitoring from './pages/admin/PaymentMonitoring';
import AuditLogs from './pages/admin/AuditLogs';

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col justify-between">
        <Navbar />

        <div className="flex-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<ExploreHotels />} />
            <Route path="/hotels/:id" element={<HotelDetails />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsConditions />} />

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* Guest Dashboard */}
            <Route
              path="/dashboard/guest"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<GuestDashboard />} />
              <Route path="bookings" element={<MyBookings />} />
              <Route path="bookings/:id" element={<BookingDetails />} />
              <Route path="saved" element={<SavedHotels />} />
              <Route path="profile" element={<GuestProfile />} />
              <Route path="services" element={<GuestServiceRequests />} />
            </Route>

            {/* Staff Dashboard */}
            <Route
              path="/dashboard/staff"
              element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={['staff', 'manager', 'admin']}>
                    <DashboardLayout />
                  </RoleGuard>
                </ProtectedRoute>
              }
            >
              <Route index element={<StaffDashboard />} />
              <Route path="desk" element={<CheckInOutDesk />} />
              <Route path="rooms" element={<RoomStatusManager />} />
              <Route path="tasks" element={<HousekeepingTasks />} />
              <Route path="services" element={<GuestServiceRequests />} />
            </Route>

            {/* Manager Dashboard */}
            <Route
              path="/dashboard/manager"
              element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={['manager', 'admin']}>
                    <DashboardLayout />
                  </RoleGuard>
                </ProtectedRoute>
              }
            >
              <Route index element={<ManagerDashboard />} />
              <Route path="hotels" element={<ManageHotels />} />
              <Route path="rooms" element={<ManageRooms />} />
              <Route path="bookings" element={<ManagerBookings />} />
            </Route>

            {/* Admin Dashboard */}
            <Route
              path="/dashboard/admin"
              element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={['admin']}>
                    <DashboardLayout />
                  </RoleGuard>
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="hotels" element={<HotelApprovals />} />
              <Route path="payments" element={<PaymentMonitoring />} />
              <Route path="logs" element={<AuditLogs />} />
            </Route>

            {/* Catch-all 404 Route */}
            <Route
              path="*"
              element={
                <div className="py-24 text-center space-y-4">
                  <h2 className="font-serif text-3xl font-bold">404 - Sanctuary Page Not Found</h2>
                  <p className="text-sm text-slate-500">The page you are looking for has been relocated or does not exist.</p>
                  <a href="/" className="inline-block px-5 py-2.5 rounded-xl bg-gold-500 text-slate-950 font-bold text-xs">
                    Return to Homepage
                  </a>
                </div>
              }
            />
          </Routes>
        </div>

        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;

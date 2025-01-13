// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import CreateAccount from './pages/CreateAccount';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard/Dashboard';
import ProfilePage from './pages/ProfilePage'
import NavigationBar from './components/NavigationBar';

// Admin
import AdminUsers from './pages/Admin/AdminUsers';
import AdminBookings from './pages/Admin/AdminBookings';

function App() {
  return (
    <Router>
      <NavigationBar />
      <div> {/* Padding to avoid overlap with fixed navbar */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<ProfilePage/>} />
          <Route path="/admin/users" element={<AdminUsers/>} />
          <Route path="/admin/bookings" element={<AdminBookings/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

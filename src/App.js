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
import Footer from './components/Footer';

import { AppProvider } from './pages/AppContext';

// Admin
import AdminUsers from './pages/Admin/AdminUsers';
import AdminBookings from './pages/Admin/AdminBookings';

// Instructor
import InstructorBookings from './pages/Instructor/InstructorBookings';

// Customer
import BookLesson from './pages/Customer/BookLesson';
import UserBookings from './pages/Customer/Bookings';

function App() {
  return (
    <AppProvider>
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

            {/* Routes for an Instructor */}
            <Route path="/instructor/bookings" element={<InstructorBookings />} />

            {/* Routes for customer bookings */}
            <Route path="/profile/book-lesson" element={<BookLesson />} />
            <Route path="/profile/details" element={<ProfilePage/>} />
            <Route path="/profile/bookings" element={<UserBookings />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </AppProvider>
  );
}

export default App;

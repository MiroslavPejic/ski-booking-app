import React from 'react';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  return (
    <div className="container mx-auto p-6 pt-24">
      <h2 className="text-3xl font-semibold mb-8 text-center">Admin Dashboard</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
        {/* Admin-specific buttons */}
        <Link to="/admin/users" className="flex justify-center items-center w-full h-48 bg-primary text-white rounded-lg shadow-lg text-xl font-semibold bg-hover transition duration-300">
          Manage Users
        </Link>
        
        <Link to="/admin/bookings" className="flex justify-center items-center w-full h-48 bg-green-600 text-white rounded-lg shadow-lg text-xl font-semibold hover:bg-green-700 transition duration-300">
          Manage Bookings
        </Link>
        
        {/* Add more buttons here if needed */}
      </div>
    </div>
  );
}

export default AdminDashboard;

import React from 'react';
import { Link } from 'react-router-dom';

function CustomerDashboard() {
  return (
    <div className="container mx-auto p-6 pt-24">
      <h2 className="text-3xl font-semibold mb-8 text-center">Customer Dashboard</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
        {/* Admin-specific buttons */}
        <Link to="/profile/book-lesson" className="flex justify-center items-center w-full h-48 bg-primary text-white rounded-lg shadow-lg text-xl font-semibold bg-hover transition duration-300">
          Book lesson
        </Link>
        
        <Link to="/profile/details" className="flex justify-center items-center w-full h-48 bg-green-600 text-white rounded-lg shadow-lg text-xl font-semibold hover:bg-green-700 transition duration-300">
          Manage Profile
        </Link>

        <Link to="/profile/bookings" className="flex justify-center items-center w-full h-48 bg-green-600 text-white rounded-lg shadow-lg text-xl font-semibold hover:bg-green-700 transition duration-300">
          View bookings
        </Link>
        
        {/* Add more buttons here if needed */}
      </div>
    </div>
  );
}

export default CustomerDashboard;

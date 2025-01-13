import React from 'react';

function AdminDashboard() {
  return (
    <div className="w-full lg:col-span-3">
      <h2 className="text-2xl font-semibold mb-4">Admin Section</h2>
      {/* Add admin-specific controls here */}
      <p>As an admin, you can manage all users and bookings.</p>
    </div>
  );
}

export default AdminDashboard;

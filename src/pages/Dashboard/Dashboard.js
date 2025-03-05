import React, { useContext } from 'react';
import AdminDashboard from '../Admin/AdminDashboard';
import InstructorDashboard from '../Instructor/InstructorDashboard';
import CustomerDashboard from '../Customer/CustomerDashboard';

import { AppContext } from '../AppContext';

function Dashboard() {
  const { userRole } = useContext(AppContext);

  return (
    <div className="container mx-auto p-6 pt-24">
      {userRole ? (
        <>
          {userRole === 'admin' && <AdminDashboard />}
          {userRole === 'instructor' && <InstructorDashboard />}
          {userRole === 'customer' && <CustomerDashboard />}
        </>
      ) : (
        <p>Please log in to view and make bookings.</p>
      )}
    </div>
  );
}

export default Dashboard;

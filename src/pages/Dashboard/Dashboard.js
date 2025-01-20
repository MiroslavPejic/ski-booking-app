import React, { useEffect, useState } from 'react';
import supabase from '../../supabaseClient';
import AdminDashboard from './AdminDashboard';
import InstructorDashboard from './InstructorDashboard';
import CustomerDashboard from '../Customer/CustomerDashboard';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('');

  const fetchUserRole = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (error) {
      console.log('Error: ', error);
    } else {
      setRole(data?.role || 'customer');
    }
  };

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user);
    };

    fetchSession();

    supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user);
    });
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserRole(user.id);
    }
  }, [user]);

  return (
    <div className="container mx-auto p-6 pt-24">
      {user ? (
        <>
          {role === 'admin' && <AdminDashboard />}
          {role === 'instructor' && <InstructorDashboard />}
          {role === 'customer' && <CustomerDashboard />}
        </>
      ) : (
        <p>Please log in to view and make bookings.</p>
      )}
    </div>
  );
}

export default Dashboard;

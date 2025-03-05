// src/pages/ProfilePage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';

function ProfilePage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (session) {
        setUser(session.user);
      } else {
        navigate('/login'); // Redirect if not logged in
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: 'url(/path-to-your-background-image.jpg)', // Replace with your background image path
      }}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 max-w-md opacity-90">
        {user ? (
          <>
            <div className="text-center mb-6">
              <div className="w-24 h-24 rounded-full bg-primary mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                {user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <h1 className="text-2xl font-bold text-blue-700">{user.email}</h1>
              <p className="text-sm text-gray-500">Welcome to your profile page</p>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-700">Loading...</p>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import supabase from '../supabaseClient'; // Make sure to import the supabase client

function NavigationBar() {
  const [user, setUser] = useState(null);

  // Fetch session on mount and check if the user is logged in
  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      }
    };

    // Fetch session immediately when the component mounts
    fetchSession();

    // Listen for changes in authentication state (login/logout)
    const authListener = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg z-50 flex items-center justify-between px-8 py-4 text-white">
      <div className="text-2xl font-bold flex items-center">
        <span className="mr-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 10l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V10z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 21V9.414a1 1 0 01.293-.707l3-3a1 1 0 011.414 0l3 3a1 1 0 01.293.707V21"
            />
          </svg>
        </span>
        <Link to="/" className="text-white">
          Ski Resort
        </Link>
      </div>
      
      <div className="flex items-center space-x-6 text-lg">
        {/* Show Profile link if user is logged in */}
        {user && (
          <Link
            to="/dashboard"
            className="hover:bg-blue-700 px-4 py-2 rounded transition duration-300"
          >
            Dashboard
          </Link>
        )}

        {user && (
          <Link
            to="/profile"
            className="hover:bg-blue-700 px-4 py-2 rounded transition duration-300"
          >
            Profile
          </Link>
        )}
        
        {/* Show login or logout button based on user state */}
        {!user ? (
          <Link
            to="/login"
            className="bg-white text-blue-800 px-4 py-2 rounded shadow hover:bg-gray-200 transition duration-300"
          >
            Login
          </Link>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700 transition duration-300"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default NavigationBar;
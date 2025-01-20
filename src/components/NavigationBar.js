import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';

function NavigationBar() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      }
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg z-50 flex items-center justify-between px-8 py-4 text-white">
      <div className="flex items-center justify-between w-full md:w-auto">
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

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white focus:outline-none focus:ring-2 focus:ring-white"
        >
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
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>

      <div
        className={`${
          menuOpen ? 'block' : 'hidden'
        } w-full md:flex md:w-auto md:items-center space-y-4 md:space-y-0 md:space-x-6 text-lg`}
      >
        {user && (
          <>
            <Link
              to="/dashboard"
              className="hover:bg-blue-700 px-4 py-2 rounded transition duration-300 block md:inline"
            >
              Dashboard
            </Link>
          </>
        )}
        {!user ? (
          <Link
            to="/login"
            className="bg-white text-blue-800 px-4 py-2 rounded shadow hover:bg-gray-200 transition duration-300 block md:inline"
          >
            Login
          </Link>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700 transition duration-300 block md:inline"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default NavigationBar;

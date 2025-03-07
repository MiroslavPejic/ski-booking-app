import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import supabase from "../supabaseClient";

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
      setUser(session ? session.user : null);
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-primary shadow-lg z-50 text-white">
      {/* Desktop Navbar */}
      <div className="hidden md:flex justify-between items-center px-8 py-4">
        <Link to="/" className="text-2xl font-bold">Ski Resort</Link>
        <div className="space-x-6 text-lg">
          <Link to="/" className="hover:text-gray-300 transition duration-300">Home</Link>
          {user && (
            <Link to="/dashboard" className="hover:text-gray-300 transition duration-300">Dashboard</Link>
          )}
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
      </div>

      {/* Mobile Navbar */}
      <div className="md:hidden flex justify-between items-center px-6 py-4">
        {/* Empty div to balance spacing */}
        <div><Link to="/" className="text-2xl font-bold">Ski Resort</Link></div>

        {/* Logo (Top-right) */}
        <div className="cursor-pointer" onClick={() => setMenuOpen(!menuOpen)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
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
        </div>
      </div>

      {/* Animated Fullscreen Menu (Mobile) */}
      {menuOpen && (
        
        <motion.div
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed top-0 left-0 w-full h-screen bg-primary text-white flex flex-col items-center justify-center space-y-8 text-2xl"
        >
          <Link to="/" className="hover:text-gray-300 transition duration-300" onClick={() => setMenuOpen(false)}>
            Home
          </Link>

          {user && (
            <Link to="/dashboard" className="hover:text-gray-300 transition duration-300" onClick={() => setMenuOpen(false)}>
              Dashboard
            </Link>
          )}

          {!user ? (
            <Link
              to="/login"
              className="bg-white text-blue-800 px-6 py-3 rounded shadow hover:bg-gray-200 transition duration-300"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-6 py-3 rounded shadow hover:bg-red-700 transition duration-300"
            >
              Logout
            </button>
          )}
        </motion.div>
      )}
    </nav>
  );
}

export default NavigationBar;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient'; // Make sure you import your supabase client
import backgroundImage from '../assets/ski_background.png'; // Ensure the image path is correct

function LandingPage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Fetch session on mount and check if user is logged in
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

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center text-white"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="bg-black bg-opacity-50 p-10 rounded-lg shadow-lg max-w-3xl text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Ski Manager</h1>
        <p className="text-lg mb-6">
          Streamline your ski resort operations with our platform. From managing reservations and 
          tracking customer details to optimizing daily operations, our tools make it easier for 
          you to focus on delivering an exceptional experience on the slopes.
        </p>
        
        {/* Conditionally render login and create account buttons based on user state */}
        {!user && (
          <div className="flex justify-center gap-4">
            <a
              href="/login"
              className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Login
            </a>
            <a
              href="/create-account"
              className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition duration-300"
            >
              Create Account
            </a>
          </div>
        )}

        {/* Redirect to Dashboard if the user is already logged in */}
        {user && (
          <div className="mt-4">
            <a
              href="/dashboard"
              className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Go to Dashboard
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default LandingPage;

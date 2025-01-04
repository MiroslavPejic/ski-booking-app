import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import supabase from '../supabaseClient';
import backgroundImage from '../assets/ski_background_1.png';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize navigate hook

  const handleLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      console.log('Logged in user:', data.user);
      // Redirect to Dashboard after successful login
      navigate('/dashboard');
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }} // Replace with your image path
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 max-w-md opacity-90">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-blue-700">Ski Resort Login</h1>
          <p className="text-sm text-gray-500">Welcome back to the slopes!</p>
        </div>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded mb-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded mb-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <a href="/forgot-password" className="text-blue-500 hover:underline">Forgot Password?</a>
        </div>
        <div className="mt-4 text-center">
          <a href="/create-account" className="text-blue-500 hover:underline">Create Account</a>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

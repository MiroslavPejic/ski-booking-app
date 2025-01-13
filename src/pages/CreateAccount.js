import React, { useState } from 'react';
import supabase from '../supabaseClient';
import backgroundImage from '../assets/ski_background_1.jpg';

function CreateAccount() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState(''); // Add state for the user's name
  const [role, setRole] = useState('customer'); // Default role is 'customer'
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleCreateAccount = async (e) => {
    e.preventDefault();

    // Basic password match check
    if (password !== confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    try {
      // Step 1: Create the user using Supabase Auth
      const { user, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      // Step 2: Insert the user profile into the profiles table
      const { data, error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: user.id, // Use the user's ID from Supabase Auth
            role: role, // Set the role (e.g., 'admin', 'instructor', 'customer')
            name: name, // User's name
          }
        ]);

      if (profileError) {
        setError(profileError.message);
        return;
      }

      // Step 3: Show success message
      setSuccessMessage('Account created successfully! Please check your email to verify.');

    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 max-w-md opacity-90">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-blue-700">Create Account</h1>
          <p className="text-sm text-gray-500">Join us and get started!</p>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}

        <form onSubmit={handleCreateAccount}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded mb-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

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

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded mb-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Create Account
          </button>
        </form>

        <div className="mt-4 text-center">
          <a href="/login" className="text-blue-500 hover:underline">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}

export default CreateAccount;

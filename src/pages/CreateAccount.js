import React, { useState } from 'react';
import backgroundImage from '../assets/ski_background_1.jpg';
import { signUpUser, insertUserProfile } from '../Services/authService';
import supabase from '../supabaseClient';

function CreateAccount() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleCreateAccount = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    try {
      // Step 1: Create the user using Supabase Auth
      const { data, error, message } = await signUpUser(email, password);

      if (error) {
        console.error('SignUp Error: ', error);
        setError(error.message);
        return;
      }

      console.log('Here 1: ', data);
      
      // Step 2: Insert the user profile into the profiles table
      const { error: profileError } = await insertUserProfile(data.user.id, 'customer', name);
      console.log('Profile error: ', profileError);
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
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
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
            className="w-full bg-primary text-white py-3 rounded-lg bg-hover transition duration-300"
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

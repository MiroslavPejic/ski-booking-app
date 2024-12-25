// src/pages/CreateAccount.js
import React, { useState } from 'react';
import supabase from '../supabaseClient';
import backgroundImage from '../assets/ski_background.png';

function CreateAccount() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleCreateAccount = async (e) => {
    e.preventDefault();

    // Basic password match check
    if (password !== confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccessMessage('Account created successfully! Please check your email to verify.');
    }
  };

  return React.createElement(
    'div',
    {
      className: 'flex items-center justify-center min-h-screen bg-cover bg-center',
      style: { backgroundImage: `url(${backgroundImage})` }
    },
    React.createElement(
      'div',
      { className: 'bg-white p-8 rounded-lg shadow-lg w-96 max-w-md opacity-90' },
      React.createElement(
        'div',
        { className: 'text-center mb-4' },
        React.createElement('h1', { className: 'text-3xl font-bold text-blue-700' }, 'Create Account'),
        React.createElement('p', { className: 'text-sm text-gray-500' }, 'Join us and get started!')
      ),
      error && React.createElement('p', { className: 'text-red-500 text-center mb-4' }, error),
      successMessage && React.createElement('p', { className: 'text-green-500 text-center mb-4' }, successMessage),
      React.createElement(
        'form',
        { onSubmit: handleCreateAccount },
        React.createElement('input', {
          type: 'email',
          placeholder: 'Email',
          value: email,
          onChange: (e) => setEmail(e.target.value),
          className: 'w-full p-3 border border-gray-300 rounded mb-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
          required: true
        }),
        React.createElement('input', {
          type: 'password',
          placeholder: 'Password',
          value: password,
          onChange: (e) => setPassword(e.target.value),
          className: 'w-full p-3 border border-gray-300 rounded mb-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
          required: true
        }),
        React.createElement('input', {
          type: 'password',
          placeholder: 'Confirm Password',
          value: confirmPassword,
          onChange: (e) => setConfirmPassword(e.target.value),
          className: 'w-full p-3 border border-gray-300 rounded mb-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
          required: true
        }),
        React.createElement(
          'button',
          {
            type: 'submit',
            className: 'w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300'
          },
          'Create Account'
        )
      ),
      React.createElement(
        'div',
        { className: 'mt-4 text-center' },
        React.createElement(
          'a',
          { href: '/login', className: 'text-blue-500 hover:underline' },
          'Back to Login'
        )
      )
    )
  );
}

export default CreateAccount;

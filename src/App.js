// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import CreateAccount from './pages/CreateAccount';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';

function App() {
  return React.createElement(
    Router,
    null,
    React.createElement(
      Routes,
      null,
      React.createElement(Route, { path: '/login', element: React.createElement(Login) }),
      React.createElement(Route, { path: '/create-account', element: React.createElement(CreateAccount) }),
      React.createElement(Route, { path: '/forgot-password', element: React.createElement(ForgotPassword) }),
      React.createElement(Route, { path: '/dashboard', element: React.createElement(Dashboard) })
    )
  );
}

export default App;

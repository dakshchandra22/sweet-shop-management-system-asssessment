import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import { isAuthenticated } from './utils/auth';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated() ? (
                <Dashboard />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<div>Login Page (To be implemented)</div>} />
          <Route path="/register" element={<div>Register Page (To be implemented)</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


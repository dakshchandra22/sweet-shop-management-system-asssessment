import React, { useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';
import { isAuthenticated } from './utils/auth';

// Protected Route Component
function ProtectedRoute({ children }) {
  const location = useLocation();
  // Use useMemo to prevent re-checking on every render
  const auth = useMemo(() => isAuthenticated(), [location.pathname]);
  
  if (!auth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
}

// Public Route Component (redirects to dashboard if authenticated)
function PublicRoute({ children }) {
  const location = useLocation();
  // Use useMemo to prevent re-checking on every render
  const auth = useMemo(() => isAuthenticated(), [location.pathname]);
  
  if (auth) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
}

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <Navigate to="/dashboard" replace />
            }
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


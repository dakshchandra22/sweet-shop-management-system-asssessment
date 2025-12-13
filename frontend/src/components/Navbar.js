import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, removeToken, getUserRole } from '../utils/auth';

function Navbar() {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(isAuthenticated());
  const [isAdmin, setIsAdmin] = useState(getUserRole() === 'admin');

  // Update auth state when authentication changes
  useEffect(() => {
    const checkAuth = () => {
      setAuthenticated(isAuthenticated());
      setIsAdmin(getUserRole() === 'admin');
    };

    // Check auth on mount
    checkAuth();

    // Listen for custom auth change event
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener('authChange', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener('authChange', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    removeToken();
    localStorage.removeItem('user');
    setAuthenticated(false);
    setIsAdmin(false);
    // Dispatch event to notify other components
    window.dispatchEvent(new Event('authChange'));
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/dashboard">
          Sweet Shop
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {authenticated ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">
                    Dashboard
                  </Link>
                </li>
                {isAdmin && (
                  <li className="nav-item">
                    <span className="nav-link text-warning">Admin</span>
                  </li>
                )}
                <li className="nav-item">
                  <button
                    className="btn btn-outline-light btn-sm ms-2"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;


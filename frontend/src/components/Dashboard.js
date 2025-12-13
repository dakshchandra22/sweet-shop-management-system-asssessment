import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { isAuthenticated } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import SweetCard from './SweetCard';

function Dashboard() {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    fetchSweets();
  }, [navigate]);

  async function fetchSweets() {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/sweets');
      setSweets(response.data);
    } catch (err) {
      setError('Failed to load sweets. Please try again.');
      console.error('Error fetching sweets:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  if (sweets.length === 0) {
    return (
      <div className="container mt-4">
        <div className="alert alert-info" role="alert">
          No sweets available
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">Sweet Shop</h1>
          <div className="row g-4">
            {sweets.map((sweet) => (
              <div key={sweet._id} className="col-md-4 col-sm-6">
                <SweetCard sweet={sweet} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;


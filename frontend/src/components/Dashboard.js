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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (sweets.length === 0) {
    return <div>No sweets available</div>;
  }

  return (
    <div className="dashboard">
      <h1>Sweet Shop</h1>
      <div className="sweets-grid">
        {sweets.map((sweet) => (
          <SweetCard key={sweet._id} sweet={sweet} />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;


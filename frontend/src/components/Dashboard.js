import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { isAuthenticated, getUserRole } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import SweetCard from './SweetCard';
import SearchBar from './SearchBar';
import SweetForm from './SweetForm';

function Dashboard() {
  const [sweets, setSweets] = useState([]);
  const [filteredSweets, setFilteredSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingSweet, setEditingSweet] = useState(null);
  const navigate = useNavigate();
  const isAdmin = getUserRole() === 'admin';

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
      setFilteredSweets(response.data);
    } catch (err) {
      setError('Failed to load sweets. Please try again.');
      console.error('Error fetching sweets:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(filters) {
    try {
      const params = new URLSearchParams();
      if (filters.name) params.append('name', filters.name);
      if (filters.category) params.append('category', filters.category);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

      const queryString = params.toString();
      const url = queryString ? `/sweets/search?${queryString}` : '/sweets';
      const response = await api.get(url);
      setFilteredSweets(response.data);
    } catch (err) {
      console.error('Error searching sweets:', err);
    }
  }

  async function handlePurchase(sweetId) {
    try {
      await api.post(`/sweets/${sweetId}/purchase`, { quantity: 1 });
      await fetchSweets();
      alert('Purchase successful!');
    } catch (err) {
      alert(err.response?.data?.error || 'Purchase failed. Please try again.');
    }
  }

  async function handleDelete(sweetId) {
    if (!window.confirm('Are you sure you want to delete this sweet?')) {
      return;
    }

    try {
      await api.delete(`/sweets/${sweetId}`);
      await fetchSweets();
      alert('Sweet deleted successfully!');
    } catch (err) {
      alert(err.response?.data?.error || 'Delete failed. Please try again.');
    }
  }

  function handleEdit(sweet) {
    setEditingSweet(sweet);
    setShowForm(true);
  }

  function handleFormSuccess() {
    setShowForm(false);
    setEditingSweet(null);
    fetchSweets();
  }

  function handleFormCancel() {
    setShowForm(false);
    setEditingSweet(null);
  }

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="spinner-container">
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

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="dashboard-header">
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              <h1 className="dashboard-title">🍬 Sweet Shop</h1>
              {isAdmin && (
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => {
                    setEditingSweet(null);
                    setShowForm(true);
                  }}
                  style={{ minWidth: '180px', fontWeight: 'bold' }}
                >
                  ➕ Add New Sweet
                </button>
              )}
            </div>
          </div>

          {showForm && (
            <div className="mb-4">
              <div className="card border-primary">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">
                    {editingSweet ? 'Edit Sweet' : 'Add New Sweet'}
                  </h5>
                </div>
                <div className="card-body">
                  <SweetForm
                    sweet={editingSweet}
                    onSuccess={handleFormSuccess}
                    onCancel={handleFormCancel}
                    isAdmin={isAdmin}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="search-container">
            <SearchBar onSearch={handleSearch} />
          </div>

          {filteredSweets.length === 0 && !loading && (
            <div className="empty-state">
              <div className="empty-state-icon">🍭</div>
              <h3>No sweets available</h3>
              <p className="text-muted">Check back later or add some sweets if you're an admin!</p>
            </div>
          )}

          <div className="row g-4">
            {filteredSweets.map((sweet) => (
              <div key={sweet._id} className="col-md-4 col-sm-6">
                <SweetCard
                  sweet={sweet}
                  onPurchase={handlePurchase}
                  isAdmin={isAdmin}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;


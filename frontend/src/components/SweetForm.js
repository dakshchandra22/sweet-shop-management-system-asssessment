import React, { useState, useEffect } from 'react';
import api from '../services/api';

function SweetForm({ sweet, onSuccess, onCancel, isAdmin = false }) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (sweet) {
      setFormData({
        name: sweet.name || '',
        category: sweet.category || '',
        price: sweet.price || '',
        quantity: sweet.quantity || ''
      });
    }
  }, [sweet]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.price || formData.price < 0)
      newErrors.price = 'Price must be a positive number';
    if (!formData.quantity || formData.quantity < 0)
      newErrors.quantity = 'Quantity must be a positive number';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      const data = {
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        quantity: Number(formData.quantity)
      };

      if (sweet) {
        await api.put(`/sweets/${sweet._id}`, data);
      } else {
        await api.post('/sweets', data);
      }

      onSuccess && onSuccess();
    } catch (error) {
      setErrors({ submit: 'Failed to save sweet. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="sweet-form">
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>

      <div>
        <label htmlFor="category">Category:</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          <option value="Indian">Indian</option>
          <option value="Western">Western</option>
        </select>
        {errors.category && <span className="error">{errors.category}</span>}
      </div>

      <div>
        <label htmlFor="price">Price:</label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          min="0"
          required
        />
        {errors.price && <span className="error">{errors.price}</span>}
      </div>

      <div>
        <label htmlFor="quantity">Quantity:</label>
        <input
          type="number"
          id="quantity"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          min="0"
          required
        />
        {errors.quantity && <span className="error">{errors.quantity}</span>}
      </div>

      {errors.submit && <div className="error">{errors.submit}</div>}

      <div className="form-actions">
        <button type="submit" disabled={submitting}>
          {sweet ? 'Update' : 'Create'}
        </button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default SweetForm;


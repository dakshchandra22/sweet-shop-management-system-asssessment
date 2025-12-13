import React, { useState } from 'react';

function SearchBar({ onSearch }) {
  const [filters, setFilters] = useState({
    name: '',
    category: '',
    minPrice: '',
    maxPrice: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onSearch(newFilters);
  };

  const handleClear = () => {
    const clearedFilters = {
      name: '',
      category: '',
      minPrice: '',
      maxPrice: ''
    };
    setFilters(clearedFilters);
    onSearch(clearedFilters);
  };

  return (
    <div>
      <h5 className="mb-3 fw-bold">🔍 Search & Filter</h5>
      <div className="row g-3">
        <div className="col-md-3">
          <label className="form-label small text-muted">Search by Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            placeholder="🔎 Search by name..."
            value={filters.name}
            onChange={handleChange}
          />
        </div>
        
        <div className="col-md-2">
          <label className="form-label small text-muted">Category</label>
          <select
            className="form-select"
            name="category"
            aria-label="Category"
            value={filters.category}
            onChange={handleChange}
          >
            <option value="">All Categories</option>
            <option value="Indian">🍬 Indian</option>
            <option value="Western">🍰 Western</option>
          </select>
        </div>

        <div className="col-md-2">
          <label className="form-label small text-muted">Min Price (₹)</label>
          <input
            type="number"
            className="form-control"
            name="minPrice"
            placeholder="Min"
            aria-label="Min Price"
            value={filters.minPrice}
            onChange={handleChange}
            min="0"
          />
        </div>

        <div className="col-md-2">
          <label className="form-label small text-muted">Max Price (₹)</label>
          <input
            type="number"
            className="form-control"
            name="maxPrice"
            placeholder="Max"
            aria-label="Max Price"
            value={filters.maxPrice}
            onChange={handleChange}
            min="0"
          />
        </div>

        <div className="col-md-3">
          <label className="form-label small text-muted">&nbsp;</label>
          <button className="btn btn-secondary w-100" onClick={handleClear}>
            🗑️ Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;


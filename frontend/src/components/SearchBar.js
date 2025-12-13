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
    <div className="search-bar">
      <input
        type="text"
        name="name"
        placeholder="Search by name..."
        value={filters.name}
        onChange={handleChange}
      />
      
      <select
        name="category"
        aria-label="Category"
        value={filters.category}
        onChange={handleChange}
      >
        <option value="">All Categories</option>
        <option value="Indian">Indian</option>
        <option value="Western">Western</option>
      </select>

      <input
        type="number"
        name="minPrice"
        placeholder="Min Price"
        aria-label="Min Price"
        value={filters.minPrice}
        onChange={handleChange}
      />

      <input
        type="number"
        name="maxPrice"
        placeholder="Max Price"
        aria-label="Max Price"
        value={filters.maxPrice}
        onChange={handleChange}
      />

      <button onClick={handleClear}>Clear</button>
    </div>
  );
}

export default SearchBar;


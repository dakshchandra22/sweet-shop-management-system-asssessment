import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../SearchBar';

describe('SearchBar Component', () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render search input', () => {
    render(<SearchBar onSearch={mockOnSearch} />);

    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
  });

  test('should filter sweets by name', () => {
    render(<SearchBar onSearch={mockOnSearch} />);

    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'Gulab' } });

    expect(mockOnSearch).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Gulab' })
    );
  });

  test('should filter sweets by category', () => {
    render(<SearchBar onSearch={mockOnSearch} />);

    const categorySelect = screen.getByLabelText(/category/i);
    fireEvent.change(categorySelect, { target: { value: 'Indian' } });

    expect(mockOnSearch).toHaveBeenCalledWith(
      expect.objectContaining({ category: 'Indian' })
    );
  });

  test('should filter sweets by price range', () => {
    render(<SearchBar onSearch={mockOnSearch} />);

    const minPriceInput = screen.getByLabelText(/min price/i);
    const maxPriceInput = screen.getByLabelText(/max price/i);

    fireEvent.change(minPriceInput, { target: { value: '10' } });
    fireEvent.change(maxPriceInput, { target: { value: '100' } });

    expect(mockOnSearch).toHaveBeenCalledWith(
      expect.objectContaining({ minPrice: '10', maxPrice: '100' })
    );
  });

  test('should clear search filters', () => {
    render(<SearchBar onSearch={mockOnSearch} />);

    const clearButton = screen.getByRole('button', { name: /clear/i });
    fireEvent.click(clearButton);

    expect(mockOnSearch).toHaveBeenCalledWith({});
  });
});


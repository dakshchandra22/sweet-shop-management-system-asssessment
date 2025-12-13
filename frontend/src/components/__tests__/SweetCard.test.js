import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SweetCard from '../SweetCard';
import api from '../../services/api';

jest.mock('../../services/api');

describe('SweetCard Component', () => {
  const mockSweet = {
    _id: '1',
    name: 'Gulab Jamun',
    category: 'Indian',
    price: 50,
    quantity: 100
  };

  const mockOnPurchase = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render sweet details', () => {
    render(<SweetCard sweet={mockSweet} onPurchase={mockOnPurchase} />);

    expect(screen.getByText('Gulab Jamun')).toBeInTheDocument();
    expect(screen.getByText('Indian')).toBeInTheDocument();
    expect(screen.getByText('₹50')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  test('should disable purchase button when quantity is zero', () => {
    const sweetWithZeroQuantity = { ...mockSweet, quantity: 0 };
    render(<SweetCard sweet={sweetWithZeroQuantity} onPurchase={mockOnPurchase} />);

    const purchaseButton = screen.getByRole('button', { name: /purchase/i });
    expect(purchaseButton).toBeDisabled();
  });

  test('should enable purchase button when quantity > 0', () => {
    render(<SweetCard sweet={mockSweet} onPurchase={mockOnPurchase} />);

    const purchaseButton = screen.getByRole('button', { name: /purchase/i });
    expect(purchaseButton).not.toBeDisabled();
  });

  test('should call purchase function on button click', () => {
    render(<SweetCard sweet={mockSweet} onPurchase={mockOnPurchase} />);

    const purchaseButton = screen.getByRole('button', { name: /purchase/i });
    fireEvent.click(purchaseButton);

    expect(mockOnPurchase).toHaveBeenCalledWith(mockSweet._id);
  });

  test('should show admin actions for admin users', () => {
    const mockIsAdmin = true;
    render(<SweetCard sweet={mockSweet} onPurchase={mockOnPurchase} isAdmin={mockIsAdmin} />);

    expect(screen.getByText(/edit/i)).toBeInTheDocument();
    expect(screen.getByText(/delete/i)).toBeInTheDocument();
  });

  test('should not show admin actions for regular users', () => {
    render(<SweetCard sweet={mockSweet} onPurchase={mockOnPurchase} isAdmin={false} />);

    expect(screen.queryByText(/edit/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/delete/i)).not.toBeInTheDocument();
  });
});


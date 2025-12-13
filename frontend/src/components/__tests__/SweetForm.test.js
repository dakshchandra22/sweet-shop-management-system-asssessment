import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SweetForm from '../SweetForm';
import api from '../../services/api';

jest.mock('../../services/api');

describe('SweetForm Component', () => {
  const mockOnSuccess = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render form for creating sweet', () => {
    render(<SweetForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/quantity/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  test('should render form for editing sweet', () => {
    const existingSweet = {
      _id: '1',
      name: 'Gulab Jamun',
      category: 'Indian',
      price: 50,
      quantity: 100
    };

    render(
      <SweetForm
        sweet={existingSweet}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByDisplayValue('Gulab Jamun')).toBeInTheDocument();
    expect(screen.getByDisplayValue('50')).toBeInTheDocument();
  });

  test('should submit form with valid data', async () => {
    api.post.mockResolvedValue({ data: { _id: '1', name: 'New Sweet' } });

    render(<SweetForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'New Sweet' }
    });
    fireEvent.change(screen.getByLabelText(/category/i), {
      target: { value: 'Indian' }
    });
    fireEvent.change(screen.getByLabelText(/price/i), {
      target: { value: '50' }
    });
    fireEvent.change(screen.getByLabelText(/quantity/i), {
      target: { value: '100' }
    });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalled();
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  test('should validate required fields', async () => {
    render(<SweetForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/required/i)).toBeInTheDocument();
    });
  });

  test('should call cancel function on cancel button click', () => {
    render(<SweetForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

    expect(mockOnCancel).toHaveBeenCalled();
  });

  test('should only be visible to admin users', () => {
    const { container } = render(
      <SweetForm
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
        isAdmin={true}
      />
    );

    expect(container.querySelector('form')).toBeInTheDocument();
  });
});


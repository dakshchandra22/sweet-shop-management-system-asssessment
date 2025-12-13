import React from 'react';

function SweetCard({ sweet, onPurchase, isAdmin = false, onEdit, onDelete }) {
  const handlePurchase = () => {
    if (sweet.quantity > 0 && onPurchase) {
      onPurchase(sweet._id);
    }
  };

  const getSweetEmoji = (category) => {
    if (category === 'Indian') return '🍬';
    if (category === 'Western') return '🍰';
    return '🍭';
  };

  return (
    <div className="card h-100 sweet-card fade-in" data-testid={`sweet-card-${sweet._id}`}>
      <div className="sweet-image">
        {getSweetEmoji(sweet.category)}
      </div>
      <div className="card-body">
        <h5 className="card-title fw-bold">{sweet.name}</h5>
        <span className="sweet-category">{sweet.category}</span>
        <div className="sweet-price">₹{sweet.price}</div>
        <div className="sweet-quantity">
          <strong>Stock:</strong>{' '}
          <span className={`quantity-badge ${sweet.quantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
            {sweet.quantity > 0 ? `${sweet.quantity} available` : 'Out of stock'}
          </span>
        </div>
        
        <button
          className="btn btn-primary w-100 mb-2"
          onClick={handlePurchase}
          disabled={sweet.quantity === 0}
          aria-label="Purchase"
        >
          {sweet.quantity > 0 ? '🛒 Purchase' : 'Out of Stock'}
        </button>

        {isAdmin && (
          <div className="d-flex gap-2">
            <button 
              className="btn btn-warning flex-fill"
              onClick={() => onEdit && onEdit(sweet)}
            >
              ✏️ Edit
            </button>
            <button 
              className="btn btn-danger flex-fill"
              onClick={() => onDelete && onDelete(sweet._id)}
            >
              🗑️ Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SweetCard;


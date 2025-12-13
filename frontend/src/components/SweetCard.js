import React from 'react';

function SweetCard({ sweet, onPurchase, isAdmin = false, onEdit, onDelete }) {
  const handlePurchase = () => {
    if (sweet.quantity > 0 && onPurchase) {
      onPurchase(sweet._id);
    }
  };

  return (
    <div className="card h-100" data-testid={`sweet-card-${sweet._id}`}>
      <div className="card-body">
        <h5 className="card-title">{sweet.name}</h5>
        <p className="card-text">
          <strong>Category:</strong> {sweet.category}
        </p>
        <p className="card-text">
          <strong>Price:</strong> ₹{sweet.price}
        </p>
        <p className="card-text">
          <strong>Quantity:</strong> {sweet.quantity}
        </p>
        
        <button
          className="btn btn-primary w-100 mb-2"
          onClick={handlePurchase}
          disabled={sweet.quantity === 0}
          aria-label="Purchase"
        >
          Purchase
        </button>

        {isAdmin && (
          <div className="d-flex gap-2">
            <button 
              className="btn btn-warning flex-fill"
              onClick={() => onEdit && onEdit(sweet)}
            >
              Edit
            </button>
            <button 
              className="btn btn-danger flex-fill"
              onClick={() => onDelete && onDelete(sweet._id)}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SweetCard;


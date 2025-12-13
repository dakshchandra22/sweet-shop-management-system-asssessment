import React from 'react';

function SweetCard({ sweet, onPurchase, isAdmin = false, onEdit, onDelete }) {
  const handlePurchase = () => {
    if (sweet.quantity > 0 && onPurchase) {
      onPurchase(sweet._id);
    }
  };

  return (
    <div className="sweet-card" data-testid={`sweet-card-${sweet._id}`}>
      <h3>{sweet.name}</h3>
      <p>Category: {sweet.category}</p>
      <p>Price: ₹{sweet.price}</p>
      <p>Quantity: {sweet.quantity}</p>
      
      <button
        onClick={handlePurchase}
        disabled={sweet.quantity === 0}
        aria-label="Purchase"
      >
        Purchase
      </button>

      {isAdmin && (
        <div className="admin-actions">
          <button onClick={() => onEdit && onEdit(sweet)}>Edit</button>
          <button onClick={() => onDelete && onDelete(sweet._id)}>Delete</button>
        </div>
      )}
    </div>
  );
}

export default SweetCard;


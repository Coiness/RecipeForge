import React from 'react';
import './index.css';

const InventoryItem = ({ item }) => {
  return (
    <div className="inventory-item">
      <h3>{item.name}</h3>
      <p>Quantity: {item.quantity}</p>
      <p>Status: {item.status}</p>
    </div>
  );
};

export default InventoryItem;
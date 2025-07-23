import React from 'react';
import { useSelector } from 'react-redux';
import './index.css';

const StockTracker = () => {
  const inventory = useSelector((state) => state.inventory.items);
  const lowStockThreshold = 5;

  return (
    <div className="stock-tracker">
      <h2>库存跟踪</h2>
      <ul>
        {inventory.map((item) => (
          <li key={item.id} className={item.quantity < lowStockThreshold ? 'low-stock' : ''}>
            {item.name}: {item.quantity}
            {item.quantity < lowStockThreshold && <span className="warning"> - 库存不足!</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StockTracker;
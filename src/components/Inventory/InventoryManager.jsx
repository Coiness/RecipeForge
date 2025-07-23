import React, { useState } from 'react';
import './index.css';
import { useDispatch, useSelector } from 'react-redux';
import { addItem, removeItem, updateItem } from '../../store/inventorySlice';

function InventoryManager() {
  const dispatch = useDispatch();
  const inventory = useSelector((state) => state.inventory.items);
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState(0);
  const [editingItemId, setEditingItemId] = useState(null);

  const handleAddItem = () => {
    if (itemName && itemQuantity > 0) {
      dispatch(addItem({ 
        id: Date.now(), 
        name: itemName, 
        quantity: itemQuantity 
      }));
      setItemName('');
      setItemQuantity(0);
    }
  };

  const handleUpdateItem = (id) => {
    if (itemName && itemQuantity > 0) {
      dispatch(updateItem({ id, name: itemName, quantity: itemQuantity }));
      setItemName('');
      setItemQuantity(0);
      setEditingItemId(null);
    }
  };

  const handleRemoveItem = (id) => {
    dispatch(removeItem({ id }));
  };

  return (
    <div className="inventory-manager">
      <h2>Inventory Manager</h2>
      
      <div className="inventory-form">
        <div className="form-group">
          <label htmlFor="item-name">Item Name</label>
          <input
            id="item-name"
            type="text"
            placeholder="Enter item name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="item-quantity">Quantity</label>
          <input
            id="item-quantity"
            type="number"
            placeholder="Enter quantity"
            value={itemQuantity}
            onChange={(e) => setItemQuantity(Number(e.target.value))}
          />
        </div>
        <button 
          className={editingItemId ? 'update' : ''}
          onClick={editingItemId ? () => handleUpdateItem(editingItemId) : handleAddItem}
        >
          {editingItemId ? 'Update Item' : 'Add Item'}
        </button>
      </div>

      <div className="inventory-list">
        <h3>Current Inventory</h3>
        {inventory.length === 0 ? (
          <div className="inventory-empty">
            <p>No items in inventory. Add some items to get started!</p>
          </div>
        ) : (
          <ul>
            {inventory.map((item) => (
              <li key={item.id}>
                <div className="inventory-item-info">
                  <h4 className="inventory-item-name">{item.name}</h4>
                  <span className="inventory-item-quantity">{item.quantity}</span>
                </div>
                <div className="inventory-item-actions">
                  <button 
                    className="btn-edit"
                    onClick={() => {
                      setEditingItemId(item.id);
                      setItemName(item.name);
                      setItemQuantity(item.quantity);
                    }}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn-remove"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default InventoryManager;
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addInventoryItem, removeInventoryItem, updateInventoryItem } from '../store/inventorySlice';

const useInventory = () => {
  const dispatch = useDispatch();
  const inventory = useSelector((state) => state.inventory.items);
  
  const [inventoryState, setInventoryState] = useState(inventory);

  useEffect(() => {
    setInventoryState(inventory);
  }, [inventory]);

  const addItem = (item) => {
    dispatch(addInventoryItem(item));
  };

  const removeItem = (itemId) => {
    dispatch(removeInventoryItem(itemId));
  };

  const updateItem = (itemId, updatedItem) => {
    dispatch(updateInventoryItem({ itemId, updatedItem }));
  };

  return {
    inventory: inventoryState,
    addItem,
    removeItem,
    updateItem,
  };
};

export default useInventory;
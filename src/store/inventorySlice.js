import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    addItem: (state, action) => {
      state.items.push(action.payload);
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload.id);
    },
    updateItem: (state, action) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    setInventory: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const { addItem, removeItem, updateItem, setInventory } = inventorySlice.actions;

export default inventorySlice.reducer;
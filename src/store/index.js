import { configureStore } from '@reduxjs/toolkit';
import recipeReducer from './recipeSlice';
import inventoryReducer from './inventorySlice';

const store = configureStore({
  reducer: {
    recipes: recipeReducer,
    inventory: inventoryReducer,
  },
});

export default store;
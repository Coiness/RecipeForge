import { configureStore } from '@reduxjs/toolkit';
import {persistStore, persistReducer,persistCombineReducers} from 'redux-persist';
import recipeReducer from './recipeSlice';
import inventoryReducer from './inventorySlice';

const persistConfig = {
  key:'root',
  storage: localStorage, // 使用 localStorage 进行持久化存储
  whitelist: ['recipes', 'inventory'], // 只持久化 recipes 和 inventory
}

const store = configureStore({
  reducer: {
    recipes: recipeReducer,
    inventory: inventoryReducer,
  },
});

export default store;
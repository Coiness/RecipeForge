import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import recipeReducer from './recipeSlice';
import inventoryReducer from './inventorySlice';
import orderReducer from './orderSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['recipes', 'inventory', 'orders'], // 添加 orders 到持久化列表
};

// 合并 reducers
const rootReducer = {
  recipes: recipeReducer,
  inventory: inventoryReducer,
  orders: orderReducer, // 添加订单 reducer
};

// 创建持久化的 reducer
const persistedReducer = persistCombineReducers(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/PAUSE', 'persist/PURGE', 'persist/REGISTER']
      }
    })
});

export const persistor = persistStore(store);
export default store;
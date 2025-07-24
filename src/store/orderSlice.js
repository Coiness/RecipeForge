import { createSlice } from '@reduxjs/toolkit';

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    currentOrder: {
      id: null,
      name: '',
      items: [], // [{ recipeId, recipeName, quantity }]
      status: 'draft', // draft, confirmed, completed
      createdAt: null
    }
  },
  reducers: {
    // 创建新订单
    createNewOrder(state, action) {
      const { name } = action.payload;//解构赋值获得订单名称
      state.currentOrder = {
        id: Date.now().toString(),
        name: name || `订单_${new Date().toLocaleDateString()}`,
        items: [],
        status: 'draft',
        createdAt: new Date().toISOString()
      };
    },
    
    // 添加配方到当前订单
    addRecipeToOrder(state, action) {
      const { recipeId, recipeName, quantity } = action.payload;
      const existingItem = state.currentOrder.items.find(item => item.recipeId === recipeId);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.currentOrder.items.push({
          recipeId,
          recipeName,
          quantity
        });
      }
    },
    
    // 移除订单中的配方
    removeRecipeFromOrder(state, action) {
      const recipeId = action.payload;
      state.currentOrder.items = state.currentOrder.items.filter(
        item => item.recipeId !== recipeId
      );
    },
    
    // 更新订单中配方的数量
    updateRecipeQuantityInOrder(state, action) {
      const { recipeId, quantity } = action.payload;
      const item = state.currentOrder.items.find(item => item.recipeId === recipeId);
      if (item) {
        item.quantity = quantity;
      }
    },
    
    // 保存当前订单
    saveCurrentOrder(state) {
      if (state.currentOrder.items.length > 0) {
        const existingOrderIndex = state.orders.findIndex(
          order => order.id === state.currentOrder.id
        );
        
        if (existingOrderIndex !== -1) {
          state.orders[existingOrderIndex] = { ...state.currentOrder };
        } else {
          state.orders.push({ ...state.currentOrder });
        }
        
        state.currentOrder.status = 'confirmed';
      }
    },
    
    // 加载订单
    loadOrder(state, action) {
      const orderId = action.payload;
      const order = state.orders.find(order => order.id === orderId);
      if (order) {
        state.currentOrder = { ...order };
      }
    },
    
    // 删除订单
    deleteOrder(state, action) {
      const orderId = action.payload;
      state.orders = state.orders.filter(order => order.id !== orderId);
      
      // 如果删除的是当前订单，重置当前订单
      if (state.currentOrder.id === orderId) {
        state.currentOrder = {
          id: null,
          name: '',
          items: [],
          status: 'draft',
          createdAt: null
        };
      }
    },
    
    // 清空当前订单
    clearCurrentOrder(state) {
      state.currentOrder = {
        id: null,
        name: '',
        items: [],
        status: 'draft',
        createdAt: null
      };
    }
  }
});

export const {
  createNewOrder,
  addRecipeToOrder,
  removeRecipeFromOrder,
  updateRecipeQuantityInOrder,
  saveCurrentOrder,
  loadOrder,
  deleteOrder,
  clearCurrentOrder
} = orderSlice.actions;

export default orderSlice.reducer;
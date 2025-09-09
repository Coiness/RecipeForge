import { createItemService } from '../../services/itemService';
import type { Item } from '../../types';
import type { Dispatch } from 'redux';
import store from '../store';
import type { RootState } from '../store';

// rootState 用于获取当前状态
// dispatch 用于分发动作

// 创建服务实例，不再需要传入初始items
const itemService = createItemService();

export const ADD_ITEM = 'ADD_ITEM';
export const UPDATE_ITEM = 'UPDATE_ITEM';
export const DELETE_ITEM = 'DELETE_ITEM';
export const SET_ITEMS = 'SET_ITEMS';
export const ITEM_ERROR = 'ITEM_ERROR';
export const ITEM_LOADING = 'ITEM_LOADING'; 
export const SELECT_ITEM = 'SELECT_ITEM';

export const addItem = (name: string, iconUrl: string = '') => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch({ type: ITEM_LOADING, loading: true });
      
      // 使用服务创建物品对象，但不存储
      const newItem = itemService.createItem(name, iconUrl);
      
      // 通过Redux添加物品
      dispatch({
        type: ADD_ITEM,
        payload: newItem,
        loading: false
      });
      
      return newItem;
    } catch (error) {
      dispatch({
        type: ITEM_ERROR,
        payload: error instanceof Error ? error.message : '添加物品失败',
        loading: false
      });
      
      throw error;
    }
  };
};

export const updateItem = (id: string, updates: Partial<Omit<Item, 'id'>>) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    try {
      dispatch({ type: ITEM_LOADING, loading: true });
      
      // 从Redux获取当前物品列表
      const state = getState();
      const items = state.items.items;
      
      // 查找要更新的物品
      const itemToUpdate = itemService.getItemById(items, id);
      
      if (!itemToUpdate) {
        throw new Error(`物品ID ${id} 不存在`);
      }
      
      // 验证名称唯一性（如果更新了名称）
      if (updates.name && itemService.isNameTaken(items, updates.name, id)) {
        throw new Error(`物品名称 "${updates.name}" 已被使用`);
      }
      
      // 准备更新后的物品
      const updatedItem = itemService.prepareItemUpdate(itemToUpdate, updates);
      
      // 通过Redux更新物品
      dispatch({
        type: UPDATE_ITEM,
        payload: updatedItem,
        loading: false
      });
      
      return updatedItem;
    } catch (error) {
      dispatch({
        type: ITEM_ERROR,
        payload: error instanceof Error ? error.message : '更新物品失败',
        loading: false
      });
      
      throw error;
    }
  };
};

export const deleteItem = (id: string) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    try {
      dispatch({ type: ITEM_LOADING, loading: true });
      
      // 检查物品是否存在
      const state = getState();
      const items = state.items.items;
      
      if (!itemService.itemExists(items, id)) {
        throw new Error(`物品ID ${id} 不存在`);
      }
      
      // 通过Redux删除物品
      dispatch({
        type: DELETE_ITEM,
        payload: { id },
        loading: false
      });
      
      return true;
    } catch (error) {
      dispatch({
        type: ITEM_ERROR,
        payload: error instanceof Error ? error.message : '删除物品失败',
        loading: false
      });
      
      throw error;
    }
  };
};

export const setItems = (items: Item[]) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch({ type: ITEM_LOADING, loading: true });
      
      dispatch({
        type: SET_ITEMS,
        payload: items,
        loading: false
      });
      
      return items;
    } catch (error) {
      dispatch({
        type: ITEM_ERROR,
        payload: error instanceof Error ? error.message : '设置物品列表失败',
        loading: false
      });
      
      throw error;
    }
  };
};

export const setSelectedItem = (item: Item | null) => {
  return {
    type: SELECT_ITEM,
    payload: item
  };
};
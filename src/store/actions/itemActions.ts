import { createItemService } from '../../services/itemService';
import type { Item } from '../../types';
import type { Dispatch } from 'redux';
import store from '../store';


// 初始胡创建服务实例
const initialItems = store.getState().items.items || [];
const itemService = createItemService(initialItems);

export const ADD_ITEM = 'ADD_ITEM';
export const UPDATE_ITEM = 'UPDATE_ITEM'
export const DELETE_ITEM = 'DELETE_ITEM';
export const SET_ITEMS = 'SET_ITEMS';
export const ITEM_ERROR = 'ITEM_ERROR';
export const ITEM_LOADING = 'ITEM_LOADING'; 
export const SELECT_ITEM = 'SELECT_ITEM';

// 使用 loading 标志而不是单独的 action
export const addItem = (name: string, iconUrl: string = '') => {
  return async (dispatch: Dispatch) => {
    try {
      // 发送带有 loading: true 的通知
      dispatch({ type: ITEM_LOADING, loading: true });
      
      const newItem = itemService.createItem(name, iconUrl);
      
      dispatch({
        type: ADD_ITEM,
        payload: newItem,
        loading: false // 操作完成，设置 loading: false
      });
      
      return newItem;
    } catch (error) {
      dispatch({
        type: ITEM_ERROR,
        payload: error instanceof Error ? error.message : '添加物品失败',
        loading: false // 出错也要设置 loading: false
      });
      
      throw error;
    }
  };
};


export const updateItem = (id:string, updates:Partial<Omit<Item,'id'>>) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch({ type: ITEM_LOADING, loading: true });
      
      // 尝试更新服务层，但不依赖其返回值
      try {
        itemService.updateItem(id, updates);
      } catch (serviceError) {
        console.log('服务层更新失败，但会继续Redux更新:', serviceError);
      }
      
      // 直接传递ID和更新内容给reducer
      dispatch({
        type: UPDATE_ITEM,
        payload: { id, updates }, // 只传递ID和更新内容
        loading: false 
      });
      
      // 从 store 中获取更新后的物品
      const state = store.getState();
      const updatedItem = state.items.items.find(item => item.id === id);
      return updatedItem;
    } catch(error) {
      // 错误处理...
    }
  }
}

export const deleteItem = (id:string) => {
    return async (dispatch:Dispatch) =>{
      try{
        dispatch({ type: ITEM_LOADING, loading: true });
        itemService.deleteItem(id);
        dispatch({
          type: DELETE_ITEM,
          payload: { id },
          loading: false 
        });
      }catch(error){
        dispatch({
          type: ITEM_ERROR,
          payload: error instanceof Error ? error.message : '删除物品失败',
          loading: false 
        });
        
        throw error;
      }
    }
}

export const setItems = (items:Item[])=>{
  return async (dispatch:Dispatch)=>{
    try{
      dispatch({ type: ITEM_LOADING, loading: true });
      dispatch({
        type: SET_ITEMS,
        payload: items,
        loading: false 
      });
      return items;
    }catch(error){
      dispatch({
        type: ITEM_ERROR,
        payload: error instanceof Error ? error.message : '设置物品列表失败',
        loading: false 
      });
      
      throw error;
    }
  }
}

export const setSelectedItem = (item:Item|null) =>{
    return {
      type: SELECT_ITEM,
      payload: item
    }
}
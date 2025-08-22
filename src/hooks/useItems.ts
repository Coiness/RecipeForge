import { useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import { 
  addItem, 
  updateItem, 
  deleteItem, 
} from '../store/actions/itemActions';
import type { Item } from '../types';

/**
 * 提供物品管理功能的自定义Hook
 */
export const useItems = () => {
  // 从Redux store获取状态
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector(state => state.items);
  
  // 本地状态，用于跟踪当前选中的物品
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  

  /**
   * 添加新物品
   */
  const createItem = useCallback(async (name: string, iconUrl: string = '') => {
    try {
      const newItem = await dispatch(addItem(name, iconUrl));
      return newItem;
    } catch (error) {
      console.error('添加物品失败:', error);
      throw error;
    }
  }, [dispatch]);
  
  /**
   * 更新物品
   */
  const modifyItem = useCallback(async (id: string, updates: Partial<Omit<Item, 'id'>>) => {
    try {
      const updatedItem = await dispatch(updateItem(id, updates));
      
      // 如果当前选中的是这个物品，更新选中状态
      if (selectedItem?.id === id) {
        setSelectedItem(updatedItem);
      }
      
      return updatedItem;
    } catch (error) {
      console.error('更新物品失败:', error);
      throw error;
    }
  }, [dispatch, selectedItem]);
  
  /**
   * 删除物品
   */
  const removeItem = useCallback(async (id: string) => {
    try {
      await dispatch(deleteItem(id));
      
      // 如果删除的是当前选中的物品，清除选中状态
      if (selectedItem?.id === id) {
        setSelectedItem(null);
      }
    } catch (error) {
      console.error('删除物品失败:', error);
      throw error;
    }
  }, [dispatch, selectedItem]);
  
  /**
   * 搜索物品
   */
  const searchItems = useCallback((query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return items.filter(item =>
      item.name.toLowerCase().includes(lowercaseQuery)
    );
  }, [items]);
  
  /**
   * 选择一个物品
   */
  const selectItem = useCallback((id: string) => {
    const item = items.find(item => item.id === id);
    setSelectedItem(item || null);
    return item;
  }, [items]);
  
  /**
   * 清除当前选中的物品
   */
  const clearSelection = useCallback(() => {
    setSelectedItem(null);
  }, []);
  

  
  // 返回状态和所有操作函数
  return {
    // 状态
    items,
    loading,
    error,
    selectedItem,
    
    // 操作
    createItem,
    modifyItem,
    removeItem,
    searchItems,
    selectItem,
    clearSelection
  };
};
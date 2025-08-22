import { useState, useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import { 
  addRecipe, 
  updateRecipe, 
  deleteRecipe, 
  setRecipes 
} from '../store/actions/recipeActions';
import type { Recipe, Item_For_Recipe } from '../types';

/**
 * 提供配方管理功能的自定义Hook
 */
export const useRecipes = () => {
  // 从Redux store获取状态
  const dispatch = useAppDispatch();
  const { recipes, loading, error } = useAppSelector(state => state.recipes);
  
  // 本地状态，用于跟踪当前选中的配方
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  /**
   * 添加新配方
   */
  const createRecipe = useCallback(async (name: string, input: Item_For_Recipe[], output: Item_For_Recipe[]) => {
    try {
      const newRecipe = await dispatch(addRecipe(name, input, output));
      return newRecipe;
    } catch (error) {
      console.error('添加配方失败:', error);
      throw error;
    }
  }, [dispatch]);
  
  /**
   * 更新配方
   */
  const modifyRecipe = useCallback(async (id: string, updates: Partial<Omit<Recipe, 'id'>>) => {
    try {
      const updatedRecipe = await dispatch(updateRecipe(id, updates));
      
      // 如果当前选中的是这个配方，更新选中状态
      setSelectedRecipe(current => 
        current?.id === id ? updatedRecipe : current
      );
      
      return updatedRecipe;
    } catch (error) {
      console.error('更新配方失败:', error);
      throw error;
    }
  }, [dispatch]);
  
  /**
   * 删除配方
   */
  const removeRecipe = useCallback(async (id: string) => {
    try {
      await dispatch(deleteRecipe(id));
      
      // 如果删除的是当前选中的配方，清除选中状态
      setSelectedRecipe(current => 
        current?.id === id ? null : current
      );
    } catch (error) {
      console.error('删除配方失败:', error);
      throw error;
    }
  }, [dispatch]);
  
  /**
   * 通过ID查找单个配方
   */
  const findRecipe = useCallback((id: string) => {
    return recipes.find(recipe => recipe.id === id) || null;
  }, [recipes]);
  
  /**
   * 通过关键词搜索配方
   */
  const searchRecipes = useCallback((query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return recipes.filter(recipe =>
      recipe.name.toLowerCase().includes(lowercaseQuery)
    );
  }, [recipes]);
  
  /**
   * 根据输入物品查找相关配方
   */
  const findRecipesByInput = useCallback((itemId: string) => {
    return recipes.filter(recipe =>
      recipe.input.some(item => item.item.id === itemId)
    );
  }, [recipes]);
  
  /**
   * 根据输出物品查找相关配方
   */
  const findRecipesByOutput = useCallback((itemId: string) => {
    return recipes.filter(recipe =>
      recipe.output.some(item => item.item.id === itemId)
    );
  }, [recipes]);
  
  /**
   * 选择一个配方
   */
  const selectRecipe = useCallback((id: string) => {
    const recipe = findRecipe(id);
    setSelectedRecipe(recipe);
    return recipe;
  }, [findRecipe]);
  
  /**
   * 清除当前选中的配方
   */
  const clearSelection = useCallback(() => {
    setSelectedRecipe(null);
  }, []);
  
  /**
   * 重置为默认配方列表
   */
  const resetToDefaultRecipes = useCallback(async () => {
    try {
      if (window.confirm('这将会重置所有配方数据。确定要继续吗？')) {
        const defaultRecipes: Recipe[] = [
          // 可以在这里添加一些默认配方
          // 例如：
          // {
          //   id: '1',
          //   name: '铁锭生产',
          //   input: [{ item: { id: '2', name: '铁矿石' }, amount: 1 }],
          //   output: [{ item: { id: '1', name: '铁锭' }, amount: 1 }]
          // }
        ];
        
        await dispatch(setRecipes(defaultRecipes));
        return true;
      }
      return false;
    } catch (error) {
      console.error('重置配方失败:', error);
      return false;
    }
  }, [dispatch]);
  
  /**
   * 导出配方数据
   */
  const exportRecipes = useCallback(() => {
    try {
      const dataStr = JSON.stringify(recipes);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      const exportFileDefaultName = 'recipeforge-recipes.json';
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      return true;
    } catch (error) {
      console.error('导出配方失败:', error);
      return false;
    }
  }, [recipes]);
  
  /**
   * 导入配方数据
   */
  const importRecipes = useCallback(async (jsonData: string) => {
    try {
      const importedRecipes = JSON.parse(jsonData);
      if (!Array.isArray(importedRecipes)) {
        throw new Error('导入的数据不是有效的配方数组');
      }
      
      await dispatch(setRecipes(importedRecipes));
      return true;
    } catch (error) {
      console.error('导入配方失败:', error);
      throw error;
    }
  }, [dispatch]);
  
  // 首次加载时检查是否需要默认配方
  useEffect(() => {
    // 只在配方列表为空时考虑显示创建默认数据的提示
    if (recipes.length === 0 && !loading && !error) {
      console.log('配方列表为空，可以考虑添加一些默认配方');
      // 可以在这里添加逻辑，如显示提示或引导用户创建第一个配方
    }
  }, [recipes, loading, error]);
  
  // 返回状态和所有操作函数
  return {
    // 状态
    recipes,
    loading,
    error,
    selectedRecipe,
    
    // 基本操作
    createRecipe,
    modifyRecipe,
    removeRecipe,
    findRecipe,
    searchRecipes,
    findRecipesByInput,
    findRecipesByOutput,
    selectRecipe,
    clearSelection,
    
    // 高级功能
    resetToDefaultRecipes,
    exportRecipes,
    importRecipes
  };
};
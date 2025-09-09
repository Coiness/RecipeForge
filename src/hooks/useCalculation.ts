import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import {
  calculateRecipeMaterials,
  calculateOrderMaterials,
  calculateBulkOrders,
  checkCircularDependency,
  getRecipeDependencyTree,
  clearCalculationResults,
  setPreferredRecipe,
  clearPreferredRecipe,
  getAvailableRecipesForItem
} from '../store/actions/calculationActions';
import type { Recipe, Order } from '../types';

/**
 * 提供配方计算功能的自定义Hook
 */
export const useCalculation = () => {
  // 从Redux store获取状态
  const dispatch = useAppDispatch();

  const { 
    recipes,
    preferredRecipes,
    materials, 
    currentCalculation,
    circularDependencies,
    dependencyTrees,
    loading, 
    error 
  } = useAppSelector(state => state.calculation);


  /**
   * 计算单个配方所需的原材料
   * @param recipeId 配方ID
   * @param amount 生产数量
   * @returns 计算所需的材料列表
   */
  const calculateMaterialsForRecipe = useCallback(async (recipeId: string, amount: number = 1) => {
    try {
      const materials = await dispatch(calculateRecipeMaterials(recipeId, amount));
      return materials;
    } catch (error) {
      console.error('计算配方材料失败:', error);
      throw error;
    }
  }, [dispatch]);

  /**
   * 计算订单所需的所有材料
   * @param order 需要计算的订单
   * @returns 计算所需的材料列表
   */
  const calculateMaterialsForOrder = useCallback(async (order: Order) => {
    try {
      const materials = await dispatch(calculateOrderMaterials(order));
      return materials;
    } catch (error) {
      console.error('计算订单材料失败:', error);
      throw error;
    }
  }, [dispatch]);

  /**
   * 批量计算多个订单所需的材料
   * @param orders 订单数组
   * @returns 计算所需的材料列表
   */
  const calculateMaterialsForOrders = useCallback(async (orders: Order[]) => {
    try {
      const materials = await dispatch(calculateBulkOrders(orders));
      return materials;
    } catch (error) {
      console.error('批量计算订单材料失败:', error);
      throw error;
    }
  }, [dispatch]);

  /**
   * 检查配方中是否存在循环依赖
   * @param recipe 需要检查的配方
   * @returns 是否存在循环依赖
   */
  const checkRecipeCircularDependency = useCallback(async (recipe: Recipe) => {
    try {
      const hasCircular = await dispatch(checkCircularDependency(recipe));
      return hasCircular;
    } catch (error) {
      console.error('检查循环依赖失败:', error);
      throw error;
    }
  }, [dispatch]);

  /**
   * 获取配方的依赖树结构
   * @param recipeId 配方ID
   * @returns 依赖树结构
   */
  const getRecipeTree = useCallback(async (recipeId: string) => {
    try {
      const dependencyTree = await dispatch(getRecipeDependencyTree(recipeId));
      return dependencyTree;
    } catch (error) {
      console.error('获取依赖树失败:', error);
      throw error;
    }
  }, [dispatch]);

  /**
   * 获取可以制作指定物品的所有配方
   * @param itemId 物品ID
   * @returns 可以生产该物品的配方列表
   */
  const getRecipesForItem = useCallback((itemId: string) => {
    try {
      return dispatch(getAvailableRecipesForItem(itemId));
    } catch (error) {
      console.error('获取物品配方失败:', error);
      throw error;
    }
  }, [dispatch]);

  /**
   * 设置物品的首选制作配方
   * 在多个配方可以制作同一物品时，指定优先使用哪个配方
   * @param itemId 物品ID
   * @param recipeId 配方ID
   */
  const setItemPreferredRecipe = useCallback((itemId: string, recipeId: string) => {
    try {
      dispatch(setPreferredRecipe(itemId, recipeId));
    } catch (error) {
      console.error('设置首选配方失败:', error);
      throw error;
    }
  }, [dispatch]);

  /**
   * 清除物品的首选制作配方
   * @param itemId 物品ID
   */
  const clearItemPreferredRecipe = useCallback((itemId: string) => {
    try {
      dispatch(clearPreferredRecipe(itemId));
    } catch (error) {
      console.error('清除首选配方失败:', error);
      throw error;
    }
  }, [dispatch]);

  /**
   * 清除所有计算结果
   */
  const clearResults = useCallback(() => {
    dispatch(clearCalculationResults());
  }, [dispatch]);

  /**
   * 获取当前物品的首选配方
   * @param itemId 物品ID
   * @returns 首选配方ID，如果没有则返回undefined
   */
  const getPreferredRecipeForItem = useCallback((itemId: string) => {
    return preferredRecipes[itemId];
  }, [preferredRecipes]);

  /**
   * 获取物品是否存在循环依赖
   * @param recipeId 配方ID
   * @returns 是否存在循环依赖
   */
  const hasCircularDependency = useCallback((recipeId: string) => {
    return circularDependencies[recipeId] || false;
  }, [circularDependencies]);

  /**
   * 获取已缓存的依赖树
   * @param recipeId 配方ID
   * @returns 依赖树，如果不存在则返回undefined
   */
  const getCachedDependencyTree = useCallback((recipeId: string) => {
    return dependencyTrees[recipeId];
  }, [dependencyTrees]);

  // 返回状态和所有操作函数
  return {
    // 状态
    loading,
    error,
    recipes,
    materials,
    currentCalculation,
    preferredRecipes,
    circularDependencies,
    dependencyTrees,
        
    // 材料计算
    calculateMaterialsForRecipe,
    calculateMaterialsForOrder,
    calculateMaterialsForOrders,
    
    // 依赖分析
    checkRecipeCircularDependency,
    getRecipeTree,
    hasCircularDependency,
    getCachedDependencyTree,
    
    // 首选配方管理
    getRecipesForItem,
    setItemPreferredRecipe,
    clearItemPreferredRecipe,
    getPreferredRecipeForItem,
    
    // 结果管理
    clearResults
  };
};
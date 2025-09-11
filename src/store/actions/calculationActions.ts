import { createCalculationService } from '../../services/calculationService';
import type { Recipe, Order } from '../../types';
import type { Dispatch } from 'redux';
import type { RootState } from '../store';

// 创建计算服务实例
const calculationService = createCalculationService();

// Action 类型常量
export const CALCULATION_LOADING = 'CALCULATION_LOADING';
export const SET_CALCULATION_RECIPES = 'SET_CALCULATION_RECIPES';
export const CALCULATE_RECIPE_MATERIALS = 'CALCULATE_RECIPE_MATERIALS';
export const CALCULATE_ORDER_MATERIALS = 'CALCULATE_ORDER_MATERIALS';
export const CALCULATE_BULK_ORDERS = 'CALCULATE_BULK_ORDERS';
export const CHECK_CIRCULAR_DEPENDENCY = 'CHECK_CIRCULAR_DEPENDENCY';
export const GET_DEPENDENCY_TREE = 'GET_DEPENDENCY_TREE';
export const CALCULATION_ERROR = 'CALCULATION_ERROR';
export const CLEAR_CALCULATION_RESULTS = 'CLEAR_CALCULATION_RESULTS';
export const SET_PREFERRED_RECIPE = 'SET_PREFERRED_RECIPE';
export const CLEAR_PREFERRED_RECIPE = 'CLEAR_PREFERRED_RECIPE';
export const GET_ITEM_RECIPES = 'GET_ITEM_RECIPES';

/**
 * 获取可以制作指定物品的所有配方
 */
export const getAvailableRecipesForItem = (itemId: string) => {
  return (dispatch: Dispatch, getState: () => RootState) => {
    try {
      // 从Redux获取配方列表
      const { recipes } = getState().recipes;
      console.log("calculationActions.getAvailableRecipesForItem", { itemId, recipes });
      
      // 使用服务层方法找到生产该物品的所有配方
      const itemRecipes = calculationService.getRecipesByOutput(recipes, itemId);
      
      dispatch({
        type: GET_ITEM_RECIPES,
        payload: { itemId, recipes: itemRecipes }
      });
      
      return itemRecipes;
    } catch (error) {
      dispatch({
        type: CALCULATION_ERROR,
        payload: error instanceof Error ? error.message : '获取物品配方失败',
        loading: false
      });
      throw error;
    }
  };
};

/**
 * 计算单个配方所需的原材料
 */
export const calculateRecipeMaterials = (recipeId: string, amount: number) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    try {
      dispatch({ type: CALCULATION_LOADING, loading: true });
      
      // 从Redux获取配方列表和偏好设置
      const state = getState();
      const { recipes } = state.recipes;
      const { preferredRecipes } = state.calculation;
      

      console.log('计算配方材料...', { recipeId, amount });
      // 使用服务层计算材料
      const materials = calculationService.calculateRecipeMaterials(
        recipes, 
        recipeId, 
        amount, 
        preferredRecipes
      );
      
      console.log('计算结果:', materials);
      dispatch({
        type: CALCULATE_RECIPE_MATERIALS,
        payload: {
          recipeId,
          amount,
          materials
        },
        loading: false
      });
      
      return materials;
    } catch (error) {
      dispatch({
        type: CALCULATION_ERROR,
        payload: error instanceof Error ? error.message : '计算配方材料失败',
        loading: false
      });
      throw error;
    }
  };
};

/**
 * 计算订单所需的所有材料
 */
export const calculateOrderMaterials = (order: Order) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    try {
      dispatch({ type: CALCULATION_LOADING, loading: true });
      
      // 从Redux获取配方列表和偏好设置
      const state = getState();
      const { recipes } = state.recipes;
      const { preferredRecipes } = state.calculation;
      
      // 使用服务层计算材料
      const materials = calculationService.calculateOrderMaterials(
        recipes,
        order, 
        preferredRecipes
      );
      
      dispatch({
        type: CALCULATE_ORDER_MATERIALS,
        payload: {
          orderId: order.id,
          materials
        },
        loading: false
      });
      
      return materials;
    } catch (error) {
      dispatch({
        type: CALCULATION_ERROR,
        payload: error instanceof Error ? error.message : '计算订单材料失败',
        loading: false
      });
      throw error;
    }
  };
};

/**
 * 批量计算多个订单所需的材料
 */
export const calculateBulkOrders = (orders: Order[]) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    try {
      dispatch({ type: CALCULATION_LOADING, loading: true });
      
      // 从Redux获取配方列表和偏好设置
      const state = getState();
      const { recipes } = state.recipes;
      const { preferredRecipes } = state.calculation;
      
      // 使用服务层计算材料
      const materials = calculationService.calculateBulkOrders(
        recipes,
        orders, 
        preferredRecipes
      );
      
      dispatch({
        type: CALCULATE_BULK_ORDERS,
        payload: {
          orderIds: orders.map(order => order.id),
          materials
        },
        loading: false
      });
      
      return materials;
    } catch (error) {
      dispatch({
        type: CALCULATION_ERROR,
        payload: error instanceof Error ? error.message : '批量计算订单材料失败',
        loading: false
      });
      throw error;
    }
  };
};

/**
 * 检查配方中是否存在循环依赖
 */
export const checkCircularDependency = (recipe: Recipe) => {
  return (dispatch: Dispatch, getState: () => RootState) => {
    try {
      dispatch({ type: CALCULATION_LOADING, loading: true });
      
      // 从Redux获取配方列表和偏好设置
      const state = getState();
      const { recipes } = state.recipes;
      const { preferredRecipes } = state.calculation;
      
      // 使用服务层检查循环依赖
      const hasCircular = calculationService.checkCircularDependency(
        recipes,
        recipe, 
        preferredRecipes
      );
      
      dispatch({
        type: CHECK_CIRCULAR_DEPENDENCY,
        payload: {
          recipeId: recipe.id,
          hasCircularDependency: hasCircular
        },
        loading: false
      });
      
      return hasCircular;
    } catch (error) {
      dispatch({
        type: CALCULATION_ERROR,
        payload: error instanceof Error ? error.message : '检查循环依赖失败',
        loading: false
      });
      throw error;
    }
  };
};

/**
 * 获取配方的依赖树结构
 */
export const getRecipeDependencyTree = (recipeId: string) => {
  return (dispatch: Dispatch, getState: () => RootState) => {
    try {
      dispatch({ type: CALCULATION_LOADING, loading: true });
      
      // 从Redux获取配方列表和偏好设置
      const state = getState();
      const { recipes } = state.recipes;
      const { preferredRecipes } = state.calculation;
      
      console.log('获取依赖树...', { recipeId });
      // 使用服务层获取依赖树
      const dependencyTree = calculationService.getRecipeDependencyTree(
        recipes,
        recipeId, 
        preferredRecipes
      );
      
      dispatch({
        type: GET_DEPENDENCY_TREE,
        payload: {
          recipeId,
          dependencyTree
        },
        loading: false
      });
      
      return dependencyTree;
    } catch (error) {
      dispatch({
        type: CALCULATION_ERROR,
        payload: error instanceof Error ? error.message : '获取依赖树失败',
        loading: false
      });
      throw error;
    }
  };
};

/**
 * 设置偏好配方
 */
export const setPreferredRecipe = (itemId: string, recipeId: string) => {
  return {
    type: SET_PREFERRED_RECIPE,
    payload: { itemId, recipeId }
  };
};

/**
 * 清除偏好配方
 */
export const clearPreferredRecipe = (itemId: string) => {
  return {
    type: CLEAR_PREFERRED_RECIPE,
    payload: { itemId }
  };
};

/**
 * 清除计算结果
 */
export const clearCalculationResults = () => ({
  type: CLEAR_CALCULATION_RESULTS
});
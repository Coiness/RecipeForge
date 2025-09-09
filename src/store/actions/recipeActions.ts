import { createRecipeService } from '../../services/recipeService';
import type { Recipe, Item_For_Recipe } from '../../types';
import type { Dispatch } from 'redux';
import type { RootState } from '../store';

// 创建服务实例，不再需要传入初始数据
const recipeService = createRecipeService();

// 定义 Action 类型常量
export const SELECT_RECIPE = 'SELECT_RECIPE';
export const ADD_RECIPE = 'ADD_RECIPE';
export const UPDATE_RECIPE = 'UPDATE_RECIPE';
export const DELETE_RECIPE = 'DELETE_RECIPE';
export const SET_RECIPES = 'SET_RECIPES';
export const RECIPE_ERROR = 'RECIPE_ERROR';
export const RECIPE_LOADING = 'RECIPE_LOADING';

// Action 创建函数
export const addRecipe = (name: string, input: Item_For_Recipe[], output: Item_For_Recipe[]) => {
    return async (dispatch: Dispatch, getState: () => RootState) => {
        try {
            dispatch({ type: RECIPE_LOADING, loading: true });
            
            // 从 Redux 获取当前配方列表
            const state = getState();
            const recipes = state.recipes.recipes;
            
            // 检查名称是否已存在
            if (recipeService.isNameTaken(recipes, name)) {
                throw new Error(`配方名称 "${name}" 已被使用`);
            }
            
            // 使用服务创建新配方
            const newRecipe = recipeService.createRecipe(name, input, output);
            
            // 通过 Redux 添加配方
            dispatch({
                type: ADD_RECIPE,
                payload: newRecipe,
                loading: false
            });
            
            return newRecipe;
        } catch (error) {
            dispatch({
                type: RECIPE_ERROR,
                payload: error instanceof Error ? error.message : '添加配方失败',
                loading: false
            });
            throw error;
        }
    }
}

export const updateRecipe = (id: string, updates: Partial<Omit<Recipe, 'id'>>) => {
    return async (dispatch: Dispatch, getState: () => RootState) => {
        try {
            dispatch({ type: RECIPE_LOADING, loading: true });
            
            // 从 Redux 获取当前配方列表
            const state = getState();
            const recipes = state.recipes.recipes;
            
            // 查找要更新的配方
            const existingRecipe = recipeService.getRecipeById(recipes, id);
            if (!existingRecipe) {
                throw new Error(`配方ID ${id} 不存在`);
            }
            
            // 检查名称是否已被占用（如果更新了名称）
            if (updates.name && recipeService.isNameTaken(recipes, updates.name, id)) {
                throw new Error(`配方名称 "${updates.name}" 已被使用`);
            }
            
            // 准备更新后的配方
            const updatedRecipe = recipeService.prepareRecipeUpdate(existingRecipe, updates);
            
            // 通过 Redux 更新配方
            dispatch({
                type: UPDATE_RECIPE,
                payload: updatedRecipe,
                loading: false
            });
            
            return updatedRecipe;
        } catch (error) {
            dispatch({
                type: RECIPE_ERROR,
                payload: error instanceof Error ? error.message : '更新配方失败',
                loading: false
            });
            throw error;
        }
    }
}

export const deleteRecipe = (id: string) => {
    return async (dispatch: Dispatch, getState: () => RootState) => {
        try {
            dispatch({ type: RECIPE_LOADING, loading: true });
            
            // 从 Redux 获取当前配方列表
            const state = getState();
            const recipes = state.recipes.recipes;
            
            // 检查配方是否存在
            const existingRecipe = recipeService.getRecipeById(recipes, id);
            if (!existingRecipe) {
                throw new Error(`配方ID ${id} 不存在`);
            }
            
            // 通过 Redux 删除配方
            dispatch({
                type: DELETE_RECIPE,
                payload: { id },
                loading: false
            });
            
            return true;
        } catch (error) {
            dispatch({
                type: RECIPE_ERROR,
                payload: error instanceof Error ? error.message : '删除配方失败',
                loading: false
            });
            throw error;
        }
    }
}

export const setRecipes = (recipes: Recipe[]) => {
    return async (dispatch: Dispatch) => {
        try {
            dispatch({ type: RECIPE_LOADING, loading: true });
            
            // 通过 Redux 设置配方列表
            dispatch({
                type: SET_RECIPES,
                payload: recipes,
                loading: false
            });
            
            return recipes;
        } catch (error) {
            dispatch({
                type: RECIPE_ERROR,
                payload: error instanceof Error ? error.message : '设置配方列表失败',
                loading: false
            });
            throw error;
        }
    }
}

export const selectRecipe = (recipe: Recipe | null) => {
    return {
        type: SELECT_RECIPE,
        payload: recipe
    }
}
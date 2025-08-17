import {createRecipeService} from '../../services/recipeService';
import type {Recipe,Item_For_Recipe} from '../../types';
import type {Dispatch} from 'redux';

// 1. 创建服务实例
const recipeService = createRecipeService();

// 2. 定义 Action 类型常量
export const ADD_RECIPE = 'ADD_RECIPE';
export const UPDATE_RECIPE = 'UPDATE_RECIPE';
export const DELETE_RECIPE = 'DELETE_RECIPE';
export const SET_RECIPES = 'SET_RECIPES';
export const RECIPE_ERROR = 'RECIPE_ERROR';
export const RECIPE_LOADING = 'RECIPE_LOADING';

// 3. 定义 Action  函数
export const addRecipe = (name: string, input: Item_For_Recipe[], output: Item_For_Recipe[]) => {
    return async(dispatch:Dispatch) =>{
        try {
            dispatch({ type: RECIPE_LOADING, loading: true });
            const newRecipe = recipeService.createRecipe(name, input, output);
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
    return async (dispatch:Dispatch) => {
        try{
            dispatch({type: RECIPE_LOADING, loading: true});
            const updateRecipe = recipeService.updateRecipe(id,updates)
            dispatch({
                type: UPDATE_RECIPE,
                payload: updateRecipe,
                loading: false
            });
            return updateRecipe;
        }catch(error){
            dispatch({
                type: RECIPE_ERROR,
                payload: error instanceof Error ? error.message : '更新配方失败',
                loading: false
            })

            throw error;
        }
    }
}   

export const deleteRecipe = (id: string) => {
    return async (dispatch: Dispatch) => {
        try {
            dispatch({ type: RECIPE_LOADING, loading: true });
            recipeService.deleteRecipe(id);
            dispatch({
                type: DELETE_RECIPE,
                payload: { id },
                loading: false
            });
        } catch (error) {
            dispatch({
                type: RECIPE_ERROR,
                payload: error instanceof Error ? error.message : '删除配方失败',
                loading: false
            });
            throw error;
        }
    };
}

export const setRecipes = (recipes: Recipe[]) => {
    return async (dispatch: Dispatch) => {
        try {
            dispatch({ type: RECIPE_LOADING, loading: true });
            dispatch({
                type: SET_RECIPES,
                payload: recipes,
                loading: false
            });
        } catch (error) {
            dispatch({
                type: RECIPE_ERROR,
                payload: error instanceof Error ? error.message : '设置配方失败',
                loading: false
            });
            throw error;
        }
    };
}



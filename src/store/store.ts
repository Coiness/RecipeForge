import {configureStore} from '@reduxjs/toolkit';
import type { Middleware } from 'redux';
import itemReducer from './reducers/itemReducer';
import recipeReducer from './reducers/recipeReducer';
import orderReducer from './reducers/orderReducer';
import calculationReducer from './reducers/calculationReduce';

//中间件
//1. 三层嵌套，store->next->action
//2. 每一层都返回一个函数 

//作为中间件，每次dispatch都会触发
const localStorageMiddleware:Middleware = store => next => action => {
    const result = next(action);

    const state = store.getState();
    localStorage. setItem('recipeforge_state',JSON.stringify({
        items:state.items,
        recipes:state.recipes,
        orders:state.orders,
        calculation:{
            materials:state.calculation.materials,
            preferredRecipes:state.calculation.preferredRecipes
        }
    }));

    return result;
}

// filepath: [store.ts](http://_vscodecontentref_/2)
// 设置初始状态
const loadInitialState = () => {
    try {
        const savedState = localStorage.getItem('recipeforge_state')
        console.log('加载的初始状态:', savedState);
        if (!savedState) return {};

        const parsedState = JSON.parse(savedState);
        console.log('解析的初始状态:', parsedState);

        // 返回正确的嵌套结构
        return {
            // 直接返回嵌套结构，不需要重组
            items: parsedState.items,
            recipes: parsedState.recipes,
            orders: parsedState.orders,
            calculation: parsedState.calculation || {
                materials: {},
                preferredRecipes: {},
                currentCalculation: { type: null, id: null },
                circularDependencies: {},
                dependencyTrees: {},
                loading: false,
                error: null
            }
        }
    } catch (error) {
        console.error('加载初始状态失败:', error);
        return {}
    }
}


const store = configureStore({
    reducer:{
        items:itemReducer,
        recipes:recipeReducer,
        orders:orderReducer,
        calculation:calculationReducer
    },
    //创建store时加载初始状态
    preloadedState: loadInitialState(),
    middleware : (getDefaultMiddleware) => 
        getDefaultMiddleware().concat(localStorageMiddleware)

    // concat 合并数组，将我自己的中间件添加到数组尾部
    // getDefaultMiddleware() 返回默认的中间件数组（已经预配置了）
    // 这个是redux-toolkit提供的一个函数，用于获取默认的中间件
})

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


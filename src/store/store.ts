import {configureStore} from '@reduxjs/toolkit';
import itemReducer from './reducers/itemReducer';
import recipeReducer from './reducers/recipeReducer';
import orderReducer from './reducers/orderReducer';
import calculationReducer from './reducers/calculationReduce';

const store = configureStore({
    reducer:{
        items:itemReducer,
        recipes:recipeReducer,
        orders:orderReducer,
        calculation:calculationReducer
    }
})

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


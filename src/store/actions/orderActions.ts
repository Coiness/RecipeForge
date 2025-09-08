import { createOrderService } from "../../services/orderService"
import type { Order,Recipe_For_Order,TargetItem} from "../../types"
import type { Dispatch } from "redux";

//1.创建服务实例
//2.定义Action类型常量,基础的增删改操作 (为什么没有查，是因为这个是针对对于状态的操作吗)
//3.定义Action创建函数

const orderService = createOrderService();

export const ADD_ORDER = 'ADD_ORDER';
export const DELETE_ORDER = 'DELETE_ORDER';
export const UPDATE_ORDER = 'UPDATE_ORDER';
export const SET_ORDERS = 'SET_ORDERS'; 
export const ORDER_ERROR = 'ORDER_ERROR';
export const ORDER_LOADING = 'ORDER_LOADING';
export const SELECT_ORDER = 'SELECT_ORDER';

export const addOrder = (name:string,targetItems:TargetItem[],recipes:Recipe_For_Order[]) =>{
    return async (dispatch: Dispatch) => {
        try{
            dispatch({
            type: ORDER_LOADING, 
            loading: true})

            const newOrder = orderService.createOrder(name,targetItems, recipes);

            dispatch( {
            type: ADD_ORDER,
            payload: newOrder,
            loading:false
            });

            return newOrder;
    }catch(error){
        dispatch({
            type: ORDER_ERROR,
            payload: error instanceof Error ? error.message : '添加订单失败',
            loading: false
        })

        throw Error
    }
    }
}

export const updateOrder = (id:string,updates:Partial<Omit<Order,'id'>>) =>{
    return async (dispatch:Dispatch) => {
        try{
            dispatch({type: ORDER_LOADING, loading: true});
            const updatedOrder = orderService.updateOrder(id, updates);
            dispatch({
                type: UPDATE_ORDER,
                payload: updatedOrder,
                loading: false
            });
            return updatedOrder;
        }catch(error){
            dispatch({
                type: ORDER_ERROR,
                payload: error instanceof Error ? error.message : '更新订单失败',
                loading: false
            });

            throw error;
        }
    }
}

export const deleteOrder = (id:string) => {
    return async (dispatch: Dispatch) => {
        try{
            dispatch({ type: ORDER_LOADING, loading: true });
            orderService.deleteOrder(id);
            dispatch({
                type: DELETE_ORDER,
                payload: { id },
                loading: false
            });
        }catch(error){
            dispatch({
                type: ORDER_ERROR,
                payload: error instanceof Error ? error.message : '删除订单失败',
                loading: false
            });

            throw error;
        }
    }
}

export const setOrders = (orders: Order[]) => {
    return async (dispatch: Dispatch) => {
        try{
            dispatch({ type: ORDER_LOADING, loading: true });
            dispatch({
                type: SET_ORDERS,
                payload: orders,
                loading: false
            });
        }catch(error){
            dispatch({
                type: ORDER_ERROR,
                payload: error instanceof Error ? error.message : '设置订单失败',
                loading: false
            });
        }
    }
}

export const selectOrder = (order: Order | null) => {
    return{
        type:SELECT_ORDER,
        payload: order
    }
}

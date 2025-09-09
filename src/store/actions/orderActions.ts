import { createOrderService } from "../../services/orderService";
import type { Order, Recipe_For_Order, TargetItem } from "../../types";
import type { Dispatch } from "redux";
import type { RootState } from "../store";

// 创建服务实例，不再传入初始数据
const orderService = createOrderService();

export const ADD_ORDER = 'ADD_ORDER';
export const DELETE_ORDER = 'DELETE_ORDER';
export const UPDATE_ORDER = 'UPDATE_ORDER';
export const SET_ORDERS = 'SET_ORDERS'; 
export const ORDER_ERROR = 'ORDER_ERROR';
export const ORDER_LOADING = 'ORDER_LOADING';
export const SELECT_ORDER = 'SELECT_ORDER';

export const addOrder = (name: string, targetItems: TargetItem[], recipes: Recipe_For_Order[] = []) => {
    return async (dispatch: Dispatch, getState: () => RootState) => {
        try {
            dispatch({ type: ORDER_LOADING, loading: true });
            
            // 从 Redux 获取当前订单列表
            const state = getState();
            const orders = state.orders.orders;
            
            // 检查名称是否已存在
            if (orderService.isNameTaken(orders, name)) {
                throw new Error(`订单名称 "${name}" 已被使用`);
            }
            
            // 使用服务创建新订单对象
            const newOrder = orderService.createOrder(name, targetItems, recipes);
            
            // 通过 Redux 添加订单
            dispatch({
                type: ADD_ORDER,
                payload: newOrder,
                loading: false
            });
            
            return newOrder;
        } catch (error) {
            dispatch({
                type: ORDER_ERROR,
                payload: error instanceof Error ? error.message : '添加订单失败',
                loading: false
            });
            
            throw error;
        }
    };
};

export const updateOrder = (id: string, updates: Partial<Omit<Order, 'id'>>) => {
    return async (dispatch: Dispatch, getState: () => RootState) => {
        try {
            dispatch({ type: ORDER_LOADING, loading: true });
            
            // 从 Redux 获取当前订单列表
            const state = getState();
            const orders = state.orders.orders;
            
            // 查找要更新的订单
            const existingOrder = orderService.getOrderById(orders, id);
            if (!existingOrder) {
                throw new Error(`订单ID ${id} 不存在`);
            }
            
            // 检查名称是否已被占用（如果更新了名称）
            if (updates.name && orderService.isNameTaken(orders, updates.name, id)) {
                throw new Error(`订单名称 "${updates.name}" 已被使用`);
            }
            
            // 准备更新后的订单
            const updatedOrder = orderService.prepareOrderUpdate(existingOrder, updates);
            
            // 通过 Redux 更新订单
            dispatch({
                type: UPDATE_ORDER,
                payload: updatedOrder,
                loading: false
            });
            
            return updatedOrder;
        } catch (error) {
            dispatch({
                type: ORDER_ERROR,
                payload: error instanceof Error ? error.message : '更新订单失败',
                loading: false
            });
            
            throw error;
        }
    };
};

export const deleteOrder = (id: string) => {
    return async (dispatch: Dispatch, getState: () => RootState) => {
        try {
            dispatch({ type: ORDER_LOADING, loading: true });
            
            // 从 Redux 获取当前订单列表
            const state = getState();
            const orders = state.orders.orders;
            
            // 检查订单是否存在
            const existingOrder = orderService.getOrderById(orders, id);
            if (!existingOrder) {
                throw new Error(`订单ID ${id} 不存在`);
            }
            
            // 通过 Redux 删除订单
            dispatch({
                type: DELETE_ORDER,
                payload: { id },
                loading: false
            });
            
            return true;
        } catch (error) {
            dispatch({
                type: ORDER_ERROR,
                payload: error instanceof Error ? error.message : '删除订单失败',
                loading: false
            });
            
            throw error;
        }
    };
};

export const setOrders = (orders: Order[]) => {
    return async (dispatch: Dispatch) => {
        try {
            dispatch({ type: ORDER_LOADING, loading: true });
            
            dispatch({
                type: SET_ORDERS,
                payload: orders,
                loading: false
            });
            
            return orders;
        } catch (error) {
            dispatch({
                type: ORDER_ERROR,
                payload: error instanceof Error ? error.message : '设置订单列表失败',
                loading: false
            });
            
            throw error;
        }
    };
};

export const selectOrder = (order: Order | null) => {
    return {
        type: SELECT_ORDER,
        payload: order
    };
};
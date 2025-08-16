import { createOrderService } from "../../services/orderService"
import type { Order,Recipe_For_Order } from "../../types"

//1.创建服务实例
//2.定义Action类型常量,基础的增删改操作 (为什么没有查，是因为这个是针对对于状态的操作吗)
//3.定义Action创建函数

const orderService = createOrderService();

export const ADD_ORDER = 'ADD_ORDER';
export const DELETE_ORDER = 'DELETE_ORDER';
export const UPDATE_ORDER = 'UPDATE_ORDER';
export const SET_ORDERS = 'SET_ORDERS'; 
export const ORDER_ERROR = 'ORDER_ERROR';

export const addOrder = (name:string,recipes:Recipe_For_Order[]) =>{
    try{
        const newOrder = orderService.createOrder(name, recipes);
        return {
            type: ADD_ORDER,
            payload: newOrder
        }
    }catch(error){
        return{
            type: ORDER_ERROR,
            payload: error instanceof Error ? error.message : '添加订单失败'
        }
    }
}
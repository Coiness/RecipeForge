/**
 * 1.明确Hook的目标
 * - 提供对订单的增删改查功能
 * - Hook主要用于数据操作
 * 2.设计Hook的接口
 * - 增 输入 order
 * - 删 输入 orderId
 * - 改 输入 orderId 和更新数据
 * - 查 输入 orderName
 * - 根据Service来
 * 3.实现内部逻辑
 * - 使用useCallback来优化性能
 * - 使用useAppDispatch和useAppSelector来与Redux交互
 */

import { useCallback, useState} from "react";
import { useAppDispatch,useAppSelector } from "./useRedux";
import { addOrder,updateOrder,deleteOrder} from "../store/actions/orderActions";
import type { Order, Recipe_For_Order } from '../types';

// 提供订单管理功能的自定义Hook
export const useOrder = () =>{
    //从Redux store获取状态
    const dispatch = useAppDispatch();
    const { orders, loading, error } = useAppSelector(state => state.orders);

    // 本地状态，用于跟踪当前选中的订单
    const [selectedOrder,setSelectedOrder] = useState<Order | null>(null);
    
    // 添加新订单
    const createOrder = useCallback(async (name:string,recipes:Recipe_For_Order[])=>{
        try{
            const newOrder = await dispatch(addOrder(name,recipes));
            return newOrder;
        }catch(error){
            console.error('添加订单失败:', error);
            throw error;
        }
    },[dispatch]) //此处的[dispatch]是？

    // 更新订单
    const modifyOrder = useCallback(async (
        id:string,
        updates:Partial<Omit<Order,'id'>>
    )=>{
        try{
            const update_Order = await dispatch(updateOrder(id,updates))
            return update_Order;
        }catch(error){
            console.error('更新订单失败:', error);
            throw error;
        }
    },[dispatch])

    // 删除订单
    const removeOrder = useCallback(async(id:string)=>{
        try{
            const removedOrder = await deleteOrder(id)
            return removedOrder
        }catch(error){
            console.error('删除订单失败',error)
            throw error
        }
    },[dispatch])

    // 查询订单
    const searchOrders = useCallback((query:string)=>{
        const lowercaseQuery = query.toLowerCase();
        return orders.filter(order =>
            order.name.toLowerCase().includes(lowercaseQuery)
        );
    },[orders])

    // 选择订单
    const selectOrder = useCallback((id:string)=>{
        const order = orders.find(order => order.id === id);
        setSelectedOrder(order || null);
        return order;
    },[orders])

    // 清除当前选中的订单
    const clearSelection = useCallback(()=>{
        setSelectedOrder(null);
    } ,[])

    return {
        orders,
        loading,
        error,
        selectedOrder,
        createOrder,
        modifyOrder,
        removeOrder,
        searchOrders,
        selectOrder,
        clearSelection
    }

}



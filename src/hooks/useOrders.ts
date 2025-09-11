import { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "./useRedux";
import { addOrder, updateOrder, deleteOrder, selectOrder as selectOrder_action } from "../store/actions/orderActions";
import type { Order, Recipe_For_Order, TargetItem } from '../types';

export const useOrder = () => {
    const dispatch = useAppDispatch();
    const { orders: originalOrders, loading, error, selectedOrder: originalSelectedOrder } = useAppSelector(state => state.orders);
    const items = useAppSelector(state => state.items.items);
    const recipes = useAppSelector(state => state.recipes.recipes);
    
    // 为选中的订单应用连接层 - 使用 useMemo
    const updatedSelectedOrder = useMemo(() => {
        if (!originalSelectedOrder) return null;
        
        return {
            ...originalSelectedOrder,
            targetItems: originalSelectedOrder.targetItems.map(target => {
                const latestItem = items.find(i => i.id === target.item.id) || target.item;
                return { ...target, item: latestItem };
            }),
            recipes: originalSelectedOrder.recipes.map(recipeOrder => {
                const latestRecipe = recipes.find(r => r.id === recipeOrder.recipe.id);
                if (!latestRecipe) return recipeOrder;
                
                return {
                    ...recipeOrder,
                    recipe: {
                        ...latestRecipe,
                        input: latestRecipe.input.map(input => ({
                            ...input,
                            item: items.find(i => i.id === input.item.id) || input.item
                        })),
                        output: latestRecipe.output.map(output => ({
                            ...output,
                            item: items.find(i => i.id === output.item.id) || output.item
                        }))
                    }
                };
            })
        };
    }, [originalSelectedOrder, items, recipes]);
    
    // 为所有订单应用连接层 - 使用 useMemo
    const updatedOrders = useMemo(() => {
        return originalOrders.map(order => {
            return {
                ...order,
                targetItems: order.targetItems.map(target => {
                    const latestItem = items.find(i => i.id === target.item.id) || target.item;
                    return { ...target, item: latestItem };
                })
                // 注意：这里简化处理，不更新配方详情，除非需要在列表视图中显示
            };
        });
    }, [originalOrders, items]);
    
    // 添加新订单
    const createOrder = useCallback(async (name: string, targetItems: TargetItem[], recipes: Recipe_For_Order[]) => {
        try {
            const newOrder = await dispatch(addOrder(name, targetItems, recipes));
            console.log('添加订单:', newOrder);
            return newOrder;
        } catch (error) {
            console.error('添加订单失败:', error);
            throw error;
        }
    }, [dispatch]);

    // 更新订单
    const modifyOrder = useCallback(async (
        id: string,
        updates: Partial<Omit<Order, 'id'>>
    ): Promise<Order | null> => {
        try {
            const update_Order = await dispatch(updateOrder(id, updates))
            return update_Order;
        } catch (error) {
            console.error('更新订单失败:', error);
            throw error;
        }
    }, [dispatch]);

    // 删除订单
    const removeOrder = useCallback(async (id: string) => {
        try {
            const removedOrder = await dispatch(deleteOrder(id));
            return removedOrder
        } catch (error) {
            console.error('删除订单失败', error)
            throw error
        }
    }, [dispatch]);

    // 查询订单 - 使用更新后的订单列表
    const searchOrders = useCallback((query: string) => {
        const lowercaseQuery = query.toLowerCase();
        return updatedOrders.filter(order =>
            order.name.toLowerCase().includes(lowercaseQuery)
        );
    }, [updatedOrders]);

    // 选择订单
    const selectOrder = useCallback((id: string) => {
        const order = originalOrders.find(order => order.id === id);
        dispatch(selectOrder_action(order || null))
        return order;
    }, [originalOrders, dispatch]);

    // 清除当前选中的订单
    const clearSelection = useCallback(() => {
        dispatch(selectOrder_action(null))
    }, [dispatch]);

    // 返回更新后的数据
    return {
        orders: updatedOrders,           // ✅ 返回更新后的订单列表
        loading,
        error,
        selectedOrder: updatedSelectedOrder, // ✅ 返回更新后的选中订单
        createOrder,
        modifyOrder,
        removeOrder,
        searchOrders,
        selectOrder,
        clearSelection
    }
};
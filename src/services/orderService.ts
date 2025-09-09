import type { Order, Recipe_For_Order, TargetItem } from "../types";
import { v4 as uuidv4 } from 'uuid';

/**
 * 订单服务 - 仅提供业务逻辑方法，不存储状态
 */
export class OrderService {
    /**
     * 验证订单名称
     * @param name 订单名称
     * @throws 如果名称为空则抛出错误
     */
    validateOrderName(name?: string): void {
        if (name !== undefined && !name.trim()) {
            throw new Error("订单名称不能为空");
        }
    }

    /**
     * 根据ID获取订单
     * @param orders 订单列表
     * @param id 订单ID
     * @returns 订单对象或undefined
     */
    getOrderById(orders: Order[], id: string): Order | undefined {
        return orders.find(order => order.id === id);
    }

    /**
     * 根据名称搜索订单
     * @param orders 订单列表
     * @param query 搜索关键词
     * @returns 匹配的订单列表
     */
    searchOrders(orders: Order[], query: string): Order[] {
        const lowercaseQuery = query.toLowerCase();
        return orders.filter(order =>
            order.name.toLowerCase().includes(lowercaseQuery)
        );
    }

    /**
     * 创建新订单对象
     * @param name 订单名称
     * @param targetItems 目标物品列表
     * @param recipes 订单配方列表
     * @returns 新订单对象
     */
    createOrder(name: string, targetItems: TargetItem[], recipes: Recipe_For_Order[] = []): Order {
        this.validateOrderName(name);

        return {
            id: uuidv4(),
            name: name.trim(),
            status: "pending", // 默认状态为待处理
            recipes: [...recipes],
            targetItems: [...targetItems]
        };
    }

    /**
     * 准备订单更新
     * @param order 原订单
     * @param updates 更新内容
     * @returns 更新后的订单对象
     */
    prepareOrderUpdate(order: Order, updates: Partial<Omit<Order, 'id'>>): Order {
        if (updates.name !== undefined) {
            this.validateOrderName(updates.name);
        }

        return {
            ...order,
            ...updates,
            ...(updates.name && { name: updates.name.trim() })
        };
    }

    /**
     * 检查订单名称是否已存在
     * @param orders 订单列表
     * @param name 订单名称
     * @param excludeId 要排除的订单ID（更新时使用）
     * @returns 名称是否已被使用
     */
    isNameTaken(orders: Order[], name: string, excludeId?: string): boolean {
        return orders.some(order => 
            order.name.toLowerCase() === name.toLowerCase() && 
            order.id !== excludeId
        );
    }

    /**
     * 按名称排序订单
     * @param orders 订单列表
     * @param ascending 是否升序排序
     * @returns 排序后的订单列表
     */
    sortOrdersByName(orders: Order[], ascending: boolean = true): Order[] {
        return [...orders].sort((a, b) =>
            ascending
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name)
        );
    }

    /**
     * 按状态筛选订单
     * @param orders 订单列表
     * @param status 订单状态
     * @returns 筛选后的订单列表
     */
    filterOrdersByStatus(orders: Order[], status: Order['status']): Order[] {
        return orders.filter(order => order.status === status);
    }

    /**
     * 批量导入订单
     * @param currentOrders 当前订单列表
     * @param newOrders 要导入的订单
     * @param overwrite 是否覆盖同ID订单
     * @returns 合并后的订单列表
     */
    processOrderImport(currentOrders: Order[], newOrders: Order[], overwrite: boolean = false): Order[] {
        if (!Array.isArray(newOrders)) {
            throw new Error("导入的订单必须是一个数组");
        }

        // 验证所有导入的订单
        newOrders.forEach((order, index) => {
            if (!order.id || !order.name) {
                throw new Error(`导入的订单 #${index + 1} 缺少必要字段`);
            }
        });

        if (overwrite) {
            // 创建导入订单ID集合
            const importIds = new Set(newOrders.map(order => order.id));
            // 过滤掉要被覆盖的订单
            const filteredOrders = currentOrders.filter(order => !importIds.has(order.id));
            // 返回合并后的结果
            return [...filteredOrders, ...newOrders];
        } else {
            // 简单地添加新订单
            return [...currentOrders, ...newOrders];
        }
    }
}

/**
 * 创建订单服务实例
 * @returns 订单服务实例
 */
export function createOrderService(): OrderService {
    return new OrderService();
}
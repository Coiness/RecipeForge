import type { Order,Recipe_For_Order } from "../types";
import {v4 as uuidv4} from 'uuid';

/**
 * 订单服务
 * 1.创建订单
 * 2.获取订单
 * 3.更改订单
 * 4.删除订单
 * 5.计算订单
 */

export class OrderService{
    private orders: Order[] = [];

    constructor(initialOrders: Order[]){
        this.orders = [...initialOrders];
    }

    /**
     * 获取所有订单
     * @returns 订单列表
     */
    getAllOrders(): Order[] {
        return [...this.orders];
    }

    /**
     * 根据ID获取订单
     * @param id 订单ID
     * @returns 订单对象或undefined
     */
    getOrderById(id:string):Order | undefined{
        return this.orders.find(order => order.id === id);
    }

    /**
     * 根据名称搜索订单
     * @param query 搜索关键词
     * @return 匹配的订单列表
     */
    searchOrders(query:string):Order[]{
        const lowercaseQuery = query.toLowerCase();
        return this.orders.filter(order =>
            order.name.toLowerCase().includes(lowercaseQuery)
        )
    }

    /**
     * 创建新订单
     * @param name 订单名称
     * @param recipes 订单中的配方列表
     * @returns 新创建的订单对象
     */
    createOrder(name:string,recipes: Recipe_For_Order[]): Order {
        if(!name.trim()){
            throw new Error("订单名称不能为空");
        }

        const newOrder: Order = {
            id: uuidv4(),
            name,
            status: "pending", // 默认状态为待处理
            recipes: [...recipes]
        };

        this.orders.push(newOrder);
        return newOrder;
    }

    /**
     * 更新订单
     * @param id 订单ID
     * @param updates 更新内容
     * @returns 更新后的订单对象
     */
    updateOrder(id:string, updates: Partial<Omit<Order, 'id'>>): Order {
        const index = this.orders.findIndex(order => order.id === id);

        if(index === -1){
            throw new Error(`订单ID ${id} 不存在`);
        }

        const updatedOrder: Order = {
            ...this.orders[index],
            ...updates,
            ...(updates.name && {name: updates.name.trim()}) // 确保名称被trim()
        };

        this.orders[index] = updatedOrder;
        return updatedOrder;
    }
    
    /**
     * 删除订单
     * @param id 订单ID
     * @return 是否删除成功
     */
    deleteOrder(id:string): boolean {
        const index = this.orders.findIndex(order => order.id === id);

        if(index === -1){
            throw new Error(`订单ID ${id} 不存在`);
        }

        this.orders.splice(index, 1);
        return true;
    }

    /**
     * 检查订单是否存在
     * @param name 订单名称
     * @returns 是否存在
     */
    isNameTaken(name: string): boolean {
        return this.orders.some(order => order.name.toLowerCase() === name.toLowerCase());
    }

    /**
     * todo: 计算订单
     */

    /**
     * todo: 批量导入订单
     */

    /**
     * todo: 批量导出订单
     */

}

export function createOrderService(initialOrders: Order[] = []): OrderService {
    return new OrderService(initialOrders);
}
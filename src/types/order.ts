import type { Recipe_For_Order } from "./recipe";

export interface Order{
    id: string; // 订单ID
    name: string; // 订单名称
    status: string; // 订单状态
    recipes: Recipe_For_Order[]; // 订单中的配方列表
}
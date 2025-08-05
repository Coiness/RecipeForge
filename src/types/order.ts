import type { Recipe_For_Order } from "./recipe";

export interface Order{
    status: string; // 订单状态
    recipes: Recipe_For_Order[]; // 订单中的配方列表
}
import type { Recipe_For_Order } from "./recipe";
import type { Item } from "./item";

export interface Order{
    id: string; // 订单ID
    name: string; // 订单名称
    status: string; // 订单状态
    recipes: Recipe_For_Order[]; // 订单中的配方列表
    targetItems: TargetItem[]; // 订单的目标物品列表
}

export interface TargetItem{
    item: Item;
    amount: number;
}
import type { Item_For_Recipe } from './item';


export interface Recipe{
    id:string;
    name:string;
    input: Item_For_Recipe[];  // 输入物品列表
    output: Item_For_Recipe[]; // 输出物品列表
}

export interface Recipe_For_Order {
    recipe: Recipe;
    amount: number;  // 数量作为配方的固有属性
}
export interface Item{
    id:string;
    name:string;
    iconUrl:string;
}

export interface Item_For_Recipe{
    item: Item;
    amount: number;  // 数量作为物品的固有属性
}

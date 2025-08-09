import type { Item  } from "../types";
import {v4 as uuidv4} from 'uuid';

/**
 * 物品服务 - 处理所有与物品相关的业务逻辑
 */
export class ItemService {
    private items:Item[] = [];

    /**
     * 初始化物品服务
     * @param initialItems 物品列表
     */
    constructor(initialItems:Item[]){
        this.items = [...initialItems];
    }

    /**
     * 获取所有物品
     * @returns 物品列表
     */
    getAllItems():Item[]{
        return [...this.items];
    }

    /**
     * 根据ID获取物品
     * @param id 物品ID
     * @returns 物品对象或undefined
     */
    getItemById(id:string):Item | undefined {
        return this.items.find(item => item.id === id);
    }

    /**
     * 根据名称搜索物品
     * @param query 搜索关键词
     * @returns 匹配的物品列表
     */
    searchItems(query:string):Item[]{
        const lowercaseQuery = query.toLowerCase();
        return this.items.filter(item=>
            item.name.toLowerCase().includes(lowercaseQuery)
        )
    }

    /**
     * 添加新物品
     * @param name 新物品名称
     * @param iconUrl 新物品图标URL
     * @returns 新添加的物品对象
     */
    //为什么iconurl是可选的？因为有些物品可能没有图标
    //如果没有提供图标URL，则使用默认图标
    createItem(name:string,iconUrl:string = ''):Item{
        if(!name.trim()){
            throw new Error("物品名称不能为空");
        }

        const newItem:Item = {
            id: uuidv4(),
            name: name.trim(),
            iconUrl: iconUrl.trim() || 'default-icon.png' // 使用默认图标
        }

        this.items.push(newItem);
        return newItem;
        }

    /**
     * 更新现有物品
     * @param id 物品ID
     * @param updates 需要更新的字段
     * @return 更新后的物品对象
     */
    updateItem(id:string,updates:Partial<Omit<Item,'id'>>):Item{
        //为什么用Partial？因为可能只更新部分字段
        //为什么使用Omit？因为不允许更新ID字段
        //为什么用findIndex？因为需要找到物品在数组中的索引
        const index = this.items.findIndex(item => item.id === id);

        if(index === -1){
            throw new Error(`物品ID ${id} 不存在`);
        }

        //trim()方法用于去除字符串两端的空格
        if(updates.name !== undefined && !updates.name.trim()){
            throw new Error("物品名称不能为空");
        }

        //创建更新后的物品
        //这个为什么要三次...？
        //第一次，复制原物品的属性
        //第二次，复制更新的属性
        //第三次，如果提供了名称，则去除两端空格
        const updatedItem:Item = {
            ...this.items[index],
            ...updates,
            ...(updates.name && {name:updates.name.trim()}), // 如果提供了名称，则去除两端空格
        }

        //更新物品列表
        this.items[index] = updatedItem;
        return updatedItem;
    }

    /**
     * 删除物品
     * @param id 物品ID
     * @return 是否删除成功
     */
    deleteItem(id:string):boolean{
        const initialLength = this.items.length;
        this.items = this.items.filter(item => item.id !== id);
        return this.items.length < initialLength; // 如果长度减少，则表示删除成功
    }

    /**
     * 批量导入物品
     * @param items 物品列表
     * @param overwrite 是否覆盖现有物品
     * @return 导入后的物品列表
     */
    importItems(items:Item[],overwrite:boolean = false):Item[]{
       if(!Array.isArray(items)){
        throw new Error("导入的物品必须是一个数组");
       }

       //为什么选择按照ID来决定覆盖
       //ID为什么会是唯一的？当用户导入时，因为ID唯一不是根本无法覆盖吗？
       if(overwrite){
        const importIds = new Set(items.map(item => item.id));
        this.items = this.items.filter(item => !importIds.has(item.id)); // 先
       }

       //将新物品添加到列表中
       this.items = [...this.items,...items];
       
       return this.getAllItems();
    }

    /**
     * 导出物品数据
     * @return 可序列化的物品列表
     */
    exportItems():Item[]{
        return this.getAllItems();
    }

    /**
     * 检查物品是否存在
     * @param id 物品ID
     * @return 是否存在
     */
    itemExists(id:string):boolean {
        return this.items.some(item => item.id === id);
    }

    /**
     * 检查物品名称是否已存在
     * @param name 物品名称
     * @return 是否存在
     */
    isNameTaken(name:string):boolean{
        //为什么用some?
        return this.items.some(item =>
            item.name.toLowerCase() ===  name.toLowerCase()
        );
    }

    /**
     * 获取物品总数
     * @return 物品数量
     */
    getItemCount():number{
        return this.items.length;
    }

    /**
     * 清空物品列表
     */
    clearItems():void {
        this.items = [];
    }

    /**
     * 按名称排序物品
     * @param ascending 是否升序排序
     * @return 排序后的物品列表
     */
    sortItemsByName(ascending:boolean = true):Item[]{
        const sorted = [...this.items].sort((a,b)=>
            ascending
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name)
        );
        
        this.items = sorted; // 更新物品列表
        return sorted;
    }
}

/**
 * 创建物品服务实例
 * @param initialItems 初始物品列表
 * @return 物品服务实例
 */
export function createItemService(initialItems:Item[] = []): ItemService {
    return new ItemService(initialItems);
}
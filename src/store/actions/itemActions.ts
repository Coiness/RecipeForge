import { createItemService } from '../../services/itemService';
import type { Item } from '../../types';

// 创建服务实例
const itemService = createItemService();

// Action类型常量
// 这是干什么用的，和reducer的机制有关吗
export const ADD_ITEM = 'ADD_ITEM';
export const UPDATE_ITEM = 'UPDATE_ITEM'
export const DELETE_ITEM = 'DELETE_ITEM';
export const SET_ITEMS = 'SET_ITEMS';
export const ITEM_ERROR = 'ITEM_ERROR';

// Action 创建函数
export const addItem = (name:string,iconUrl:string = '') =>{
    try{
        const newItem = itemService.createItem(name, iconUrl);
        return{
            type: ADD_ITEM,
            payload: newItem
        }
    }catch(error){
        return{
            type: ITEM_ERROR,
            payload: error instanceof Error ? error.message : '添加物品失败'
        }
    }
} 

export const updatedItem = (id:string,updates:Partial<Omit<Item,'id'>>) =>{
    try{
        const updatedItem = itemService.updateItem(id,updates);
        return{
            type: UPDATE_ITEM,
            payload: updatedItem
        }
    }catch(error){
        return{
            type: ITEM_ERROR,
            payload: error instanceof Error ? error.message : '更新物品失败'
        }
    }
}

export const deleteItem = (id:string) => {
    try{
        const deleteItem = itemService.deleteItem(id);
        return{
            type: DELETE_ITEM,
            payload:deleteItem
        }
    }catch(error){
        return{
            type: ITEM_ERROR,
            payload: error instanceof Error ? error.message : '删除物品失败'
        }
        //instanceof 是什么语法
    }
}

export const setItems = (items:Item[])=>({
    type: SET_ITEMS,
    payload: items
})


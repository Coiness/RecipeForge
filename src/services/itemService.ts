import type { Item } from "../types";
import { v4 as uuidv4 } from 'uuid';

/**
 * 物品服务 - 仅提供业务逻辑方法，不存储状态
 */
export class ItemService {
    /**
     * 验证物品数据
     * @param name 物品名称
     * @throws 如果验证失败则抛出错误
     */
    validateItemName(name?: string): void {
        if (name !== undefined && !name.trim()) {
            throw new Error("物品名称不能为空");
        }
    }

    /**
     * 创建新物品对象
     * @param name 新物品名称
     * @param iconUrl 新物品图标URL
     * @returns 新物品对象（不存储）
     */
    createItem(name: string, iconUrl: string = ''): Item {
        this.validateItemName(name);

        return {
            id: uuidv4(),
            name: name.trim(),
            iconUrl: iconUrl.trim() || ''
        };
    }

    /**
     * 格式化物品更新数据
     * @param item 原始物品
     * @param updates 更新字段
     * @returns 更新后的物品对象
     */
    prepareItemUpdate(item: Item, updates: Partial<Omit<Item, 'id'>>): Item {
        this.validateItemName(updates.name);

        // 格式化更新内容
        return {
            ...item,
            ...updates,
            // 如果更新了名称，确保去除空格
            ...(updates.name && { name: updates.name.trim() }),
            // 如果更新了图标，确保去除空格
            ...(updates.iconUrl !== undefined && { iconUrl: updates.iconUrl.trim() || '' })
        };
    }

    /**
     * 按名称搜索物品
     * @param items 物品列表
     * @param query 搜索关键词
     * @returns 匹配的物品列表
     */
    searchItems(items: Item[], query: string): Item[] {
        const lowercaseQuery = query.toLowerCase();
        return items.filter(item =>
            item.name.toLowerCase().includes(lowercaseQuery)
        );
    }

    /**
     * 检查物品是否存在
     * @param items 物品列表
     * @param id 物品ID
     * @returns 物品是否存在
     */
    itemExists(items: Item[], id: string): boolean {
        return items.some(item => item.id === id);
    }

    /**
     * 根据ID获取物品
     * @param items 物品列表
     * @param id 物品ID
     * @returns 物品对象或undefined
     */
    getItemById(items: Item[], id: string): Item | undefined {
        return items.find(item => item.id === id);
    }

    /**
     * 检查物品名称是否已存在
     * @param items 物品列表
     * @param name 物品名称
     * @param excludeId 要排除的物品ID（更新时使用）
     * @returns 名称是否已存在
     */
    isNameTaken(items: Item[], name: string, excludeId?: string): boolean {
        return items.some(item =>
            item.name.toLowerCase() === name.toLowerCase() && 
            item.id !== excludeId
        );
    }

    /**
     * 按名称排序物品
     * @param items 物品列表
     * @param ascending 是否升序排序
     * @returns 排序后的物品列表
     */
    sortItemsByName(items: Item[], ascending: boolean = true): Item[] {
        return [...items].sort((a, b) =>
            ascending
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name)
        );
    }

    /**
     * 处理物品批量导入
     * @param currentItems 当前物品列表
     * @param newItems 要导入的物品
     * @param overwrite 是否覆盖同ID物品
     * @returns 处理后的物品列表
     */
    processItemImport(currentItems: Item[], newItems: Item[], overwrite: boolean = false): Item[] {
        if (!Array.isArray(newItems)) {
            throw new Error("导入的物品必须是一个数组");
        }

        if (overwrite) {
            // 创建导入物品ID集合
            const importIds = new Set(newItems.map(item => item.id));
            // 过滤掉要被覆盖的物品
            const filteredItems = currentItems.filter(item => !importIds.has(item.id));
            // 返回合并后的结果
            return [...filteredItems, ...newItems];
        } else {
            // 简单地添加新物品
            return [...currentItems, ...newItems];
        }
    }
}

/**
 * 创建物品服务实例
 * @returns 物品服务实例
 */
export function createItemService(): ItemService {
    return new ItemService();
}
import type { Recipe, Item_For_Recipe } from "../types";
import { v4 as uuidv4 } from 'uuid';

export class RecipeService {
    /**
     * 验证配方名称
     * @param name 配方名称
     * @throws 如果名称为空则抛出错误
     */
    validateRecipeName(name?: string): void {
        if (name !== undefined && !name.trim()) {
            throw new Error("配方名称不能为空");
        }
    }

    /**
     * 根据ID获取配方
     * @param recipes 配方列表
     * @param id 配方ID
     * @returns 配方对象或undefined
     */
    getRecipeById(recipes: Recipe[], id: string): Recipe | undefined {
        return recipes.find(recipe => recipe.id === id);
    }

    /**
     * 根据名称搜索配方
     * @param recipes 配方列表
     * @param query 搜索关键词
     * @returns 匹配的配方列表
     */
    searchRecipes(recipes: Recipe[], query: string): Recipe[] {
        const lowercaseQuery = query.toLowerCase();
        return recipes.filter(recipe =>
            recipe.name.toLowerCase().includes(lowercaseQuery)
        );
    }

    /**
     * 创建新配方
     * @param name 新配方名称
     * @param input 输入物品列表
     * @param output 输出物品列表
     * @returns 新创建的配方对象
     */
    createRecipe(name: string, input: Item_For_Recipe[], output: Item_For_Recipe[]): Recipe {
        this.validateRecipeName(name);

        if (input.length === 0) {
            throw new Error("配方必须包含至少一个输入物品");
        }

        if (output.length === 0) {
            throw new Error("配方必须包含至少一个输出物品");
        }

        return {
            id: uuidv4(),
            name: name.trim(),
            input: [...input],
            output: [...output]
        };
    }

    /**
     * 准备配方更新
     * @param recipe 原配方
     * @param updates 更新内容
     * @returns 更新后的配方
     */
    prepareRecipeUpdate(recipe: Recipe, updates: Partial<Omit<Recipe, 'id'>>): Recipe {
        if (updates.name !== undefined) {
            this.validateRecipeName(updates.name);
        }

        return {
            ...recipe,
            ...updates,
            ...(updates.name && { name: updates.name.trim() })
        };
    }

    /**
     * 检查配方名称是否已存在
     * @param recipes 配方列表
     * @param name 配方名称
     * @param excludeId 要排除的配方ID（更新时使用）
     * @returns 名称是否已被使用
     */
    isNameTaken(recipes: Recipe[], name: string, excludeId?: string): boolean {
        return recipes.some(recipe => 
            recipe.name.toLowerCase() === name.toLowerCase() && 
            recipe.id !== excludeId
        );
    }

    /**
     * 按名称排序配方
     * @param recipes 配方列表
     * @param ascending 是否升序排序
     * @returns 排序后的配方列表
     */
    sortRecipesByName(recipes: Recipe[], ascending: boolean = true): Recipe[] {
        return [...recipes].sort((a, b) =>
            ascending
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name)
        );
    }

    /**
     * 验证配方数据完整性
     * @param recipe 配方对象
     * @throws 如果数据不完整则抛出错误
     */
    validateRecipe(recipe: Recipe): void {
        if (!recipe.id) {
            throw new Error("配方ID不能为空");
        }
        
        if (!recipe.name || !recipe.name.trim()) {
            throw new Error("配方名称不能为空");
        }
        
        if (!recipe.input || recipe.input.length === 0) {
            throw new Error("配方必须包含至少一个输入物品");
        }
        
        if (!recipe.output || recipe.output.length === 0) {
            throw new Error("配方必须包含至少一个输出物品");
        }
    }

    /**
     * 批量导入配方
     * @param currentRecipes 当前配方列表
     * @param newRecipes 要导入的配方
     * @param overwrite 是否覆盖同ID配方
     * @returns 合并后的配方列表
     */
    processRecipeImport(currentRecipes: Recipe[], newRecipes: Recipe[], overwrite: boolean = false): Recipe[] {
        if (!Array.isArray(newRecipes)) {
            throw new Error("导入的配方必须是一个数组");
        }

        // 验证所有导入的配方
        newRecipes.forEach((recipe, index) => {
            try {
                this.validateRecipe(recipe);
            } catch (error) {
                throw new Error(`导入的配方 #${index + 1} 无效: ${error instanceof Error ? error.message : '未知错误'}`);
            }
        });

        if (overwrite) {
            // 创建导入配方ID集合
            const importIds = new Set(newRecipes.map(recipe => recipe.id));
            // 过滤掉要被覆盖的配方
            const filteredRecipes = currentRecipes.filter(recipe => !importIds.has(recipe.id));
            // 返回合并后的结果
            return [...filteredRecipes, ...newRecipes];
        } else {
            // 简单地添加新配方
            return [...currentRecipes, ...newRecipes];
        }
    }

    /**
     * 查找使用特定物品的配方
     * @param recipes 配方列表
     * @param itemId 物品ID
     * @returns 使用该物品的配方列表
     */
    findRecipesUsingItem(recipes: Recipe[], itemId: string): Recipe[] {
        return recipes.filter(recipe => 
            recipe.input.some(input => input.item.id === itemId) ||
            recipe.output.some(output => output.item.id === itemId)
        );
    }
}

/**
 * 创建配方服务实例
 * @returns 配方服务实例
 */
export function createRecipeService(): RecipeService {
    return new RecipeService();
}
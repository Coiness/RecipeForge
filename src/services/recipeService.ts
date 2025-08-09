import type { Recipe,Item_For_Recipe  } from "../types";
import {v4 as uuidv4} from 'uuid';

export class RecipeService {
    private recipes: Recipe[] = [];
    /**
     * 实现的功能
     * 1.创建配方
     * 2.获取所有配方
     * 3.根据ID获取配方
     * 4.根据名称搜索配方
     * 5.更新配方
     * 6.删除配方
     */

    constructor(initalRecipes: Recipe[]){
        this.recipes = [...initalRecipes]
    }

    /**
     * 获取所有配方
     * @returns 配方列表
     */
    getAllRecipes(): Recipe[] {
        return [...this.recipes];
    }

    /**
     * 根据ID获取配方
     * @param id 配方ID
     * @returns 配方对象或undefined
     */
    getRecipeById(id:string):Recipe | undefined{
        return this.recipes.find(recipe => recipe.id === id);
    }

    /**
     * 根据名称搜索配方
     * @param query 搜索关键词
     * @returns 匹配的配方列表
     */
    searchItems(query:string):Recipe[]{
        const lowercaseQuery = query.toLocaleLowerCase()
        return this.recipes.filter(item =>
            item.name.toLocaleLowerCase().includes(lowercaseQuery)
        )
    }

    /**
     * 创建新配方
     * @param name 新配方名称
     * @param input 输入物品列表
     * @param output 输出物品列表
     * @returns 新创建的配方对象
     */
    createRecipe(name:string, input:Item_For_Recipe[],output:Item_For_Recipe[]):Recipe{
        if(!name.trim()){
            throw new Error("配方名称不能为空")
        }

        const newRecipe: Recipe = {
            id: uuidv4(),
            name: name.trim(),
            input: [...input],
            output: [...output]
        }

        return newRecipe;
    }

    updateRecipe(id:string,updates:Partial<Omit<Recipe,'id'>>):Recipe{
        const index = this.recipes.findIndex(recipe => recipe.id === id);

        if(index === -1){
            throw new Error(`配方ID ${id}不存在`)
        }

        //不能用 || 连接，因为undefined无法调用trim()
        //如果updates.name存在且不为空，则使用trim()去除两端空格
        if(updates.name !== undefined && updates.name.trim()){
            throw new Error("配方名称不能为空");
        }

        const updatedRecipe: Recipe = {
            ...this.recipes[index],
            ...updates,
            ...(updates.name && {name:updates.name.trim()})
        }

        this.recipes[index] = updatedRecipe;
        return updatedRecipe;
    }

    /**
     * 删除配方
     * @param id 配方ID
     * @return 是否删除成功
     */
    deleteRecipe(id:string):boolean{
        const initialLength = this.recipes.length;
        this.recipes = this.recipes.filter(recipe => recipe.id !== id);
        return this.recipes.length < initialLength; // 如果长度减少了，说明删除成功
    }

    /**
     * todo: 批量导入配方
     */

    /**
     * todo: 批量导出配方
     */

    /**
     * 检查配方名称是否已存在
     * @param name 配方名称
     * @returns 如果存在则返回true，否则返回false
     */
    isNameTaken(name:string):boolean{
        return this.recipes.some(recipe => recipe.name.toLocaleLowerCase() === name.toLocaleLowerCase());
    }

    /**
     * 清空配方列表
     */
    clearRecipes():void {
        this.recipes = [];
    }

    /**
     * 按名称排序配方
     * @param ascending 是否升序排序
     * @return 排序后的配方列表
     */
    sortRecipesByName(ascending:boolean = true):Recipe[]{
        const sortedRecipes = [...this.recipes].sort((a,b)=>
            ascending
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name)
        )
        
        this.recipes = sortedRecipes; // 更新配方列表
        return sortedRecipes;
    }
}

/**
 * 创建配方服务实例
 * @param initialRecipes 初始配方列表
 * @return 配方服务实例
 */
export function createRecipeService(initialRecipes: Recipe[] = []): RecipeService {
    return new RecipeService(initialRecipes);
}
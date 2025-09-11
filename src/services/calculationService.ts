import type { Item_For_Recipe, Recipe } from "../types";
import type { Order } from "../types";

/**
 * 计算服务 - 处理配方和材料的计算逻辑，不存储状态
 */
export class CalculationService {
  /**
   * 创建配方查找映射，提高查询效率
   * @param recipes 配方列表
   * @returns 配方ID到配方对象的映射
   */
  createRecipeMap(recipes: Recipe[]): Map<string, Recipe> {
    const recipeMap = new Map<string, Recipe>();
    for (const recipe of recipes) {
      recipeMap.set(recipe.id, recipe);
    }
    return recipeMap;
  }

  /**
   * 计算单个配方所需的原料
   * @param recipes 可用的配方列表
   * @param recipeId 配方ID
   * @param amount 数量
   * @param recipePreferences 配方偏好设置
   * @returns 所需原料列表
   */
  calculateRecipeMaterials(
    recipes: Recipe[], 
    recipeId: string, 
    amount: number, 
    recipePreferences: Record<string, string> = {}
  ): Item_For_Recipe[] {
    const recipeMap = this.createRecipeMap(recipes);
    const recipe = recipeMap.get(recipeId);
    
    if (!recipe) {
      throw new Error(`配方 ${recipeId} 不存在`);
    }
    
    // 设置一个新的Set来跟踪已处理的配方，防止循环依赖
    const visitedRecipes = new Set<string>();
    
    return this.calculateRecursiveMaterials(
      recipes, 
      recipe, 
      amount, 
      visitedRecipes, 
      recipePreferences
    );
  }

  /**
   * 计算订单所需的所有原料
   * @param recipes 可用的配方列表
   * @param order 订单对象
   * @param recipePreferences 配方偏好设置
   * @returns 所需原料列表
   */
  calculateOrderMaterials(
    recipes: Recipe[], 
    order: Order, 
    recipePreferences: Record<string, string> = {}
  ): Item_For_Recipe[] {
    console.log('calculationService.calculateOrderMaterials', { order });
    if (!order || !order.recipes || order.recipes.length === 0) {
      console.log('订单为空或没有配方，返回空材料列表');
      return [];
    }

    let totalMaterials: Item_For_Recipe[] = [];
    const visitedRecipes = new Set<string>();

    // 处理订单中的每个配方
    for (const recipeOrder of order.recipes) {
      const recipe = recipeOrder.recipe;
      const amount = recipeOrder.amount;
      
      const materials = this.calculateRecursiveMaterials(
        recipes, 
        recipe, 
        amount, 
        visitedRecipes, 
        recipePreferences
      );
      totalMaterials = this.mergeMaterials(totalMaterials, materials);
    }

    return totalMaterials;
  }

  /**
   * 批量计算多个订单所需的原料
   * @param recipes 可用的配方列表
   * @param orders 订单列表
   * @param recipePreferences 配方偏好设置
   * @returns 所需原料的总和
   */
  calculateBulkOrders(
    recipes: Recipe[], 
    orders: Order[], 
    recipePreferences: Record<string, string> = {}
  ): Item_For_Recipe[] {
    if (!orders || orders.length === 0) {
      return [];
    }

    let totalMaterials: Item_For_Recipe[] = [];

    for (const order of orders) {
      const orderMaterials = this.calculateOrderMaterials(recipes, order, recipePreferences);
      totalMaterials = this.mergeMaterials(totalMaterials, orderMaterials);
    }

    return totalMaterials;
  }

  /**
   * 递归计算配方所需的原料（包括子配方）
   * @param recipes 可用的配方列表
   * @param recipe 配方对象
   * @param amount 需要的数量
   * @param visitedRecipes 已访问的配方集合，用于检测循环依赖
   * @param recipePreferences 配方偏好设置
   * @returns 所需原料列表
   * @private
   */
  private calculateRecursiveMaterials(
    recipes: Recipe[],
    recipe: Recipe, 
    amount: number, 
    visitedRecipes: Set<string>,
    recipePreferences: Record<string, string> = {}
  ): Item_For_Recipe[] {
    // 检测循环依赖
    if (visitedRecipes.has(recipe.id)) {
      throw new Error(`检测到循环依赖: ${recipe.name}`);
    }
    
    visitedRecipes.add(recipe.id);
    let materials: Item_For_Recipe[] = [];

    // 计算每个输入物品的需求量
    for (const input of recipe.input) {
      const requiredAmount = input.amount * amount;
      
      // 检查这个输入物品是否也可以由另一个配方生产
      const subRecipe = this.findRecipeByOutput(recipes, input.item.id, recipePreferences);
      
      if (subRecipe && subRecipe.id !== recipe.id) { // 避免直接自引用
        // 找到子配方可以生产多少该物品
        const outputAmount = this.getOutputAmount(subRecipe, input.item.id);
        // 需要执行子配方的次数（向上取整）
        const subRecipeAmount = Math.ceil(requiredAmount / outputAmount);
        
        // 递归计算子配方的材料需求
        // 创建新的 Set 来避免共享引用
        const subMaterials = this.calculateRecursiveMaterials(
          recipes,
          subRecipe, 
          subRecipeAmount, 
          new Set(visitedRecipes),
          recipePreferences
        );
        
        materials = this.mergeMaterials(materials, subMaterials);
      } else {
        // 如果没有生产该物品的配方，将其作为基础材料添加
        materials.push({
          item: input.item,
          amount: requiredAmount
        });
      }
    }

    return materials;
  }

  /**
   * 查找可以生产指定物品的配方
   * @param recipes 可用的配方列表
   * @param itemId 物品ID
   * @param recipePreferences 配方偏好设置
   * @returns 可以生产该物品的配方，如果没有则返回undefined
   */
  findRecipeByOutput(
    recipes: Recipe[], 
    itemId: string, 
    recipePreferences: Record<string, string> = {}
  ): Recipe | undefined {
    console.log('calculationService.findRecipeByOutput', { itemId, recipePreferences });
    const preferredRecipeId = recipePreferences[itemId];
    if (preferredRecipeId) {
      const preferredRecipe = recipes.find(r => r.id === preferredRecipeId);
      if (preferredRecipe && preferredRecipe.output.some(output => output.item.id === itemId)) {
        return preferredRecipe;
      }
    }

    return recipes.find(recipe => 
      recipe.output.some(output => output.item.id === itemId)
    );
  }

  /**
   * 获取所有可以生产指定物品的配方
   * @param recipes 可用的配方列表
   * @param itemId 物品ID
   * @returns 生产该物品的所有配方
   */
  getRecipesByOutput(recipes: Recipe[], itemId: string): Recipe[] {
    return recipes.filter(recipe => 
      recipe.output.some(output => output.item.id === itemId)
    );
  }

  /**
   * 获取使用指定物品作为输入的所有配方
   * @param recipes 可用的配方列表
   * @param itemId 物品ID
   * @returns 使用该物品的所有配方
   */
  getRecipesByInput(recipes: Recipe[], itemId: string): Recipe[] {
    return recipes.filter(recipe => 
      recipe.input.some(input => input.item.id === itemId)
    );
  }

  /**
   * 获取配方中特定输出物品的数量
   * @param recipe 配方
   * @param itemId 物品ID
   * @returns 输出数量
   */
  getOutputAmount(recipe: Recipe, itemId: string): number {
    const outputItem = recipe.output.find(output => output.item.id === itemId);
    return outputItem ? outputItem.amount : 0;
  }

  /**
   * 合并两个材料列表，相同物品的数量相加
   * @param listA 第一个材料列表
   * @param listB 第二个材料列表
   * @returns 合并后的材料列表
   */
  mergeMaterials(listA: Item_For_Recipe[], listB: Item_For_Recipe[]): Item_For_Recipe[] {
    const result = [...listA];
    
    for (const itemB of listB) {
      const existingItem = result.find(item => item.item.id === itemB.item.id);
      
      if (existingItem) {
        existingItem.amount += itemB.amount;
      } else {
        result.push({ ...itemB });
      }
    }
    
    return result;
  }

  /**
   * 检查配方中是否存在循环依赖
   * @param recipes 可用的配方列表
   * @param recipe 要检查的配方
   * @param recipePreferences 配方偏好设置
   * @returns 是否存在循环依赖
   */
  checkCircularDependency(
    recipes: Recipe[], 
    recipe: Recipe, 
    recipePreferences: Record<string, string> = {}
  ): boolean {
    try {
      this.calculateRecipeMaterials(recipes, recipe.id, 1, recipePreferences);
      return false; // 没有检测到循环依赖
    } catch (error) {
      if (error instanceof Error && error.message.includes("循环依赖")) {
        return true; // 检测到循环依赖
      }
      throw error; // 其他错误重新抛出
    }
  }

  /**
   * 获取配方的所有依赖层级（用于展示配方的制作层级结构）
   * @param recipes 可用的配方列表
   * @param recipeId 配方ID
   * @param recipePreferences 配方偏好设置
   * @returns 配方依赖层级结构
   */
  getRecipeDependencyTree(
    recipes: Recipe[], 
    recipeId: string, 
    recipePreferences: Record<string, string> = {}
  ): any {
    const recipeMap = this.createRecipeMap(recipes);
    const recipe = recipeMap.get(recipeId);
    console.log('calculationService.getRecipeDependencyTree', { recipeId, recipePreferences });
    
    if (!recipe) {
      throw new Error(`配方 ${recipeId} 不存在`);
    }
    
    return this.buildDependencyTree(recipes, recipe, new Set<string>(), recipePreferences);
  }
  
  /**
   * 构建配方依赖树
   * @param recipes 可用的配方列表
   * @param recipe 配方
   * @param visited 已访问的配方ID集合
   * @param recipePreferences 配方偏好设置
   * @returns 依赖树结构
   * @private
   */
  private buildDependencyTree(
    recipes: Recipe[],
    recipe: Recipe, 
    visited: Set<string>,
    recipePreferences: Record<string, string> = {}
  ): any {
    console.log('calculationService.buildDependencyTree', { recipe });
    if (visited.has(recipe.id)) {
      return { name: recipe.name, circular: true };
    }
    
    visited.add(recipe.id);
    
    const dependencies = recipe.input.map(input => {
      const subRecipe = this.findRecipeByOutput(recipes, input.item.id, recipePreferences);
      if (subRecipe) {
        return {
          item: input.item.name,
          amount: input.amount,
          recipe: this.buildDependencyTree(recipes, subRecipe, new Set(visited), recipePreferences)
        };
      } else {
        return {
          item: input.item.name,
          amount: input.amount,
          basic: true
        };
      }
    });
    
    return {
      name: recipe.name,
      id: recipe.id,
      dependencies
    };
  }
}

/**
 * 创建计算服务实例
 * @returns 计算服务实例
 */
export function createCalculationService(): CalculationService {
  return new CalculationService();
}
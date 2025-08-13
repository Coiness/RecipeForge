import type { Item, Item_For_Recipe,Recipe, Recipe_For_Order  } from "../types";
import type { Order } from "../types";

/**
 * 计算服务 - 处理配方和材料的计算逻辑
 */
export class CalculationService {
  private recipes: Recipe[] = [];
  private recipeMap: Map<string, Recipe> = new Map(); // 用于快速查找配方

  /**
   * 初始化计算服务
   * @param recipes 可用的配方列表
   */
  constructor(recipes: Recipe[] = []) {
    this.setRecipes(recipes);
  }

  /**
   * 更新可用的配方列表
   * @param recipes 新的配方列表
   */
  setRecipes(recipes: Recipe[]): void {
    this.recipes = [...recipes];
    
    // 构建配方查找映射，提高查询效率
    this.recipeMap.clear();
    for (const recipe of recipes) {
      this.recipeMap.set(recipe.id, recipe);
    }
  }

  /**
   * 计算单个配方所需的原料
   * @param recipeId 配方ID
   * @param amount 数量
   * @returns 所需原料列表
   */
  calculateRecipeMaterials(recipeId: string, amount: number): Item_For_Recipe[] {
    const recipe = this.recipeMap.get(recipeId);
    if (!recipe) {
      throw new Error(`配方 ${recipeId} 不存在`);
    }
    
    // 设置一个新的Set来跟踪已处理的配方，防止循环依赖
    const visitedRecipes = new Set<string>();
    
    return this.calculateRecursiveMaterials(recipe, amount, visitedRecipes);
  }

  /**
   * 计算订单所需的所有原料
   * @param order 订单对象
   * @returns 所需原料列表
   */
  calculateOrderMaterials(order: Order): Item_For_Recipe[] {
    if (!order || !order.recipes || order.recipes.length === 0) {
      return [];
    }

    let totalMaterials: Item_For_Recipe[] = [];
    const visitedRecipes = new Set<string>();

    // 处理订单中的每个配方
    for (const recipeOrder of order.recipes) {
      const recipe = recipeOrder.recipe;
      const amount = recipeOrder.amount;
      
      const materials = this.calculateRecursiveMaterials(recipe, amount, visitedRecipes);
      totalMaterials = this.mergeMaterials(totalMaterials, materials);
    }

    return totalMaterials;
  }

  /**
   * 批量计算多个订单所需的原料
   * @param orders 订单列表
   * @returns 所需原料的总和
   */
  calculateBulkOrders(orders: Order[]): Item_For_Recipe[] {
    if (!orders || orders.length === 0) {
      return [];
    }

    let totalMaterials: Item_For_Recipe[] = [];

    for (const order of orders) {
      const orderMaterials = this.calculateOrderMaterials(order);
      totalMaterials = this.mergeMaterials(totalMaterials, orderMaterials);
    }

    return totalMaterials;
  }

  /**
   * 递归计算配方所需的原料（包括子配方）
   * @param recipe 配方对象
   * @param amount 需要的数量
   * @param visitedRecipes 已访问的配方集合，用于检测循环依赖
   * @returns 所需原料列表
   * @private
   */
  private calculateRecursiveMaterials(
    recipe: Recipe, 
    amount: number, 
    visitedRecipes: Set<string>
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
      const subRecipe = this.findRecipeByOutput(input.item.id);
      
      if (subRecipe && subRecipe.id !== recipe.id) { // 避免直接自引用
        // 找到子配方可以生产多少该物品
        const outputAmount = this.getOutputAmount(subRecipe, input.item.id);
        // 需要执行子配方的次数（向上取整）
        const subRecipeAmount = Math.ceil(requiredAmount / outputAmount);
        
        // 递归计算子配方的材料需求
        // 创建新的 Set 来避免共享引用
        const subMaterials = this.calculateRecursiveMaterials(
          subRecipe, 
          subRecipeAmount, 
          new Set(visitedRecipes)
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
   * @param itemId 物品ID
   * @returns 可以生产该物品的配方，如果没有则返回undefined
   * @private
   */
  private findRecipeByOutput(itemId: string): Recipe | undefined {
    return this.recipes.find(recipe => 
      recipe.output.some(output => output.item.id === itemId)
    );
  }

  /**
   * 获取配方中特定输出物品的数量
   * @param recipe 配方
   * @param itemId 物品ID
   * @returns 输出数量
   * @private
   */
  private getOutputAmount(recipe: Recipe, itemId: string): number {
    const outputItem = recipe.output.find(output => output.item.id === itemId);
    return outputItem ? outputItem.amount : 0;
  }

  /**
   * 合并两个材料列表，相同物品的数量相加
   * @param listA 第一个材料列表
   * @param listB 第二个材料列表
   * @returns 合并后的材料列表
   * @private
   */
  private mergeMaterials(listA: Item_For_Recipe[], listB: Item_For_Recipe[]): Item_For_Recipe[] {
    const result = [...listA];
    
    for (const itemB of listB) {
      // 在结果列表中查找相同物品
      const existingItem = result.find(item => item.item.id === itemB.item.id);
      
      if (existingItem) {
        // 如果已存在，增加数量
        existingItem.amount += itemB.amount;
      } else {
        // 如果不存在，添加到结果列表
        result.push({ ...itemB });
      }
    }
    
    return result;
  }

  /**
   * 检查配方中是否存在循环依赖
   * @param recipe 要检查的配方
   * @returns 是否存在循环依赖
   */
  checkCircularDependency(recipe: Recipe): boolean {
    try {
      this.calculateRecipeMaterials(recipe.id, 1);
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
   * @param recipeId 配方ID
   * @returns 配方依赖层级结构
   */
  getRecipeDependencyTree(recipeId: string): any {
    const recipe = this.recipeMap.get(recipeId);
    if (!recipe) {
      throw new Error(`配方 ${recipeId} 不存在`);
    }
    
    return this.buildDependencyTree(recipe, new Set<string>());
  }

  /**
   * 构建配方依赖树
   * @param recipe 配方
   * @param visited 已访问的配方ID集合
   * @returns 依赖树结构
   * @private
   */
  private buildDependencyTree(recipe: Recipe, visited: Set<string>): any {
    if (visited.has(recipe.id)) {
      return { name: recipe.name, circular: true };
    }
    
    visited.add(recipe.id);
    
    const dependencies = recipe.input.map(input => {
      const subRecipe = this.findRecipeByOutput(input.item.id);
      if (subRecipe) {
        return {
          item: input.item.name,
          amount: input.amount,
          recipe: this.buildDependencyTree(subRecipe, new Set(visited))
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
 * @param recipes 初始配方列表
 * @returns 计算服务实例
 */
export function createCalculationService(recipes: Recipe[] = []): CalculationService {
  return new CalculationService(recipes);
}
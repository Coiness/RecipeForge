import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';

const useOrderCalculator = () => {
  const [calculationResult, setCalculationResult] = useState(null);

  // 从 Redux 获取数据
  const recipes = useSelector((state) => state.recipes.recipes);
  const inventory = useSelector((state) => state.inventory.items);
  const currentOrder = useSelector((state) => state.orders.currentOrder);

  // 获取库存中某个材料的可用数量
  const getAvailableQuantity = (materialName) => {
    const inventoryItem = inventory.find(item => item.name === materialName);
    return inventoryItem ? inventoryItem.quantity : 0;
  };

  // 根据配方ID查找配方
  const getRecipeById = (recipeId) => {
    return recipes.find(recipe => recipe.id === recipeId);
  };

  // 计算订单的总原料需求
  const calculateOrderRequirements = () => {
    if (!currentOrder.items || currentOrder.items.length === 0) {
      setCalculationResult({
        totalMaterials: [],
        canCraftAll: false,
        orderItems: [],
        summary: {
          totalRecipes: 0,
          sufficientMaterials: 0,
          insufficientMaterials: 0
        }
      });
      return;
    }

    // 存储所有原料需求的总和
    const materialRequirements = new Map();
    const orderItemsDetails = [];

    // 遍历订单中的每个配方
    currentOrder.items.forEach(orderItem => {
      const recipe = getRecipeById(orderItem.recipeId);
      
      if (!recipe || !recipe.ingredients) {
        return;
      }

      // 计算这个配方的原料需求
      const recipeRequirements = recipe.ingredients.map(ingredient => ({
        name: ingredient.name,
        required: ingredient.quantity * orderItem.quantity,
        available: getAvailableQuantity(ingredient.name)
      }));

      // 累加到总原料需求中
      recipeRequirements.forEach(requirement => {
        const existing = materialRequirements.get(requirement.name);
        if (existing) {
          existing.required += requirement.required;
        } else {
          materialRequirements.set(requirement.name, {
            name: requirement.name,
            required: requirement.required,
            available: requirement.available
          });
        }
      });

      // 保存这个配方的详细信息
      orderItemsDetails.push({
        recipeId: orderItem.recipeId,
        recipeName: orderItem.recipeName,
        quantity: orderItem.quantity,
        materials: recipeRequirements,
        canCraft: recipeRequirements.every(req => req.available >= req.required)
      });
    });

    // 将 Map 转换为数组并添加是否充足的判断
    const totalMaterials = Array.from(materialRequirements.values()).map(material => ({
      ...material,
      sufficient: material.available >= material.required,
      shortage: Math.max(0, material.required - material.available)
    }));

    // 计算统计信息
    const summary = {
      totalRecipes: currentOrder.items.length,
      sufficientMaterials: totalMaterials.filter(m => m.sufficient).length,
      insufficientMaterials: totalMaterials.filter(m => !m.sufficient).length
    };

    // 判断是否可以制作所有物品
    const canCraftAll = totalMaterials.every(material => material.sufficient);

    const result = {
      totalMaterials,
      canCraftAll,
      orderItems: orderItemsDetails,
      summary
    };

    setCalculationResult(result);
    return result;
  };

  // 使用 useMemo 优化计算，只在依赖项变化时重新计算
  const memoizedResult = useMemo(() => {
    if (currentOrder.items && currentOrder.items.length > 0) {
      return calculateOrderRequirements();
    }
    return null;
  }, [currentOrder.items, recipes, inventory]);

  // 获取不足的材料列表
  const getShortageList = () => {
    if (!calculationResult) return [];
    return calculationResult.totalMaterials.filter(material => !material.sufficient);
  };

  // 获取充足的材料列表
  const getSufficientList = () => {
    if (!calculationResult) return [];
    return calculationResult.totalMaterials.filter(material => material.sufficient);
  };

  // 计算总的制作成本（如果有价格信息）
  const calculateTotalCost = () => {
    if (!calculationResult) return 0;
    // 这里可以根据材料价格计算总成本
    // 现在先返回 0，后续可以扩展
    return 0;
  };

  return {
    // 数据
    currentOrder,
    calculationResult: memoizedResult,
    
    // 方法
    calculateOrderRequirements,
    getShortageList,
    getSufficientList,
    calculateTotalCost,
    getAvailableQuantity,
    getRecipeById,
    
    // 便捷属性
    canCraftAll: memoizedResult?.canCraftAll || false,
    totalMaterials: memoizedResult?.totalMaterials || [],
    orderItems: memoizedResult?.orderItems || [],
    summary: memoizedResult?.summary || {
      totalRecipes: 0,
      sufficientMaterials: 0,
      insufficientMaterials: 0
    }
  };
};

export default useOrderCalculator;
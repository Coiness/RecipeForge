import { useState } from 'react';
import { useSelector } from 'react-redux';

const useCalculator = () => {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [targetQuantity, setTargetQuantity] = useState(1);
  const [calculatedMaterials, setCalculatedMaterials] = useState([]);
  const [canCraft, setCanCraft] = useState(false);

  // 从 Redux 获取配方和库存
  const recipes = useSelector((state) => state.recipes.recipes);
  const inventory = useSelector((state) => state.inventory.items);

  // 计算材料需求
  const calculateRequirements = (recipe, quantity = 1) => {
    if (!recipe || !recipe.ingredients) {
      setCalculatedMaterials([]);
      return;
    }

    const requiredMaterials = recipe.ingredients.map(ingredient => ({
      name: ingredient.name,
      required: ingredient.quantity * quantity,
      available: getAvailableQuantity(ingredient.name),
      sufficient: getAvailableQuantity(ingredient.name) >= (ingredient.quantity * quantity)
    }));

    setCalculatedMaterials(requiredMaterials);
    setCanCraft(requiredMaterials.every(material => material.sufficient));
  };

  // 获取库存中某个材料的可用数量
  const getAvailableQuantity = (materialName) => {
    const inventoryItem = inventory.find(item => item.name === materialName);
    return inventoryItem ? inventoryItem.quantity : 0;
  };

  // 选择配方
  const selectRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    calculateRequirements(recipe, targetQuantity);
  };

  // 设置目标数量
  const setQuantity = (quantity) => {
    setTargetQuantity(quantity);
    if (selectedRecipe) {
      calculateRequirements(selectedRecipe, quantity);
    }
  };

  // 执行合成计算
  const performCrafting = () => {
    if (!canCraft || !selectedRecipe) {
      return { success: false, message: '材料不足或未选择配方' };
    }

    return {
      success: true,
      message: `可以制作 ${targetQuantity} 个 ${selectedRecipe.result}`,
      result: {
        item: selectedRecipe.result,
        quantity: targetQuantity,
        materials: calculatedMaterials
      }
    };
  };

  return {
    recipes,
    selectedRecipe,
    targetQuantity,
    calculatedMaterials,
    canCraft,
    selectRecipe,
    setQuantity,
    calculateRequirements,
    performCrafting,
    getAvailableQuantity
  };
};

export default useCalculator;
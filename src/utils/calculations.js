function calculateMaterialRequirements(recipes, inventory) {
  const requirements = {};

  recipes.forEach(recipe => {
    recipe.ingredients.forEach(ingredient => {
      const { name, quantity } = ingredient;
      requirements[name] = (requirements[name] || 0) + quantity;
    });
  });

  return requirements;
}

function checkInventorySufficiency(requirements, inventory) {
  return Object.keys(requirements).every(item => {
    const available = inventory[item] || 0;
    return available >= requirements[item];
  });
}

function calculateCraftingTime(recipe) {
  return recipe.baseTime * recipe.complexity; // Example calculation
}

export { calculateMaterialRequirements, checkInventorySufficiency, calculateCraftingTime };
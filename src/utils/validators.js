function validateRecipeInput(recipe) {
  if (!recipe.name || recipe.name.trim() === '') {
    return 'Recipe name is required.';
  }
  if (!Array.isArray(recipe.ingredients) || recipe.ingredients.length === 0) {
    return 'At least one ingredient is required.';
  }
  for (const ingredient of recipe.ingredients) {
    if (!ingredient.name || ingredient.quantity <= 0) {
      return 'Each ingredient must have a valid name and quantity.';
    }
  }
  return null; // No errors
}

function validateInventoryItem(item) {
  if (!item.name || item.name.trim() === '') {
    return 'Item name is required.';
  }
  if (item.quantity < 0) {
    return 'Quantity cannot be negative.';
  }
  return null; // No errors
}

export { validateRecipeInput, validateInventoryItem };
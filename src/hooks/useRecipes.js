import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addRecipe, removeRecipe, updateRecipe, selectRecipe, clearSelectedRecipe } from '../store/recipeSlice';

const useRecipes = () => {
  const dispatch = useDispatch();
  const recipes = useSelector((state) => state.recipes.recipes);
  const selectedRecipe = useSelector((state) => state.recipes.selectedRecipe);
  const [loading, setLoading] = useState(false);

  // 添加配方
  const createRecipe = (recipe) => {
    dispatch(addRecipe({
      id: Date.now(),
      ...recipe
    }));
  };

  // 更新配方
  const editRecipe = (id, updatedRecipe) => {
    dispatch(updateRecipe({ id, ...updatedRecipe }));
  };

  // 删除配方
  const deleteRecipe = (id) => {
    dispatch(removeRecipe(id));
  };

  // 选择配方
  const selectRecipeById = (recipe) => {
    dispatch(selectRecipe(recipe));
  };

  // 清除选中的配方
  const clearSelection = () => {
    dispatch(clearSelectedRecipe());
  };

  return { 
    recipes, 
    selectedRecipe,
    loading, 
    createRecipe, 
    editRecipe, 
    deleteRecipe,
    selectRecipeById,
    clearSelection
  };
};

export default useRecipes;
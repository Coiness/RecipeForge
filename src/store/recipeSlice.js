import { createSlice } from '@reduxjs/toolkit';

const recipeSlice = createSlice({
  name: 'recipes',
  initialState: {
    recipes: [],
    selectedRecipe: null,
  },
  reducers: {
    addRecipe(state, action) {
      state.recipes.push(action.payload);
    },
    removeRecipe(state, action) {
      state.recipes = state.recipes.filter(recipe => recipe.id !== action.payload);
    },
    updateRecipe(state, action) {
      const index = state.recipes.findIndex(recipe => recipe.id === action.payload.id);
      if (index !== -1) {
        state.recipes[index] = action.payload;
      }
    },
    selectRecipe(state, action) {
      state.selectedRecipe = action.payload;
    },
    clearSelectedRecipe(state) {
      state.selectedRecipe = null;
    },
  },
});

export const { addRecipe, removeRecipe, updateRecipe, selectRecipe, clearSelectedRecipe } = recipeSlice.actions;

export default recipeSlice.reducer;
import React, { useState } from 'react';
import './index.css';
import useRecipes from '../../hooks/useRecipes';
import RecipeCard from './RecipeCard';
import RecipeForm from './RecipeForm';

const RecipeList = () => {
  const { recipes, loading, createRecipe, deleteRecipe } = useRecipes();
  const [showForm, setShowForm] = useState(false);

  const handleAddRecipe = (recipeData) => {
    createRecipe(recipeData);
    setShowForm(false);
  };

  const handleDeleteRecipe = (id) => {
    if (window.confirm('确定要删除这个配方吗？')) {
      deleteRecipe(id);
    }
  };

  if (loading) {
    return (
      <div className="recipe-list">
        <div className="loading">加载中...</div>
      </div>
    );
  }

  return (
    <div className="recipe-list">
      <div className="recipe-list-header">
        <h2>Recipe List</h2>
        <button 
          className="add-recipe-btn"
          onClick={() => setShowForm(true)}
        >
          添加配方
        </button>
      </div>

      {showForm && (
        <div className="recipe-form-modal">
          <div className="recipe-form-backdrop" onClick={() => setShowForm(false)}></div>
          <div className="recipe-form-container">
            <RecipeForm 
              onSubmit={handleAddRecipe}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {recipes.length === 0 ? (
        <div className="empty-state">
          <p>No recipes available. Please add some!</p>
          <button 
            className="empty-state-btn"
            onClick={() => setShowForm(true)}
          >
            创建第一个配方
          </button>
        </div>
      ) : (
        <ul className="recipe-grid">
          {recipes.map((recipe) => (
            <li key={recipe.id}>
              <RecipeCard 
                recipe={recipe} 
                onDelete={() => handleDeleteRecipe(recipe.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecipeList;
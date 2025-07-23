import React from 'react';
import './index.css';

const RecipeCard = ({ recipe, onDelete, onEdit }) => {
  return (
    <div className="recipe-card">
      <div className="recipe-card-header">
        <h2>{recipe.name}</h2>
        <div className="recipe-card-actions">
          {onEdit && (
            <button className="edit-btn" onClick={() => onEdit(recipe)}>
              编辑
            </button>
          )}
          {onDelete && (
            <button className="delete-btn" onClick={onDelete}>
              删除
            </button>
          )}
        </div>
      </div>

      <h3>Ingredients:</h3>
      <ul>
        {recipe.ingredients?.map((ingredient, index) => (
          <li key={index}>
            {ingredient.name} - {ingredient.quantity}
          </li>
        ))}
      </ul>

      <h3>Result:</h3>
      <p>{recipe.result}</p>
    </div>
  );
};

export default RecipeCard;
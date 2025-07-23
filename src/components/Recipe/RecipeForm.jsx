import React, { useState } from 'react';
import './index.css';

const RecipeForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [recipeName, setRecipeName] = useState(initialData?.name || '');
  const [ingredients, setIngredients] = useState(initialData?.ingredients || []);
  const [result, setResult] = useState(initialData?.result || '');
  const [currentIngredient, setCurrentIngredient] = useState({ name: '', quantity: 1 });

  const handleAddIngredient = () => {
    if (currentIngredient.name.trim()) {
      setIngredients([...ingredients, { ...currentIngredient }]);
      setCurrentIngredient({ name: '', quantity: 1 });
    }
  };

  const handleRemoveIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!recipeName.trim() || ingredients.length === 0 || !result.trim()) {
      alert('请填写完整的配方信息');
      return;
    }

    onSubmit({
      name: recipeName,
      ingredients: ingredients,
      result: result
    });
  };

  return (
    <form className="recipe-form" onSubmit={handleSubmit}>
      <h2>{initialData ? '编辑配方' : '添加新配方'}</h2>
      
      <div className="form-group">
        <label htmlFor="recipe-name">配方名称</label>
        <input
          id="recipe-name"
          type="text"
          value={recipeName}
          onChange={(e) => setRecipeName(e.target.value)}
          placeholder="输入配方名称"
          required
        />
      </div>

      <div className="form-group">
        <label>材料列表</label>
        <div className="ingredient-input">
          <input
            type="text"
            value={currentIngredient.name}
            onChange={(e) => setCurrentIngredient({...currentIngredient, name: e.target.value})}
            placeholder="材料名称"
          />
          <input
            type="number"
            value={currentIngredient.quantity}
            onChange={(e) => setCurrentIngredient({...currentIngredient, quantity: parseInt(e.target.value) || 1})}
            min="1"
            placeholder="数量"
          />
          <button type="button" onClick={handleAddIngredient}>添加</button>
        </div>
        
        {ingredients.length > 0 && (
          <ul className="ingredients-list">
            {ingredients.map((ingredient, index) => (
              <li key={index}>
                <span>{ingredient.name} x {ingredient.quantity}</span>
                <button type="button" onClick={() => handleRemoveIngredient(index)}>删除</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="recipe-result">产出物品</label>
        <input
          id="recipe-result"
          type="text"
          value={result}
          onChange={(e) => setResult(e.target.value)}
          placeholder="输入产出物品"
          required
        />
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="cancel-btn">
          取消
        </button>
        <button type="submit" className="submit-btn">
          {initialData ? '更新' : '添加'}
        </button>
      </div>
    </form>
  );
};

export default RecipeForm;
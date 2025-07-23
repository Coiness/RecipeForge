import React, { useState } from 'react';
import useCalculator from '../../hooks/useCalculator';
import MaterialRequirement from './MaterialRequirement';
import './index.css';

function CraftingCalculator() {
  const {
    recipes,
    selectedRecipe,
    targetQuantity,
    calculatedMaterials,
    canCraft,
    selectRecipe,
    setQuantity,
    performCrafting
  } = useCalculator();

  const [craftingResult, setCraftingResult] = useState(null);

  const handleRecipeSelect = (e) => {
    const recipeId = parseInt(e.target.value);
    const recipe = recipes.find(r => r.id === recipeId);
    if (recipe) {
      selectRecipe(recipe);
      setCraftingResult(null);
    }
  };

  const handleQuantityChange = (e) => {
    const quantity = parseInt(e.target.value) || 1;
    setQuantity(quantity);
    setCraftingResult(null);
  };

  const handleCalculate = () => {
    const result = performCrafting();
    setCraftingResult(result);
  };

  return (
    <div className="crafting-calculator">
      <h2>Crafting Calculator</h2>

      {/* 配方选择区域 */}
      <div className="calculator-section">
        <div className="form-group">
          <label htmlFor="recipe-select">选择配方</label>
          <select 
            id="recipe-select"
            onChange={handleRecipeSelect}
            value={selectedRecipe?.id || ''}
          >
            <option value="">请选择一个配方</option>
            {recipes.map(recipe => (
              <option key={recipe.id} value={recipe.id}>
                {recipe.name} → {recipe.result}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="target-quantity">目标数量</label>
          <input
            id="target-quantity"
            type="number"
            min="1"
            value={targetQuantity}
            onChange={handleQuantityChange}
            placeholder="输入制作数量"
          />
        </div>

        <button 
          className="calculate-btn"
          onClick={handleCalculate}
          disabled={!selectedRecipe}
        >
          计算材料需求
        </button>
      </div>

      {/* 选中配方信息 */}
      {selectedRecipe && (
        <div className="selected-recipe">
          <h3>当前配方: {selectedRecipe.name}</h3>
          <div className="recipe-info">
            <div className="recipe-ingredients">
              <h4>所需材料 (单份):</h4>
              <ul>
                {selectedRecipe.ingredients.map((ingredient, index) => (
                  <li key={index}>
                    {ingredient.name} × {ingredient.quantity}
                  </li>
                ))}
              </ul>
            </div>
            <div className="recipe-result">
              <h4>产出:</h4>
              <p>{selectedRecipe.result} × {targetQuantity}</p>
            </div>
          </div>
        </div>
      )}

      {/* 材料需求计算结果 */}
      {calculatedMaterials.length > 0 && (
        <div className="materials-section">
          <MaterialRequirement materials={calculatedMaterials} />
          
          <div className="crafting-status">
            <div className={`status-indicator ${canCraft ? 'can-craft' : 'cannot-craft'}`}>
              <span className="status-icon">
                {canCraft ? '✅' : '❌'}
              </span>
              <span className="status-text">
                {canCraft ? '材料充足，可以制作' : '材料不足，无法制作'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 计算结果 */}
      {craftingResult && (
        <div className="crafting-result">
          <h3>计算结果</h3>
          <div className={`result-message ${craftingResult.success ? 'success' : 'error'}`}>
            <p>{craftingResult.message}</p>
            {craftingResult.success && craftingResult.result && (
              <div className="result-details">
                <p><strong>制作物品:</strong> {craftingResult.result.item}</p>
                <p><strong>制作数量:</strong> {craftingResult.result.quantity}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 空状态 */}
      {recipes.length === 0 && (
        <div className="empty-state">
          <p>暂无可用配方，请先添加一些配方</p>
        </div>
      )}
    </div>
  );
}

export default CraftingCalculator;
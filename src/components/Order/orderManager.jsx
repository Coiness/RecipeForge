import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createNewOrder,
  addRecipeToOrder,
  removeRecipeFromOrder,
  updateRecipeQuantityInOrder,
  saveCurrentOrder,
  clearCurrentOrder
} from '../../store/orderSlice';
import useOrderCalculator from '../../hooks/useOrderCalculator';

const OrderManager = () => {
  const dispatch = useDispatch();
  const [orderName, setOrderName] = useState('');
  const [showRecipeSelector, setShowRecipeSelector] = useState(false);

  // 获取数据
  const recipes = useSelector((state) => state.recipes.recipes);
  const currentOrder = useSelector((state) => state.orders.currentOrder);
  
  // 使用订单计算 hook
  const {
    canCraftAll,
    totalMaterials,
    orderItems,
    summary,
    getShortageList
  } = useOrderCalculator();

  // 创建新订单
  const handleCreateOrder = () => {
    dispatch(createNewOrder({ name: orderName || undefined }));
    setOrderName('');
  };

  // 添加配方到订单
  const handleAddRecipe = (recipe, quantity = 1) => {
    dispatch(addRecipeToOrder({
      recipeId: recipe.id,
      recipeName: recipe.name,
      quantity: quantity
    }));
    setShowRecipeSelector(false);
  };

  // 移除配方
  const handleRemoveRecipe = (recipeId) => {
    dispatch(removeRecipeFromOrder(recipeId));
  };

  // 更新数量
  const handleUpdateQuantity = (recipeId, quantity) => {
    if (quantity <= 0) {
      handleRemoveRecipe(recipeId);
    } else {
      dispatch(updateRecipeQuantityInOrder({ recipeId, quantity }));
    }
  };

  // 保存订单
  const handleSaveOrder = () => {
    dispatch(saveCurrentOrder());
    alert('订单已保存！');
  };

  // 清空订单
  const handleClearOrder = () => {
    dispatch(clearCurrentOrder());
  };

  return (
    <div className="order-manager" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>订单管理</h2>
      
      {/* 创建订单部分 */}
      <div className="order-creation" style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h3>创建新订单</h3>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="订单名称（可选）"
            value={orderName}
            onChange={(e) => setOrderName(e.target.value)}
            style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '3px' }}
          />
          <button onClick={handleCreateOrder} style={{ padding: '8px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
            创建订单
          </button>
        </div>
      </div>

      {/* 当前订单信息 */}
      {currentOrder.id && (
        <div className="current-order" style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3>当前订单: {currentOrder.name}</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowRecipeSelector(!showRecipeSelector)} style={{ padding: '8px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
                添加配方
              </button>
              <button onClick={handleSaveOrder} disabled={currentOrder.items.length === 0} style={{ padding: '8px 15px', backgroundColor: currentOrder.items.length === 0 ? '#ccc' : '#17a2b8', color: 'white', border: 'none', borderRadius: '3px', cursor: currentOrder.items.length === 0 ? 'not-allowed' : 'pointer' }}>
                保存订单
              </button>
              <button onClick={handleClearOrder} style={{ padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
                清空订单
              </button>
            </div>
          </div>

          {/* 配方选择器 */}
          {showRecipeSelector && (
            <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
              <h4>选择配方</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
                {recipes.map(recipe => (
                  <div key={recipe.id} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '3px', backgroundColor: 'white' }}>
                    <div>{recipe.name}</div>
                    <button onClick={() => handleAddRecipe(recipe)} style={{ marginTop: '5px', padding: '5px 10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '12px' }}>
                      添加
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 订单项目列表 */}
          {currentOrder.items.length > 0 && (
            <div className="order-items" style={{ marginBottom: '20px' }}>
              <h4>订单项目</h4>
              <div style={{ display: 'grid', gap: '10px' }}>
                {currentOrder.items.map(item => (
                  <div key={item.recipeId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', border: '1px solid #ddd', borderRadius: '3px' }}>
                    <span>{item.recipeName}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button onClick={() => handleUpdateQuantity(item.recipeId, item.quantity - 1)} style={{ padding: '2px 8px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
                        -
                      </button>
                      <span style={{ minWidth: '30px', textAlign: 'center' }}>{item.quantity}</span>
                      <button onClick={() => handleUpdateQuantity(item.recipeId, item.quantity + 1)} style={{ padding: '2px 8px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
                        +
                      </button>
                      <button onClick={() => handleRemoveRecipe(item.recipeId)} style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
                        删除
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 计算结果 */}
          {currentOrder.items.length > 0 && (
            <div className="calculation-result">
              <h4>材料需求计算</h4>
              
              {/* 统计信息 */}
              <div style={{ display: 'flex', gap: '20px', marginBottom: '15px', padding: '10px', backgroundColor: canCraftAll ? '#d4edda' : '#f8d7da', borderRadius: '3px' }}>
                <span>总配方数: {summary.totalRecipes}</span>
                <span>充足材料: {summary.sufficientMaterials}</span>
                <span>不足材料: {summary.insufficientMaterials}</span>
                <span style={{ fontWeight: 'bold', color: canCraftAll ? '#155724' : '#721c24' }}>
                  {canCraftAll ? '✅ 可以制作' : '❌ 材料不足'}
                </span>
              </div>

              {/* 材料列表 */}
              <div style={{ display: 'grid', gap: '10px' }}>
                {totalMaterials.map(material => (
                  <div key={material.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', border: '1px solid #ddd', borderRadius: '3px', backgroundColor: material.sufficient ? '#d4edda' : '#f8d7da' }}>
                    <span>{material.name}</span>
                    <span>
                      需要: {material.required} | 拥有: {material.available}
                      {!material.sufficient && <span style={{ color: '#721c24', marginLeft: '10px' }}>缺少: {material.shortage}</span>}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderManager;
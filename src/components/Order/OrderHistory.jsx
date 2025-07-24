import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadOrder, deleteOrder } from '../../store/orderSlice';
import useOrderCalculator from '../../hooks/useOrderCalculator';

const OrderHistory = () => {
  const dispatch = useDispatch();
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // 获取所有订单
  const orders = useSelector((state) => state.orders.orders);
  const currentOrder = useSelector((state) => state.orders.currentOrder);

  // 订单计算 hook
  const { calculateOrderRequirements } = useOrderCalculator();

  // 加载订单到当前编辑状态
  const handleLoadOrder = (orderId) => {
    dispatch(loadOrder(orderId));
    setSelectedOrderId(orderId);
  };

  // 删除订单
  const handleDeleteOrder = (orderId, orderName) => {
    if (window.confirm(`确定要删除订单 "${orderName}" 吗？`)) {
      dispatch(deleteOrder(orderId));
      if (selectedOrderId === orderId) {
        setSelectedOrderId(null);
        setShowDetails(false);
      }
    }
  };

  // 计算订单的材料需求预览
  const getOrderPreview = (order) => {
    const recipes = useSelector((state) => state.recipes.recipes);
    const inventory = useSelector((state) => state.inventory.items);

    const getRecipeById = (recipeId) => recipes.find(recipe => recipe.id === recipeId);
    const getAvailableQuantity = (materialName) => {
      const inventoryItem = inventory.find(item => item.name === materialName);
      return inventoryItem ? inventoryItem.quantity : 0;
    };

    const materialRequirements = new Map();
    
    order.items.forEach(orderItem => {
      const recipe = getRecipeById(orderItem.recipeId);
      if (!recipe || !recipe.ingredients) return;

      recipe.ingredients.forEach(ingredient => {
        const existing = materialRequirements.get(ingredient.name);
        const required = ingredient.quantity * orderItem.quantity;
        
        if (existing) {
          existing.required += required;
        } else {
          materialRequirements.set(ingredient.name, {
            name: ingredient.name,
            required: required,
            available: getAvailableQuantity(ingredient.name)
          });
        }
      });
    });

    const totalMaterials = Array.from(materialRequirements.values()).map(material => ({
      ...material,
      sufficient: material.available >= material.required
    }));

    return {
      totalItems: order.items.length,
      canCraftAll: totalMaterials.every(material => material.sufficient),
      insufficientCount: totalMaterials.filter(material => !material.sufficient).length
    };
  };

  // 格式化日期
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  return (
    <div className="order-history" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>订单历史</h2>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <p>暂无保存的订单</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '15px' }}>
          {orders.map(order => {
            const preview = getOrderPreview(order);
            const isCurrentOrder = currentOrder.id === order.id;
            
            return (
              <div 
                key={order.id} 
                style={{ 
                  border: '1px solid #ddd', 
                  borderRadius: '8px', 
                  padding: '15px',
                  backgroundColor: isCurrentOrder ? '#e3f2fd' : 'white',
                  borderColor: isCurrentOrder ? '#2196f3' : '#ddd'
                }}
              >
                {/* 订单头部信息 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div>
                    <h3 style={{ margin: '0 0 5px 0', color: isCurrentOrder ? '#1976d2' : '#333' }}>
                      {order.name} {isCurrentOrder && <span style={{ fontSize: '14px', color: '#666' }}>(当前编辑)</span>}
                    </h3>
                    <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                      创建时间: {formatDate(order.createdAt)} | 状态: {
                        order.status === 'draft' ? '草稿' : 
                        order.status === 'confirmed' ? '已确认' : '已完成'
                      }
                    </p>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    {/* 状态指示器 */}
                    <div style={{ 
                      padding: '4px 8px', 
                      borderRadius: '12px', 
                      fontSize: '12px',
                      backgroundColor: preview.canCraftAll ? '#d4edda' : '#f8d7da',
                      color: preview.canCraftAll ? '#155724' : '#721c24'
                    }}>
                      {preview.canCraftAll ? '✅ 可制作' : `❌ ${preview.insufficientCount}项不足`}
                    </div>
                    
                    {/* 操作按钮 */}
                    <button 
                      onClick={() => handleLoadOrder(order.id)}
                      style={{ 
                        padding: '6px 12px', 
                        backgroundColor: '#007bff', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px', 
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      {isCurrentOrder ? '编辑中' : '加载编辑'}
                    </button>
                    
                    <button 
                      onClick={() => setShowDetails(showDetails === order.id ? null : order.id)}
                      style={{ 
                        padding: '6px 12px', 
                        backgroundColor: '#28a745', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px', 
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      {showDetails === order.id ? '隐藏详情' : '查看详情'}
                    </button>
                    
                    <button 
                      onClick={() => handleDeleteOrder(order.id, order.name)}
                      style={{ 
                        padding: '6px 12px', 
                        backgroundColor: '#dc3545', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px', 
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      删除
                    </button>
                  </div>
                </div>

                {/* 订单概览 */}
                <div style={{ display: 'flex', gap: '20px', marginBottom: '10px', fontSize: '14px', color: '#666' }}>
                  <span>📋 配方数量: {preview.totalItems}</span>
                  <span>📊 总项目: {order.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                </div>

                {/* 配方列表概览 */}
                <div style={{ marginBottom: '10px' }}>
                  <strong style={{ fontSize: '14px' }}>配方列表:</strong>
                  <div style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>
                    {order.items.map(item => (
                      <span key={item.recipeId} style={{ marginRight: '15px' }}>
                        {item.recipeName} × {item.quantity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 详细信息 */}
                {showDetails === order.id && (
                  <div style={{ 
                    marginTop: '15px', 
                    padding: '15px', 
                    backgroundColor: '#f8f9fa', 
                    borderRadius: '5px',
                    border: '1px solid #e9ecef'
                  }}>
                    <h4>详细材料需求</h4>
                    <OrderDetailCalculation order={order} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// 订单详细计算组件
const OrderDetailCalculation = ({ order }) => {
  const recipes = useSelector((state) => state.recipes.recipes);
  const inventory = useSelector((state) => state.inventory.items);

  const getRecipeById = (recipeId) => recipes.find(recipe => recipe.id === recipeId);
  const getAvailableQuantity = (materialName) => {
    const inventoryItem = inventory.find(item => item.name === materialName);
    return inventoryItem ? inventoryItem.quantity : 0;
  };

  const materialRequirements = new Map();
  
  order.items.forEach(orderItem => {
    const recipe = getRecipeById(orderItem.recipeId);
    if (!recipe || !recipe.ingredients) return;

    recipe.ingredients.forEach(ingredient => {
      const existing = materialRequirements.get(ingredient.name);
      const required = ingredient.quantity * orderItem.quantity;
      
      if (existing) {
        existing.required += required;
      } else {
        materialRequirements.set(ingredient.name, {
          name: ingredient.name,
          required: required,
          available: getAvailableQuantity(ingredient.name)
        });
      }
    });
  });

  const totalMaterials = Array.from(materialRequirements.values()).map(material => ({
    ...material,
    sufficient: material.available >= material.required,
    shortage: Math.max(0, material.required - material.available)
  }));

  return (
    <div style={{ display: 'grid', gap: '8px' }}>
      {totalMaterials.map(material => (
        <div 
          key={material.name} 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            padding: '8px 12px', 
            backgroundColor: material.sufficient ? '#d4edda' : '#f8d7da',
            borderRadius: '4px',
            fontSize: '13px'
          }}
        >
          <span style={{ fontWeight: '500' }}>{material.name}</span>
          <span>
            需要: {material.required} | 拥有: {material.available}
            {!material.sufficient && (
              <span style={{ color: '#721c24', marginLeft: '8px', fontWeight: '500' }}>
                缺少: {material.shortage}
              </span>
            )}
          </span>
        </div>
      ))}
    </div>
  );
};

export default OrderHistory;
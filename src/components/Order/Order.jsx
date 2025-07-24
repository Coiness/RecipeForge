import React, { useState } from 'react';
import OrderManager from './orderManager';
import OrderHistory from './OrderHistory';

const OrderPage = () => {
  const [activeTab, setActiveTab] = useState('manager');

  const tabStyle = (isActive) => ({
    padding: '10px 20px',
    backgroundColor: isActive ? '#007bff' : '#f8f9fa',
    color: isActive ? 'white' : '#666',
    border: '1px solid #ddd',
    borderBottom: isActive ? '1px solid #007bff' : '1px solid #ddd',
    cursor: 'pointer',
    borderRadius: '8px 8px 0 0',
    marginRight: '5px'
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* 标签页导航 */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #ddd', padding: '0 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex' }}>
          <button
            onClick={() => setActiveTab('manager')}
            style={tabStyle(activeTab === 'manager')}
          >
            📝 订单管理
          </button>
          <button
            onClick={() => setActiveTab('history')}
            style={tabStyle(activeTab === 'history')}
          >
            📚 订单历史
          </button>
        </div>
      </div>

      {/* 内容区域 */}
      <div style={{ backgroundColor: 'white', minHeight: 'calc(100vh - 60px)' }}>
        {activeTab === 'manager' && <OrderManager />}
        {activeTab === 'history' && <OrderHistory />}
      </div>
    </div>
  );
};

export default OrderPage;
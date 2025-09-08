/**
 * OrderList
 * 用于展示Orders
 * UI设计为
 * Order页面左侧为orderList，右侧为orderCard
 * 类似于一个订单集合界面
 * 
 * orderList负责展示所有的order
 * 上侧有一个搜索栏以及订单的添加按钮
 * 订单的搜索和添加功能放在orderList中
 * 订单的编辑和删除功能放在orderCard中
 */

import React, { useState, useEffect } from 'react';
import { useOrder } from '../hooks/useOrders';
import { useItems } from '../hooks/useItems';
import { useCalculation } from '../hooks/useCalculation';
import { useDispatch } from 'react-redux';
import type { Order, TargetItem } from '../types';

export const OrderList = () => {
    // 从自定义hooks获取数据和操作方法
    const {
        orders,
        loading,
        error,
        selectedOrder,
        selectOrder,
        createOrder,
        searchOrders
    } = useOrder();
    
    const { items } = useItems();
    const { calculateMaterialsForOrder, getRecipesForItem } = useCalculation();
    const dispatch = useDispatch();

    // 本地状态
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);
    const [showAddModal, setShowAddModal] = useState(false);
    
    // 新订单表单状态
    const [newOrderName, setNewOrderName] = useState('');
    const [targetItems, setTargetItems] = useState<TargetItem[]>([]);
    const [newItemId, setNewItemId] = useState('');
    const [newItemAmount, setNewItemAmount] = useState(1);
    
    // 搜索物品状态
    const [itemSearchQuery, setItemSearchQuery] = useState('');

    // 防抖hook
    function useDebounce<T>(value: T, delay: number): T {
        const [debouncedValue, setDebouncedValue] = useState<T>(value);

        useEffect(() => {
            const timer = setTimeout(() => {
                setDebouncedValue(value);
            }, delay);

            return () => clearTimeout(timer);
        }, [value, delay]);

        return debouncedValue;
    }

    const debouncedSearchQuery = useDebounce(searchQuery, 300);
    const debouncedItemSearchQuery = useDebounce(itemSearchQuery, 300);

    // 根据关键词过滤物品
    const filteredItems = React.useMemo(() => {
        if (!debouncedItemSearchQuery.trim()) {
            return items;
        }
        return items.filter(item => 
            item.name.toLowerCase().includes(debouncedItemSearchQuery.toLowerCase())
        );
    }, [items, debouncedItemSearchQuery]);

    // 确保初始化时不显示加载状态
    useEffect(() => {
        dispatch({ type: 'ORDER_LOADING', loading: false });
    }, [dispatch]);

    // 当搜索查询或订单列表变化时，更新过滤后的订单列表
    useEffect(() => {
        if (debouncedSearchQuery.trim() === '') {
            setFilteredOrders(orders);
        } else {
            setFilteredOrders(searchOrders(debouncedSearchQuery));
        }
    }, [debouncedSearchQuery, orders, searchOrders]);

    // 处理搜索输入变化
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    // 处理添加目标物品
    const handleAddTargetItem = () => {
        if (!newItemId) return;
        
        const selectedItem = items.find(item => item.id === newItemId);
        if (!selectedItem) return;
        
        // 检查是否已存在相同物品
        const existingIndex = targetItems.findIndex(target => target.item.id === newItemId);
        
        if (existingIndex >= 0) {
            // 更新数量
            const updatedTargets = [...targetItems];
            updatedTargets[existingIndex] = {
                ...updatedTargets[existingIndex],
                amount: updatedTargets[existingIndex].amount + newItemAmount
            };
            setTargetItems(updatedTargets);
        } else {
            // 添加新物品
            setTargetItems([
                ...targetItems,
                {
                    item: selectedItem,
                    amount: newItemAmount
                }
            ]);
        }
        
        // 重置输入
        setNewItemId('');
        setNewItemAmount(1);
    };
    
    // 处理移除目标物品
    const handleRemoveTargetItem = (index: number) => {
        const updatedTargets = [...targetItems];
        updatedTargets.splice(index, 1);
        setTargetItems(updatedTargets);
    };
    
    // 处理创建订单
    const handleCreateOrder = async () => {
        if (!newOrderName.trim()) {
            alert('订单名称不能为空');
            return;
        }
        
        if (targetItems.length === 0) {
            alert('至少需要一个目标产物');
            return;
        }
        
        try {
            // 创建订单时，recipes先传空数组，由计算服务自动生成
            const newOrder = await createOrder(newOrderName, targetItems, []);
            
            // 计算订单所需材料
            await calculateMaterialsForOrder(newOrder);
            
            // 重置表单
            setNewOrderName('');
            setTargetItems([]);
            setShowAddModal(false);
        } catch (error) {
            console.error('创建订单失败:', error);
        }
    };

    // 渲染加载状态
    if (loading) {
        return (
            <div className='bg-white rounded-lg shadow-md p-4 h-full flex items-center justify-center'>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // 渲染错误状态
    if (error) {
        return (
            <div className='bg-white rounded-lg shadow-md p-4 h-full'>
                <div className="text-red-500 mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    加载失败: {error}
                </div>
                
                {/* 搜索和添加按钮 */}
                <div className='flex justify-between items-center mb-4'>
                    <div className='relative flex-grow mr-2'>
                        <input 
                            type='text' 
                            placeholder='搜索订单...' 
                            className='w-full border border-gray-300 rounded-md py-2 px-3 pl-8 focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        <svg className="w-4 h-4 absolute left-2.5 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <button 
                        className='bg-blue-500 hover:bg-blue-600 text-white rounded-md px-4 py-2 transition-colors'
                        onClick={() => setShowAddModal(true)}
                    >
                        创建订单
                    </button>
                </div>
                
                {/* 重试按钮 */}
                <div className="flex justify-center my-4">
                    <button 
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        onClick={() => dispatch({type: 'ORDER_LOADING', loading: false})}
                    >
                        重试加载
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='bg-white rounded-lg shadow-md p-4 h-full'>
            {/* 搜索栏和添加按钮 */}
            <div className='flex justify-between items-center mb-4'>
                <div className='relative flex-grow mr-2'>
                    <input 
                        type='text' 
                        placeholder='搜索订单...' 
                        className='w-full border border-gray-300 rounded-md py-2 px-3 pl-8 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                    <svg className="w-4 h-4 absolute left-2.5 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <button 
                    className='bg-blue-500 hover:bg-blue-600 text-white rounded-md px-4 py-2 transition-colors'
                    onClick={() => setShowAddModal(true)}
                >
                    创建订单
                </button>
            </div>
            
            {/* 订单列表 */}
            <div className='space-y-3 overflow-y-auto max-h-[calc(100vh-220px)]'>
                {filteredOrders.length > 0 ? (
                    filteredOrders.map(order => (
                        <div 
                            key={order.id}
                            className={`border ${selectedOrder?.id === order.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'} 
                                       rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors`}
                            onClick={() => selectOrder(order.id)}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-medium text-lg">{order.name}</h3>
                                    <div className="text-sm text-gray-500 mt-1">
                                        {order.targetItems.length} 种目标产物 · 
                                        {order.recipes.length} 个配方
                                    </div>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                    order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                    {order.status === 'completed' ? '已完成' : 
                                     order.status === 'pending' ? '进行中' : 
                                     order.status === 'draft' ? '草稿' : 
                                     order.status === 'cancelled' ? '已取消' : 
                                     order.status}
                                </span>
                            </div>
                            
                            {/* 目标产物预览 */}
                            <div className="mt-3 pt-3 border-t border-gray-100">
                                <div className="text-sm text-gray-600 mb-2">目标产物:</div>
                                <div className="flex flex-wrap gap-2">
                                    {order.targetItems.slice(0, 3).map((target, idx) => (
                                        <div key={idx} className="flex items-center bg-gray-100 rounded-full pl-1 pr-3 py-1">
                                            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center mr-1">
                                                {target.item.iconUrl ? (
                                                    <img src={target.item.iconUrl} alt={target.item.name} className="w-4 h-4 rounded-full" />
                                                ) : (
                                                    <span className="text-xs text-gray-500">{target.item.name[0]}</span>
                                                )}
                                            </div>
                                            <span className="text-xs">
                                                {target.item.name} × {target.amount}
                                            </span>
                                        </div>
                                    ))}
                                    {order.targetItems.length > 3 && (
                                        <span className="text-xs text-gray-500 self-center">
                                            +{order.targetItems.length - 3} 种
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                        <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        {searchQuery ? (
                            <p>没有找到匹配的订单</p>
                        ) : (
                            <p>暂无订单，请创建</p>
                        )}
                    </div>
                )}
            </div>
            
            {/* 创建订单模态框 */}
            {showAddModal && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10'>
                    <div className='bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
                        <h3 className='text-lg font-medium mb-4'>创建新订单</h3>
                        
                        {/* 订单名称 */}
                        <div className='mb-4'>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                订单名称<span className='text-red-500'>*</span>
                            </label>
                            <input 
                                type='text'
                                value={newOrderName}
                                onChange={(e) => setNewOrderName(e.target.value)}
                                className='w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                placeholder='请输入订单名称'    
                            />
                        </div>
                        
                        {/* 目标产物选择 */}
                        <div className='mb-6'>
                            <div className="flex justify-between items-center mb-2">
                                <label className='block text-sm font-medium text-gray-700'>
                                    目标产物<span className='text-red-500'>*</span>
                                </label>
                                <span className="text-xs text-gray-500">至少需要一种目标产物</span>
                            </div>
                            
                            {/* 已添加的目标产物 */}
                            <div className="mb-3 space-y-2">
                                {targetItems.map((target, index) => (
                                    <div key={index} className="flex items-center bg-gray-50 p-2 rounded border border-gray-200">
                                        <div className="w-8 h-8 mr-2 bg-gray-100 rounded flex items-center justify-center">
                                            {target.item.iconUrl ? (
                                                <img src={target.item.iconUrl} alt={target.item.name} className="w-6 h-6 object-contain" />
                                            ) : (
                                                <span className="text-sm font-light text-gray-500">{target.item.name[0]}</span>
                                            )}
                                        </div>
                                        <div className="flex-1 text-sm">
                                            {target.item.name} × {target.amount}
                                        </div>
                                        <button 
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => handleRemoveTargetItem(index)}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                            
                            {/* 搜索物品 */}
                            <div className="relative mb-2">
                                <input
                                    type="text"
                                    placeholder="搜索物品..."
                                    className="w-full border border-gray-300 rounded-md py-2 px-3 pl-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={itemSearchQuery}
                                    onChange={(e) => setItemSearchQuery(e.target.value)}
                                />
                                <svg className="w-4 h-4 absolute left-2.5 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            
                            {/* 添加目标产物 */}
                            <div className="flex space-x-2">
                                <select
                                    className="flex-1 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newItemId}
                                    onChange={(e) => setNewItemId(e.target.value)}
                                >
                                    <option value="">选择物品...</option>
                                    {filteredItems.map(item => (
                                        <option key={item.id} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="w-24">
                                    <input
                                        type="number"
                                        min="1"
                                        value={newItemAmount}
                                        onChange={(e) => setNewItemAmount(parseInt(e.target.value) || 1)}
                                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="数量"
                                    />
                                </div>
                                <button
                                    className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
                                    onClick={handleAddTargetItem}
                                    disabled={!newItemId}
                                >
                                    添加
                                </button>
                            </div>
                            
                            {/* 无搜索结果提示 */}
                            {debouncedItemSearchQuery && filteredItems.length === 0 && (
                                <div className="text-sm text-gray-500 mt-1 italic">
                                    没有找到匹配的物品
                                </div>
                            )}
                        </div>
                        
                        {/* 底部按钮 */}
                        <div className='flex justify-end space-x-3'>
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setNewOrderName('');
                                    setTargetItems([]);
                                    setItemSearchQuery('');
                                }}
                                className='px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors'
                            >
                                取消
                            </button>
                            <button
                                onClick={handleCreateOrder}
                                disabled={!newOrderName.trim() || targetItems.length === 0}
                                className={`px-4 py-2 rounded-md text-white ${
                                    !newOrderName.trim() || targetItems.length === 0
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-blue-500 hover:bg-blue-600'
                                }`}
                            >
                                创建
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderList;
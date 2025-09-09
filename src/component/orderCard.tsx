/**
 * OrderCard
 * 用于展示订单详情和配方树
 * 
 * 主要功能：
 * 1. 展示订单信息和目标产物
 * 2. 展示配方树和材料清单
 * 3. 提供订单编辑和删除功能
 * 4. 支持重新计算订单配方
 */

import React, { useState, useEffect } from 'react';
import { useOrder } from '../hooks/useOrders';
import { useCalculation } from '../hooks/useCalculation';
import { useItems } from '../hooks/useItems';
import type {  TargetItem } from '../types';

export const OrderCard = () => {
    // 从自定义hooks获取数据和操作方法
    const { selectedOrder, modifyOrder, removeOrder, clearSelection } = useOrder();
    const { 
        calculateMaterialsForOrder, 
        getRecipeTree, 
        materials,
        loading: calculationLoading 
    } = useCalculation();
    const { items } = useItems();

    // 本地状态
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'recipeTree', 'materials'
    const [recipeTree, setRecipeTree] = useState<any>(null);
    const [orderMaterials, setOrderMaterials] = useState<any[]>([]);
    
    // 编辑状态
    const [editName, setEditName] = useState('');
    const [editStatus, setEditStatus] = useState('');
    const [editTargetItems, setEditTargetItems] = useState<TargetItem[]>([]);
    
    // 新物品状态
    const [newItemId, setNewItemId] = useState('');
    const [newItemAmount, setNewItemAmount] = useState(1);
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
    
    const debouncedItemSearchQuery = useDebounce(itemSearchQuery, 300);
    
    // 过滤物品列表
    const filteredItems = React.useMemo(() => {
        if (!debouncedItemSearchQuery.trim()) {
            return items;
        }
        return items.filter(item => 
            item.name.toLowerCase().includes(debouncedItemSearchQuery.toLowerCase())
        );
    }, [items, debouncedItemSearchQuery]);

    // 选中订单变化时，获取配方树和材料
    useEffect(() => {
        if (selectedOrder) {
            setEditName(selectedOrder.name);
            setEditStatus(selectedOrder.status);
            setEditTargetItems([...selectedOrder.targetItems]);
            
            // 加载配方树
            loadRecipeTree();
            
            if (materials && selectedOrder.id && materials[selectedOrder.id]) {
                setOrderMaterials(materials[selectedOrder.id] || []);
            } else {
                calculateMaterialsForOrder(selectedOrder)
                .then(result => {
                    setOrderMaterials(result || []);
                })
                .catch(error => {
                console.error('加载订单材料失败:', error);
                setOrderMaterials([]); // 确保出错时也设置为空数组
            });
            }
        }
    }, [selectedOrder]);

    // 加载配方树
    const loadRecipeTree = async () => {
        if (!selectedOrder) return;
        
        try {
            // 如果订单有配方，加载第一个配方的依赖树
            if (selectedOrder.recipes && selectedOrder.recipes.length > 0) {
                const mainRecipe = selectedOrder.recipes[0];
                const tree = await getRecipeTree(mainRecipe.recipe.id);
                setRecipeTree(tree);
            } else {
                setRecipeTree(null);
            }
        } catch (error) {
            console.error('加载配方树失败:', error);
        }
    };

    // 开始编辑
    const handleStartEdit = () => {
        if (!selectedOrder) return;
        
        setEditName(selectedOrder.name);
        setEditStatus(selectedOrder.status);
        setEditTargetItems([...selectedOrder.targetItems]);
        setIsEditing(true);
    };
    
    // 处理添加目标物品
    const handleAddTargetItem = () => {
        if (!newItemId) return;
        
        const selectedItem = items.find(item => item.id === newItemId);
        if (!selectedItem) return;
        
        // 检查是否已存在相同物品
        const existingIndex = editTargetItems.findIndex(target => target.item.id === newItemId);
        
        if (existingIndex >= 0) {
            // 更新数量
            const updatedTargets = [...editTargetItems];
            updatedTargets[existingIndex] = {
                ...updatedTargets[existingIndex],
                amount: updatedTargets[existingIndex].amount + newItemAmount
            };
            setEditTargetItems(updatedTargets);
        } else {
            // 添加新物品
            setEditTargetItems([
                ...editTargetItems,
                {
                    item: selectedItem,
                    amount: newItemAmount                }
            ]);
        }
        
        // 重置输入
        setNewItemId('');
        setNewItemAmount(1);
    };
    
    // 处理移除目标物品
    const handleRemoveTargetItem = (index: number) => {
        const updatedTargets = [...editTargetItems];
        updatedTargets.splice(index, 1);
        setEditTargetItems(updatedTargets);
    };
    
    // 保存编辑
    const handleSaveEdit = async () => {
        if (!selectedOrder) return;
        
        if (!editName.trim()) {
            alert('订单名称不能为空');
            return;
        }
        
        if (editTargetItems.length === 0) {
            alert('至少需要一个目标产物');
            return;
        }
        
        try {
            // 判断是否修改了目标产物
            const targetItemsChanged = JSON.stringify(selectedOrder.targetItems) !== JSON.stringify(editTargetItems);
            
            // 更新订单
            const updatedOrder = await modifyOrder(selectedOrder.id, {
                name: editName,
                status: editStatus,
                targetItems: editTargetItems,
                // 如果修改了目标产物，清空配方列表，让系统重新计算
                recipes: targetItemsChanged ? [] : selectedOrder.recipes
            });
            
            // 如果修改了目标产物，重新计算
            if (targetItemsChanged && updatedOrder) {
                await calculateMaterialsForOrder(updatedOrder);
                // 重新加载配方树
                await loadRecipeTree();
            }
            
            setIsEditing(false);
        } catch (error) {
            console.error('更新订单失败:', error);
        }
    };
    
    // 取消编辑
    const handleCancelEdit = () => {
        if (!selectedOrder) return;
        
        setEditName(selectedOrder.name);
        setEditStatus(selectedOrder.status);
        setEditTargetItems([...selectedOrder.targetItems]);
        setIsEditing(false);
    };
    
    // 删除订单
    const handleDelete = async () => {
        if (!selectedOrder) return;
        
        try {
            await removeOrder(selectedOrder.id);
            setIsDeleting(false);
            clearSelection(); // 清除当前选中的订单
        } catch (error) {
            console.error('删除订单失败:', error);
        }
    };
    
    // 重新计算订单
    const handleRecalculate = async () => {
        if (!selectedOrder) return;
        
        try {
            // 清空配方列表，让系统重新计算
            const updatedOrder = await modifyOrder(selectedOrder.id, {
                recipes: []
            });
            
            if (updatedOrder !== null) {
                await calculateMaterialsForOrder(updatedOrder);
                // 重新加载配方树
                await loadRecipeTree();
            }
        } catch (error) {
            console.error('重新计算失败:', error);
        }
    };
    
    // 获取状态文本
    const getStatusText = (status: string) => {
        switch (status) {
            case 'draft': return '草稿';
            case 'pending': return '进行中';
            case 'completed': return '已完成';
            case 'cancelled': return '已取消';
            default: return status;
        }
    };
    
    // 获取状态标签样式
    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'draft':
                return 'bg-blue-100 text-blue-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    
    // 递归渲染配方树节点
    const renderRecipeTreeNode = (node: any, level = 0, path = '') => {
        if (!node) return null;
        
        const currentPath = path ? `${path}.${node.name}` : node.name;
        
        return (
            <div key={currentPath} className={`ml-${level * 4}`}>
                <div className={`p-2 ${level === 0 ? 'bg-blue-50' : 'bg-gray-50'} rounded-md mb-2 border ${level === 0 ? 'border-blue-200' : 'border-gray-200'}`}>
                    <div className="font-medium">{node.name}</div>
                    {node.circular && (
                        <div className="text-red-500 text-sm">循环依赖</div>
                    )}
                </div>
                
                {node.dependencies && node.dependencies.length > 0 && (
                    <div className="ml-4 space-y-2 border-l-2 border-gray-200 pl-2">
                        {node.dependencies.map((dep: any, index: number) => (
                            <div key={`${currentPath}-dep-${index}`}>
                                <div className="flex items-center mb-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                                    <span className="text-sm text-gray-600">{dep.item} × {dep.amount}</span>
                                </div>
                                {dep.recipe && !dep.basic && renderRecipeTreeNode(dep.recipe, level + 1, `${currentPath}-${index}`)}
                                {dep.basic && (
                                    <div className="ml-4 p-1 bg-green-50 text-sm text-green-700 rounded border border-green-200 inline-block">
                                        基础物品
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };
    
    // 如果没有选中订单，显示提示信息
    if (!selectedOrder) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6 h-full flex items-center justify-center">
                <div className="text-center text-gray-500">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>请从左侧列表选择一个订单查看详情</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="bg-white rounded-lg shadow-md p-6 h-full overflow-y-auto">
            {/* 标题栏和操作按钮 */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">{selectedOrder.name}</h2>
                    <div className="mt-1 flex items-center">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeClass(selectedOrder.status)}`}>
                            {getStatusText(selectedOrder.status)}
                        </span>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <button 
                        className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                        onClick={handleStartEdit}
                    >
                        编辑
                    </button>
                    <button 
                        className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                        onClick={() => setIsDeleting(true)}
                    >
                        删除
                    </button>
                </div>
            </div>
            
            {/* 选项卡导航 */}
            <div className="mb-6">
                <div className="border-b border-gray-200">
                    <nav className="flex -mb-px">
                        <button
                            className={`py-2 px-4 text-sm font-medium border-b-2 ${
                                activeTab === 'overview'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                            onClick={() => setActiveTab('overview')}
                        >
                            概览
                        </button>
                        <button
                            className={`py-2 px-4 text-sm font-medium border-b-2 ${
                                activeTab === 'recipeTree'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                            onClick={() => setActiveTab('recipeTree')}
                        >
                            配方树
                        </button>
                        <button
                            className={`py-2 px-4 text-sm font-medium border-b-2 ${
                                activeTab === 'materials'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                            onClick={() => setActiveTab('materials')}
                        >
                            材料清单
                        </button>
                    </nav>
                </div>
            </div>
            
            {/* 选项卡内容 */}
            <div className="space-y-6">
                {/* 概览选项卡 */}
                {activeTab === 'overview' && (
                    <div>
                        {/* 目标产物 */}
                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-gray-700 mb-3">目标产物</h3>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {selectedOrder.targetItems.map((target, index) => (
                                        <div key={index} className="flex items-center bg-white p-3 rounded-md border border-gray-200">
                                            <div className="w-10 h-10 mr-3 bg-gray-100 rounded-md flex items-center justify-center">
                                                {target.item.iconUrl ? (
                                                    <img src={target.item.iconUrl} alt={target.item.name} className="w-8 h-8 object-contain" />
                                                ) : (
                                                    <span className="text-xl font-light text-gray-500">{target.item.name[0]}</span>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-gray-800 font-medium">{target.item.name}</div>
                                                <div className="text-sm text-gray-500">数量: {target.amount}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        {/* 订单统计 */}
                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-gray-700 mb-3">订单统计</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                                    <div className="text-blue-500 text-sm font-medium mb-1">目标产物</div>
                                    <div className="text-2xl font-bold text-gray-800">{selectedOrder.targetItems.length}</div>
                                </div>
                                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                                    <div className="text-green-500 text-sm font-medium mb-1">配方数量</div>
                                    <div className="text-2xl font-bold text-gray-800">{selectedOrder.recipes.length}</div>
                                </div>
                                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
                                    <div className="text-yellow-500 text-sm font-medium mb-1">原材料</div>
                                    <div className="text-2xl font-bold text-gray-800">{orderMaterials.length}</div>
                                </div>
                            </div>
                        </div>
                        
                        {/* 操作按钮 */}
                        <div className="flex justify-center">
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
                                onClick={handleRecalculate}
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                重新计算
                            </button>
                        </div>
                    </div>
                )}
                
                {/* 配方树选项卡 */}
                {activeTab === 'recipeTree' && (
                    <div>
                        <h3 className="text-lg font-medium text-gray-700 mb-3">配方依赖树</h3>
                        
                        {calculationLoading ? (
                            <div className="flex justify-center py-10">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                            </div>
                        ) : recipeTree ? (
                            <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
                                {renderRecipeTreeNode(recipeTree)}
                            </div>
                        ) : (
                            <div className="text-center py-8 bg-gray-50 rounded-lg">
                                <div className="text-gray-500">暂无配方树数据</div>
                                <button
                                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                    onClick={handleRecalculate}
                                >
                                    计算配方树
                                </button>
                            </div>
                        )}
                        
                        {/* 列表形式展示配方执行顺序 */}
                        {selectedOrder.recipes.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-lg font-medium text-gray-700 mb-3">配方执行顺序</h3>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="space-y-2">
                                        {selectedOrder.recipes.map((recipeItem, index) => (
                                            <div 
                                                key={index} 
                                                className="flex items-center bg-white p-3 rounded-md border border-gray-200"
                                            >
                                                <div className="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center mr-3">
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-medium">{recipeItem.recipe.name}</div>
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <span>执行 {recipeItem.amount} 次</span>
                                                        <span className="mx-2">•</span>
                                                        <span>层级 {recipeItem.level}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                
                {/* 材料清单选项卡 */}
                {activeTab === 'materials' && (
                    <div>
                        <h3 className="text-lg font-medium text-gray-700 mb-3">材料清单</h3>
                        
                        {calculationLoading ? (
                            <div className="flex justify-center py-10">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                            </div>
                        ) :orderMaterials && orderMaterials.length > 0 ? (
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {orderMaterials.map((material, index) => (
                                        <div key={index} className="flex items-center bg-white p-3 rounded-md border border-gray-200">
                                            <div className="w-10 h-10 mr-3 bg-gray-100 rounded-md flex items-center justify-center">
                                                {material.item.iconUrl ? (
                                                    <img src={material.item.iconUrl} alt={material.item.name} className="w-8 h-8 object-contain" />
                                                ) : (
                                                    <span className="text-xl font-light text-gray-500">{material.item.name[0]}</span>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-gray-800 font-medium">{material.item.name}</div>
                                                <div className="text-sm text-gray-500">
                                                    需要: {material.amount} {material.item.unit || '个'}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 bg-gray-50 rounded-lg">
                                <div className="text-gray-500">暂无材料清单数据</div>
                                <button
                                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                    onClick={handleRecalculate}
                                >
                                    计算材料清单
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
            
            {/* 编辑模态框 */}
            {isEditing && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-medium mb-4">编辑订单</h3>
                        
                        {/* 订单名称 */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                订单名称<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="请输入订单名称"
                            />
                        </div>
                        
                        {/* 订单状态 */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                订单状态
                            </label>
                            <select
                                value={editStatus}
                                onChange={(e) => setEditStatus(e.target.value)}
                                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="draft">草稿</option>
                                <option value="pending">进行中</option>
                                <option value="completed">已完成</option>
                                <option value="cancelled">已取消</option>
                            </select>
                        </div>
                        
                        {/* 目标产物 */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    目标产物<span className="text-red-500">*</span>
                                </label>
                                <span className="text-xs text-gray-500">至少需要一种目标产物</span>
                            </div>
                            
                            {/* 已添加的目标产物 */}
                            <div className="mb-3 space-y-2">
                                {editTargetItems.map((target, index) => (
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
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={handleCancelEdit}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                            >
                                取消
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                disabled={!editName.trim() || editTargetItems.length === 0}
                                className={`px-4 py-2 rounded-md text-white ${
                                    !editName.trim() || editTargetItems.length === 0
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-blue-500 hover:bg-blue-600'
                                }`}
                            >
                                保存
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* 删除确认对话框 */}
            {isDeleting && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-medium mb-4">确认删除</h3>
                        <p className="text-gray-600 mb-6">
                            您确定要删除订单 "{selectedOrder.name}" 吗？此操作无法撤销。
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setIsDeleting(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                            >
                                取消
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                            >
                                删除
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderCard;
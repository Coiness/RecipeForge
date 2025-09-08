/**
 * RecipeForm
 * 配方的添加和编辑表单组件
 * 用于RecipeList和RecipeCard中
 */

import React, { useState, useEffect } from 'react';
import type { Item, Recipe, Item_For_Recipe } from '../types';

interface RecipeFormProps {
  // 表单模式：添加或编辑
  mode: 'add' | 'edit';
  // 初始值（编辑模式时使用）
  initialValues?: {
    name: string;
    inputs: Item_For_Recipe[];
    outputs: Item_For_Recipe[];
  };
  // 可用物品列表
  items: Item[];
  // 提交回调
  onSubmit: (name: string, inputs: Item_For_Recipe[], outputs: Item_For_Recipe[]) => Promise<void>;
  // 取消回调
  onCancel: () => void;
  // 标题（可选）
  title?: string;
}

export const RecipeForm = ({
  mode,
  initialValues,
  items,
  onSubmit,
  onCancel,
  title
}: RecipeFormProps) => {
  // 本地状态管理
  const [recipeName, setRecipeName] = useState('');
  const [recipeInputs, setRecipeInputs] = useState<Item_For_Recipe[]>([]);
  const [recipeOutputs, setRecipeOutputs] = useState<Item_For_Recipe[]>([]);
  
  // 新物品的临时状态
  const [newInputItemId, setNewInputItemId] = useState('');
  const [newInputAmount, setNewInputAmount] = useState(1);
  const [newOutputItemId, setNewOutputItemId] = useState('');
  const [newOutputAmount, setNewOutputAmount] = useState(1);
  
  // 物品搜索状态
  const [inputItemSearchQuery, setInputItemSearchQuery] = useState('');
  const [outputItemSearchQuery, setOutputItemSearchQuery] = useState('');
  
  // 防抖处理
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
  
  const debouncedInputItemSearchQuery = useDebounce(inputItemSearchQuery, 300);
  const debouncedOutputItemSearchQuery = useDebounce(outputItemSearchQuery, 300);
  
  // 过滤物品列表
  const filteredInputItems = React.useMemo(() => {
    if (!debouncedInputItemSearchQuery.trim()) {
      return items;
    }
    return items.filter(item => 
      item.name.toLowerCase().includes(debouncedInputItemSearchQuery.toLowerCase())
    );
  }, [items, debouncedInputItemSearchQuery]);

  const filteredOutputItems = React.useMemo(() => {
    if (!debouncedOutputItemSearchQuery.trim()) {
      return items;
    }
    return items.filter(item => 
      item.name.toLowerCase().includes(debouncedOutputItemSearchQuery.toLowerCase())
    );
  }, [items, debouncedOutputItemSearchQuery]);
  
  // 初始化表单
  useEffect(() => {
    if (initialValues) {
      setRecipeName(initialValues.name);
      setRecipeInputs([...initialValues.inputs]);
      setRecipeOutputs([...initialValues.outputs]);
    }
  }, [initialValues]);
  
  // 处理添加输入物品
  const handleAddInput = () => {
    if (!newInputItemId) return;
    
    const selectedItem = items.find(item => item.id === newInputItemId);
    if (!selectedItem) return;
    
    // 检查是否已经存在相同的物品
    const existingIndex = recipeInputs.findIndex(input => input.item.id === newInputItemId);
    
    if (existingIndex >= 0) {
      // 如果已存在，更新数量
      const updatedInputs = [...recipeInputs];
      updatedInputs[existingIndex] = {
        ...updatedInputs[existingIndex],
        amount: updatedInputs[existingIndex].amount + newInputAmount
      };
      setRecipeInputs(updatedInputs);
    } else {
      // 如果不存在，添加新物品
      setRecipeInputs([
        ...recipeInputs,
        {
          item: selectedItem,
          amount: newInputAmount
        }
      ]);
    }
    
    // 重置输入字段
    setNewInputItemId('');
    setNewInputAmount(1);
  };
  
  // 处理添加输出物品
  const handleAddOutput = () => {
    if (!newOutputItemId) return;
    
    const selectedItem = items.find(item => item.id === newOutputItemId);
    if (!selectedItem) return;
    
    // 检查是否已经存在相同的物品
    const existingIndex = recipeOutputs.findIndex(output => output.item.id === newOutputItemId);
    
    if (existingIndex >= 0) {
      // 如果已存在，更新数量
      const updatedOutputs = [...recipeOutputs];
      updatedOutputs[existingIndex] = {
        ...updatedOutputs[existingIndex],
        amount: updatedOutputs[existingIndex].amount + newOutputAmount
      };
      setRecipeOutputs(updatedOutputs);
    } else {
      // 如果不存在，添加新物品
      setRecipeOutputs([
        ...recipeOutputs,
        {
          item: selectedItem,
          amount: newOutputAmount
        }
      ]);
    }
    
    // 重置输入字段
    setNewOutputItemId('');
    setNewOutputAmount(1);
  };
  
  // 处理移除输入物品
  const handleRemoveInput = (index: number) => {
    const updatedInputs = [...recipeInputs];
    updatedInputs.splice(index, 1);
    setRecipeInputs(updatedInputs);
  };
  
  // 处理移除输出物品
  const handleRemoveOutput = (index: number) => {
    const updatedOutputs = [...recipeOutputs];
    updatedOutputs.splice(index, 1);
    setRecipeOutputs(updatedOutputs);
  };
  
  // 处理提交
  const handleSubmit = async () => {
    if (!recipeName.trim() || recipeInputs.length === 0 || recipeOutputs.length === 0) {
      alert('配方名称不能为空，且必须至少有一个输入物品和一个输出物品');
      return;
    }
    
    try {
      await onSubmit(recipeName, recipeInputs, recipeOutputs);
    } catch (error) {
      console.error(mode === 'add' ? '添加配方失败:' : '更新配方失败:', error);
    }
  };
  
  return (
    <div className='bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
      <h3 className='text-lg font-medium mb-4'>{title || (mode === 'add' ? '添加新配方' : '编辑配方')}</h3>

      {/* 配方名称 */}
      <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          配方名称<span className='text-red-500'>*</span>
        </label>
        <input 
          type='text'
          value={recipeName}
          onChange={(e) => setRecipeName(e.target.value)}
          className='w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
          placeholder='请输入配方名称'    
        />
      </div>

      {/* 输入物品（材料）选择 */}
      <div className='mb-4'>
        <div className="flex justify-between items-center mb-2">
          <label className='block text-sm font-medium text-gray-700'>
            材料选择<span className='text-red-500'>*</span>
          </label>
          <span className="text-xs text-gray-500">至少需要一种材料</span>
        </div>
        
        {/* 已添加的输入物品列表 */}
        <div className="mb-3 space-y-2">
          {recipeInputs.map((input, index) => (
            <div key={index} className="flex items-center bg-gray-50 p-2 rounded border border-gray-200">
              <div className="w-8 h-8 mr-2 bg-gray-100 rounded flex items-center justify-center">
                {input.item.iconUrl ? (
                  <img src={input.item.iconUrl} alt={input.item.name} className="w-6 h-6 object-contain" />
                ) : (
                  <span className="text-sm font-light text-gray-500">{input.item.name[0]}</span>
                )}
              </div>
              <div className="flex-1 text-sm">
                {input.item.name} × {input.amount}
              </div>
              <button 
                className="text-red-500 hover:text-red-700"
                onClick={() => handleRemoveInput(index)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        
        {/* 搜索输入框 */}
        <div className="relative mb-2">
          <input
            type="text"
            placeholder="搜索材料..."
            className="w-full border border-gray-300 rounded-md py-2 px-3 pl-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={inputItemSearchQuery}
            onChange={(e) => setInputItemSearchQuery(e.target.value)}
          />
          <svg className="w-4 h-4 absolute left-2.5 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        {/* 添加新输入物品 */}
        <div className="flex space-x-2 mb-1">
          <select
            className="flex-1 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newInputItemId}
            onChange={(e) => setNewInputItemId(e.target.value)}
          >
            <option value="">选择物品...</option>
            {filteredInputItems.map(item => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <div className="w-24">
            <input
              type="number"
              min="1"
              value={newInputAmount}
              onChange={(e) => setNewInputAmount(parseInt(e.target.value) || 1)}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="数量"
            />
          </div>
          <button
            className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
            onClick={handleAddInput}
            disabled={!newInputItemId}
          >
            添加
          </button>
        </div>
        
        {/* 无搜索结果提示 */}
        {debouncedInputItemSearchQuery && filteredInputItems.length === 0 && (
          <div className="text-sm text-gray-500 mt-1 italic">
            没有找到匹配的物品
          </div>
        )}
      </div>

      {/* 输出物品（产物）选择 */}
      <div className='mb-6'>
        <div className="flex justify-between items-center mb-2">
          <label className='block text-sm font-medium text-gray-700'>
            产物选择<span className='text-red-500'>*</span>
          </label>
          <span className="text-xs text-gray-500">至少需要一种产物</span>
        </div>
        
        {/* 已添加的输出物品列表 */}
        <div className="mb-3 space-y-2">
          {recipeOutputs.map((output, index) => (
            <div key={index} className="flex items-center bg-gray-50 p-2 rounded border border-gray-200">
              <div className="w-8 h-8 mr-2 bg-gray-100 rounded flex items-center justify-center">
                {output.item.iconUrl ? (
                  <img src={output.item.iconUrl} alt={output.item.name} className="w-6 h-6 object-contain" />
                ) : (
                  <span className="text-sm font-light text-gray-500">{output.item.name[0]}</span>
                )}
              </div>
              <div className="flex-1 text-sm">
                {output.item.name} × {output.amount}
              </div>
              <button 
                className="text-red-500 hover:text-red-700"
                onClick={() => handleRemoveOutput(index)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        
        {/* 搜索输入框 */}
        <div className="relative mb-2">
          <input
            type="text"
            placeholder="搜索产物..."
            className="w-full border border-gray-300 rounded-md py-2 px-3 pl-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={outputItemSearchQuery}
            onChange={(e) => setOutputItemSearchQuery(e.target.value)}
          />
          <svg className="w-4 h-4 absolute left-2.5 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        {/* 添加新输出物品 */}
        <div className="flex space-x-2">
          <select
            className="flex-1 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newOutputItemId}
            onChange={(e) => setNewOutputItemId(e.target.value)}
          >
            <option value="">选择物品...</option>
            {filteredOutputItems.map(item => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <div className="w-24">
            <input
              type="number"
              min="1"
              value={newOutputAmount}
              onChange={(e) => setNewOutputAmount(parseInt(e.target.value) || 1)}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="数量"
            />
          </div>
          <button
            className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
            onClick={handleAddOutput}
            disabled={!newOutputItemId}
          >
            添加
          </button>
        </div>
        
        {/* 无搜索结果提示 */}
        {debouncedOutputItemSearchQuery && filteredOutputItems.length === 0 && (
          <div className="text-sm text-gray-500 mt-1 italic">
            没有找到匹配的物品
          </div>
        )}
      </div>

      {/* 底部按钮 */}
      <div className='flex justify-end space-x-3'>
        <button
          onClick={onCancel}
          className='px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors'
        >
          取消
        </button>
        <button
          onClick={handleSubmit}
          disabled={!recipeName.trim() || recipeInputs.length === 0 || recipeOutputs.length === 0}
          className={`px-4 py-2 rounded-md text-white ${
            !recipeName.trim() || recipeInputs.length === 0 || recipeOutputs.length === 0
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {mode === 'add' ? '添加' : '保存'}
        </button>
      </div>
    </div>
  );
};

export default RecipeForm;
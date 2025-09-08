/**
 * RecipeList
 * 用于展示Recipes
 * UI设计为
 * Recipe页面左侧为recipeList，右侧为recipeCard
 * 类似于一个配方集合界面
 * 
 * recipeList负责展示所有的recipe
 * 上侧有一个搜索栏以及配方的添加按钮
 * 配方的搜索和添加功能放在recipeList中
 * 配方的编辑和删除功能放在recipeCard中
 */

// 导入必要的hooks和类型
import React, { useState, useEffect } from 'react';
import { useRecipes } from '../hooks/useRecipes';
import type { Recipe } from '../types';
import { useDispatch } from 'react-redux';
import { useItems } from '../hooks/useItems';
import {RecipeForm} from './RecipeForm';

export const RecipeList = () => {
    // 从useRecipes hook获取配方数据和操作方法
    const {
        recipes,
        loading,
        error,
        selectRecipe,
        createRecipe,
        searchRecipes,
        selectedRecipe
    } = useRecipes();

    const {items} = useItems();

    const dispatch = useDispatch();

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

    // 本地状态管理
    const [searchQuery, setSearchQuery] = useState('');  // 搜索关键词
    const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>(recipes);   // 过滤后的配方列表
    const [showAddModal, setShowAddModal] = useState(false); // 是否显示添加配方的模态框

    const debouncedSearchQuery = useDebounce(searchQuery, 300); // 防抖后的搜索关键词

    // 确保初始化时不显示加载状态
    useEffect(() => {
        dispatch({ type: 'RECIPE_LOADING', loading: false });
    }, [])

    // 当搜索查询或配方列表发生变化时，更新过滤后的配方列表
    useEffect(() => {
        if (debouncedSearchQuery.trim() === '') {
            setFilteredRecipes(recipes);
        } else {
            setFilteredRecipes(searchRecipes(debouncedSearchQuery));
        }
    }, [debouncedSearchQuery, recipes, searchRecipes])

    // 处理搜索输入变化
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)
    }


    // 获取配方的第一个输出物品作为展示
    const getMainOutput = (recipe: Recipe) => {
        return recipe.output && recipe.output.length > 0 ? recipe.output[0] : null;
    }



    // 渲染错误状态
    if (error) {
        return (
            <div className='bg-white rounded-lg shadow-md p-4 h-full'>
                <div className="text-red-500 mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    加载失败: {error}
                </div>
                
                {/* 继续显示搜索和添加按钮，允许基本功能 */}
                <div className='flex justify-between items-center mb-4'>
                    <div className='relative flex-grow mr-2'>
                        <input 
                            type='text' 
                            placeholder='搜索配方...' 
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
                        添加配方
                    </button>
                </div>
                
                {/* 显示重试按钮 */}
                <div className="flex justify-center my-4">
                    <button 
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        onClick={() => dispatch({type: 'RECIPE_LOADING', loading: false})}
                    >
                        重试加载
                    </button>
                </div>
            </div>
        );
    }

    // 渲染正常UI
    return (
        <div className='bg-white rounded-lg shadow-md p-4 h-full'>
            {/* 搜索栏和添加按钮区域 */}
            <div className='flex justify-between items-center mb-4'> 
                <div className='relative flex-grow mr-2'>
                    <input 
                        type='text' 
                        placeholder='搜索配方...' 
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
                    添加配方
                </button>
            </div>

            {/* 配方列表区域 */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto max-h-[calc(100vh-220px)]'> 
                {filteredRecipes.length > 0 ? (
                    // 渲染配方列表，使用过滤后的配方数据
                    filteredRecipes.map(recipe => {
                        const mainOutput = getMainOutput(recipe);
                        
                        return (
                            <div 
                                key={recipe.id} 
                                className={`border ${selectedRecipe?.id === recipe.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'} 
                                          rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors`}
                                onClick={() => selectRecipe(recipe.id)}
                            >
                                <div className="flex items-center">
                                    {/* 配方主要输出物品图标 */}
                                    <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 mr-3">
                                        {mainOutput && mainOutput.item.iconUrl ? (
                                            <img src={mainOutput.item.iconUrl} alt={mainOutput.item.name} className="w-10 h-10 object-contain" />
                                        ) : (
                                            <span className="text-2xl font-light">
                                                {mainOutput ? mainOutput.item.name[0] : recipe.name[0]}
                                            </span>
                                        )}
                                    </div>
                                    
                                    <div>
                                        <h3 className="font-medium text-gray-800">{recipe.name}</h3>
                                        <div className="text-sm text-gray-500">
                                            {recipe.input.length} 材料 → {recipe.output.length} 产物
                                        </div>
                                    </div>
                                </div>
                                
                                {/* 简略显示材料和产物 */}
                                <div className="mt-3 pt-3 border-t border-gray-100 text-sm">
                                    <div className="flex items-center">
                                        <span className="text-gray-600 mr-2">材料:</span>
                                        <div className="flex overflow-hidden">
                                            {recipe.input.slice(0, 3).map((input, index) => (
                                                <div key={index} className="w-6 h-6 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center -ml-1 first:ml-0">
                                                    {input.item.iconUrl ? (
                                                        <img src={input.item.iconUrl} alt={input.item.name} className="w-4 h-4" />
                                                    ) : (
                                                        <span className="text-xs">{input.item.name[0]}</span>
                                                    )}
                                                </div>
                                            ))}
                                            {recipe.input.length > 3 && (
                                                <span className="ml-1 text-xs text-gray-500">+{recipe.input.length - 3}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    // 处理空列表状态
                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
                        <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        {searchQuery ? (
                            <p>没有找到匹配的配方</p>
                        ) : (
                            <p>暂无配方，请添加</p>
                        )}
                    </div>
                )}
            </div>

                {showAddModal && (
            <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10'>
                <RecipeForm
                    mode="add"
                    items={items}
                    onSubmit={async (name, inputs, outputs) => {
                        try {
                            await createRecipe(name, inputs, outputs);
                            setShowAddModal(false);
                        } catch (error) {
                            console.error('添加配方失败:', error);
                        }
                    }}
                    onCancel={() => {
                        setShowAddModal(false);
                    }}
                />
            </div>
        )}
        </div>
    );
}

export default RecipeList;
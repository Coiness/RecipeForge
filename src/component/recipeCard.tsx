/**
 * RecipeCard
 * UI：显示配方名称、输入物品、输出物品以及编辑和删除按钮
 * 功能：查看配方详情、编辑配方、删除配方
 */

// 导入必要的hooks和类型
import  { useState, useEffect } from 'react';
import { useRecipes } from '../hooks/useRecipes';
import { useItems } from '../hooks/useItems';
import type { Item_For_Recipe } from '../types';
import { RecipeForm } from './RecipeForm';

export const RecipeCard = () => {
    // 从useRecipes hook获取配方数据和操作方法
    const {
        selectedRecipe,
        modifyRecipe,
        removeRecipe,
    } = useRecipes();

    // 从useItems hook获取物品列表（用于编辑配方时选择物品）
    const { items } = useItems();
    
    // 本地状态管理
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);


    
    // 处理开始编辑
    const handleEditStart = () => {
        if (selectedRecipe) {
            setIsEditing(true);
        }
    };
    
    // 处理删除配方
    const handleDelete = async () => {
        if (!selectedRecipe) return;
        
        try {
            await removeRecipe(selectedRecipe.id);
            setIsDeleting(false);
        } catch (error) {
            console.error('删除配方失败:', error);
        }
    };
    
    // 如果没有选中配方，显示提示信息
    if (!selectedRecipe) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6 h-full flex items-center justify-center">
                <div className="text-center text-gray-500">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>请从左侧列表选择一个配方查看详情</p>
                </div>
            </div>
        );
    }

    useEffect(()=>{
        setIsEditing(false);
        setIsDeleting(false);
    },[])
    
    return (
        <div className="bg-white rounded-lg shadow-md p-6 h-full overflow-y-auto">
            {/* 标题栏和操作按钮 */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">{selectedRecipe.name}</h2>
                <div className="flex space-x-2">
                    <button 
                        className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                        onClick={handleEditStart}
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

            {/* 配方详情 */}
            <div className="space-y-6">
                {/* 输入物品（材料）部分 */}
                <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-md font-medium text-gray-700 mb-3">材料</h3>
                    <div className="space-y-3">
                        {selectedRecipe.input.map((input, index) => (
                            <div key={index} className="flex items-center bg-white p-3 rounded-md border border-gray-200">
                                <div className="w-10 h-10 mr-3 bg-gray-100 rounded-md flex items-center justify-center">
                                    {input.item.iconUrl ? (
                                        <img src={input.item.iconUrl} alt={input.item.name} className="w-8 h-8 object-contain" />
                                    ) : (
                                        <span className="text-xl font-light text-gray-500">{input.item.name[0]}</span>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="text-gray-800 font-medium">{input.item.name}</div>
                                    <div className="text-sm text-gray-500">数量: {input.amount}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* 显示箭头指示流向 */}
                <div className="flex justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>

                {/* 输出物品（产物）部分 */}
                <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-md font-medium text-gray-700 mb-3">产物</h3>
                    <div className="space-y-3">
                        {selectedRecipe.output.map((output, index) => (
                            <div key={index} className="flex items-center bg-white p-3 rounded-md border border-gray-200">
                                <div className="w-10 h-10 mr-3 bg-gray-100 rounded-md flex items-center justify-center">
                                    {output.item.iconUrl ? (
                                        <img src={output.item.iconUrl} alt={output.item.name} className="w-8 h-8 object-contain" />
                                    ) : (
                                        <span className="text-xl font-light text-gray-500">{output.item.name[0]}</span>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="text-gray-800 font-medium">{output.item.name}</div>
                                    <div className="text-sm text-gray-500">数量: {output.amount}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            {isEditing && selectedRecipe && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                    <RecipeForm
                        mode="edit"
                        initialValues={{
                            name: selectedRecipe.name,
                            inputs: selectedRecipe.input,
                            outputs: selectedRecipe.output
                        }}
                        items={items}
                        onSubmit={async (name, inputs, outputs) => {
                            try {
                                await modifyRecipe(selectedRecipe.id, {
                                    name,
                                    input: inputs,
                                    output: outputs
                                });
                                setIsEditing(false);
                            } catch (error) {
                                console.error('更新配方失败:', error);
                            }
                        }}
                        onCancel={() => setIsEditing(false)}
                    />
                </div>
            )}
            
            {/* 删除确认模态框 */}
            {isDeleting && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-medium mb-4">确认删除</h3>
                        <p className="mb-6">您确定要删除配方 "{selectedRecipe.name}" 吗？此操作无法撤销。</p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setIsDeleting(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none"
                            >
                                取消
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
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

export default RecipeCard;
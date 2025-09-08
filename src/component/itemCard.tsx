/**
 * ItemCard
 * UI：名字 + 图标 + 数量 + 编辑 + 删除
 * 功能：编辑物品名字，图片，删除物品，物品合成配方等内容
 */


// 1. 导入必要的hook和类型
import {useEffect,useState} from 'react';
import type { Item } from '../types/item';
import { useItems } from '../hooks/useItems';
import type { Recipe } from '../types/recipe';
import { useRecipes } from '../hooks/useRecipes';

export const ItemCard = () => {

    const {
        selectedItem,
        modifyItem,
        removeItem,
    } = useItems();

    const{
        findRecipesByInput,
        findRecipesByOutput
    } = useRecipes();



    // 本地状态
    const [isEditing,setIsEditing] = useState(false);
    const [editedName,setEditedName] = useState(selectedItem?.name || '');
    const [editedIconUrl,setEditedIconUrl] = useState(selectedItem?.iconUrl || '');
    const [isDeleting,setIsDeleting] = useState(false);
    const [itemRecipes,setItemRecipes] = useState<Recipe[]>([]);

    const [mockItem,setMockItem] = useState<Item>({
        id: 'item-001',
        name: '示例物品',
        iconUrl: '',
    });
    

    // 使用useEffect处理副作用
    // 当selectedItem变化时，更新本地编辑状态
    // 当删除物品后，selectedItem可能变为null
    useEffect(()=>{
        setMockItem(selectedItem || {
            id: 'item-001',
            name: '示例物品',
            iconUrl: '',
        })
        setEditedName(selectedItem?.name || '');
        setEditedIconUrl(selectedItem?.iconUrl || '');
        setItemRecipes(selectedItem?{
            ...findRecipesByInput(selectedItem.id),
            ...findRecipesByOutput(selectedItem.id)
        }:[]);
    },[selectedItem]);



    
    // 事件处理函数
    // 编辑物品事件（记得加上表单验证 以及 对于selectedItem的验证）
    const handleEditClick = () => {
        modifyItem(mockItem.id,{
            name: editedName,
            iconUrl: editedIconUrl,
        });
        setIsEditing(false);
    }

    // 删除物品事件
    const handleDeleteClick = () => {
        if(window.confirm('确定要删除该物品吗？')) {
            removeItem(mockItem.id);
            setMockItem({
                id: 'item-001',
                name: '示例物品',
                iconUrl: '',
            });
        }
        setIsDeleting(false);
    }

    return(
        <div className="bg-white rounded-lg shadow-md p-6 h-full">
            {/* 标题栏和操作按钮 */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">{mockItem.name}</h2>
                <div className="flex space-x-2">
                    <button className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                            disabled = {selectedItem === null}
                            onClick={() => setIsEditing(true)}
                    >
                        编辑
                    </button>
                    <button className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                            disabled = {selectedItem === null}
                            onClick={() => setIsDeleting(true)}
                    >
                        删除
                    </button>
                </div>
            </div>

            {/* 物品详情 */}
            <div className="flex flex-col md:flex-row mb-6">
                {/* 物品图标 */}
                <div className="flex justify-center mb-4 md:mb-0 md:mr-6">
                    {mockItem.iconUrl !== '' ? (
                        <img 
                            src={mockItem.iconUrl} 
                            alt={mockItem.name} 
                            className="w-32 h-32 object-contain bg-gray-100 rounded-md p-2"
                        />
                    ) : (
                        <div className="w-32 h-32 flex items-center justify-center bg-gray-100 rounded-md">
                            <span className="text-gray-400 text-4xl font-light">{mockItem.name[0]}</span>
                        </div>
                    )}
                </div>

                {/* 物品基本信息 */}
                <div className="flex-1">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-md font-medium text-gray-700 mb-2">基本信息</h3>
                        <div className="grid grid-cols-1 gap-2">
                            <div className="flex">
                                <span className="text-gray-500 w-24">名称:</span>
                                <span className="text-gray-800">{mockItem.name}</span>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

                        {/* 物品相关配方 */}
            <div className='space-y-6'>
                {/* 分类显示配方 */}
                {itemRecipes.length > 0 ? (
                    <>
                        {/* 作为材料的配方 */}
                        {itemRecipes.filter(recipe => recipe.input.some(input => input.item.id === mockItem.id)).length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-700 mb-3">作为材料的配方</h3>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {itemRecipes
                                            .filter(recipe => recipe.input.some(input => input.item.id === mockItem.id))
                                            .map(recipe => (
                                                <div 
                                                    key={recipe.id} 
                                                    className="border border-gray-200 rounded-md p-3 bg-white hover:bg-gray-50 cursor-pointer"
                                                >
                                                    <div className="flex items-center">
                                                        <div className="w-8 h-8 bg-gray-200 rounded mr-2 flex items-center justify-center">
                                                            <span className="text-xs">{recipe.output[0]?.item.name[0]}</span>
                                                        </div>
                                                        <span>{recipe.name}</span>
                                                    </div>
                                                    <div className="mt-2 text-xs text-gray-500">
                                                        需要 {recipe.input.find(input => input.item.id === mockItem.id)?.amount || 0} 个
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        )}
            
                        {/* 作为产物的配方 */}
                        {itemRecipes.filter(recipe => recipe.output.some(output => output.item.id === mockItem.id)).length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-700 mb-3">生产方法</h3>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {itemRecipes
                                            .filter(recipe => recipe.output.some(output => output.item.id === mockItem.id))
                                            .map(recipe => (
                                                <div 
                                                    key={recipe.id} 
                                                    className="border border-gray-200 rounded-md p-3 bg-white hover:bg-gray-50 cursor-pointer"
                                                >
                                                    <div className="flex items-center">
                                                        <div className="w-8 h-8 bg-gray-200 rounded mr-2 flex items-center justify-center">
                                                            <span className="text-xs">{recipe.name[0]}</span>
                                                        </div>
                                                        <span>{recipe.name}</span>
                                                    </div>
                                                    <div className="mt-2 text-xs text-gray-500">
                                                        产出 {recipe.output.find(output => output.item.id === mockItem.id)?.amount || 0} 个
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    // 没有相关配方时显示提示信息
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-blue-700">
                        <h3 className="font-medium mb-2">暂无相关配方</h3>
                        <p className="text-sm">
                            {selectedItem ? 
                                `"${selectedItem.name}" 目前没有相关的配方信息。您可以在配方管理页面创建使用或生产此物品的配方。` :
                                '请从左侧选择一个物品以查看相关配方。'
                            }
                        </p>
                    </div>
                )}
            </div>

            
            {/* 添加物品模态框 */}
            {isEditing && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10'>
                    <div className='bg-white rounded-lg p-6 w-full max-w-md'>
                        <h3 className='text-lg font-medium mb-4'>添加新物品</h3>

                        <div className='mb-4'>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                物品名称<span className='text-red-500'>*</span>
                            </label>

                            <input 
                                type='text'
                                value={editedName}
                                onChange={(e)=> setEditedName(e.target.value)}
                                className='w-full border border-gray-300 rounded-md py-2 px-3 foucs:outline-none foucs:ring-2 foucus:ring-blue-500'
                                placeholder='请输入物品名称'    
                            ></input>
                        </div>

                        <div className='mb-6'>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                物品图标URL    
                            </label>

                            <input
                                type = 'text'
                                value={editedIconUrl}
                                onChange={(e) => setEditedIconUrl(e.target.value)}
                                className='w-full border border-gray-300 rounded-md py-2 px-3 foucs:outline-none foucs:ring-2 foucus:ring-blue-500'
                                placeholder='请输入物品图标的URL地址(可选)'
                            ></input>
                        </div>

                        <div className='flex justify-end space-x-3'>
                            <button
                                onClick={() => setIsEditing(false)}
                                className='px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors'
                            >取消</button>

                            <button
                                onClick={handleEditClick}
                                // 禁用条件：名称为空时禁用
                                disabled={!editedName.trim()}
                                className= {`px-4 py-2 rounded-md text-white ${
                                    !editedName.trim()?'bg-gray-400 cursor-not-allowed':'bg-blue-500 hover:bg-blue-600 '
                                }`}
                            >确定</button>
                        </div>
                    </div>
                </div>)
            }

            {/* 删除物品模态框 */}
            {isDeleting && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10'>
                    <div className='bg-white rounded-lg p-6 w-full max-w-md'>
                        <h3 className='text-lg font-medium mb-4'>删除物品</h3>
                        <p className='mb-6'>确定要删除该物品吗？此操作不可撤销。</p>
                        <div className='flex justify-end space-x-3'>
                            <button
                                onClick={() => setIsDeleting(false)}
                                className='px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors'
                            >取消</button>
                            <button
                                onClick={handleDeleteClick}
                                className='px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors'
                            >删除</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ItemCard;
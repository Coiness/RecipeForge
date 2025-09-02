/**
 * itemList
 * 用于展示Items
 * UI设计为
 * Item页面左侧为itemList，右侧为itemCard
 * 类似于一个背包界面
 * 
 * itemList负责展示所有的item
 * 上侧有一个搜索栏以及物品的添加按钮
 * 物品的搜索和添加功能放在itemList中
 * 物品的编辑和删除功能放在itemCard中
 */

// todo：给搜索加上防抖

// 导入必要的hooks和类型
import React,{useState,useEffect} from 'react';
import { useItems } from '../hooks/useItems';
import type { Item } from '../types';
import { useDispatch } from 'react-redux';

export const ItemList = () => {
    // 步骤1；从useItems hook获取物品数据和操作方法
    const {
        items,
        loading,
        error,
        selectItem,
        createItem,
        searchItems,
        selectedItem
    } = useItems();

    const dispatch = useDispatch();

    
    function useDebounce<T>(value:T,delay:number):T{
        const [debouncedValue,setDebouncedValue] = useState<T>(value);

        useEffect(()=>{
            const timer = setTimeout(()=>{
                setDebouncedValue(value);
            },delay)

            return () => clearTimeout(timer);
        },[value,delay]);

        return debouncedValue;
    }

    // 步骤2：本地状态管理
    // 这些状态只在组件内部使用，不需要全局共享
    const [searchQuery,setSearchQuery] = useState('');  // 搜索关键词
    const [filteredItems,setFilteredItems] = useState<Item[]>(items);   // 过滤后的物品列表
    const [showAddModal,setShowAddModal] = useState(false); // 是否显示添加物品的模态框
    const [newItemName,setNewItemName] = useState(''); // 新物品名称
    const [newItemIcon,setNewItemIcon] = useState(''); // 新物品图标URL

    const debouncedSearchQuery = useDebounce(searchQuery,300); // 防抖后的搜索关键词

    // 步骤3：使用 useEffect 处理副作用
    useEffect(() => {
        dispatch({type:'ITEM_LOADING',payload:false});
    },[])



    // 当搜索查询或物品列表发生变化时，更新过滤后的物品列表
    useEffect(() => {
        if(searchQuery.trim() === '') {
            setFilteredItems(items);
        }else{
            setFilteredItems(searchItems(searchQuery));
        }
    },[debouncedSearchQuery,items,searchItems])

    // 步骤4：定义事件处理函数
    // 处理搜索输入变化
    // 这里的 e 是什么
    const handleSearchChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)
    }

    // 处理添加物品按钮点击
    const handleAddItem = async () => {
        if(!newItemName.trim()) {
            alert('物品名称不能为空');
            return;
        }

        if(items.some(item => item.name === newItemName.trim())) {
            alert('物品名称已存在，请使用不同的名称');
            return;
        }
        
        try{
            // 调用 hook 提供的创建物品方法
            await createItem(newItemName,newItemIcon)
            setNewItemName('');
            setNewItemIcon('');
            setShowAddModal(false);
        } catch(error){
            console.error('添加物品失败:',error);
        }
    }


    // 步骤5: 处理不同的状态渲染
    // 渲染加载状态
    if (loading) {
        return (
            <div className='bg-white rounded-lg shadow-md p-4 h-full flex items-center justify-center'>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500">加载中</div>
            </div>
        );
    }
    



    // 步骤6: 渲染正常UI
    return(
        <div className='bg-white rounded-lg shadow-md p-4 h-full'>
            {/* 搜索栏和添加按钮区域 */}
            <div className='flex justify-between items-center mb-4'> 
                <div className='relative flex-grow mr-2'>
                    <input 
                        type='text' 
                        placeholder='搜索物品...' 
                        className='w-full border border-gray-300 rounded-md py-2 px-3 pl-8 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                    <svg className="w-4 h-4 absolute left-2.5 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <button className='bg-blue-500 hover:bg-blue-600 text-white rounded-md px-4 py-2 transition-colors'
                        onClick={() => setShowAddModal(true)}
                >
                    添加物品
                </button>
            </div>


            {/* 物品列表区域 */}
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 overflow-y-auto max-h-[calc(100vh-220px)]'> 
                {filteredItems.length > 0 ? (
                    // 步骤7: 渲染物品列表，使用过滤后的物品数据
                    filteredItems.map(item => (
                        <div 
                            key={item.id} // 使用唯一ID作为key
                            // 条件类名：当物品被选中时应用高亮样式
                            className={`border ${selectedItem?.id === item.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'} 
                                      rounded-lg p-3 flex flex-col items-center hover:bg-gray-50 cursor-pointer transition-colors`}
                            onClick={() => selectItem(item.id)} // 点击时选中物品
                        >
                            {/* 条件渲染：有图标则显示图片，否则显示占位符 */}
                            {item.iconUrl !== '' ? (
                                <img src={item.iconUrl} alt={item.name} className="w-12 h-12 object-contain mb-2" />
                            ) : (
                                <div className="w-12 h-12 bg-gray-200 rounded-md mb-2 flex items-center justify-center text-gray-500">
                                    <span>{item.name[0]}</span>
                                </div>
                            )}
                            <span className="text-sm text-center">{item.name}</span>
                        </div>
                    ))
                ) : (
                    // 步骤8: 处理空列表状态
                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
                        <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        {/* 根据是否有搜索条件显示不同的空状态消息 */}
                        {searchQuery ? (
                            <p>没有找到匹配的物品</p>
                        ) : (
                            <p>暂无物品，请添加</p>
                        )}
                    </div>
                )}
            </div>


            {/* 添加物品模态框 */}
            {showAddModal&& (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10'>
                    <div className='bg-white rounded-lg p-6 w-full max-w-md'>
                        <h3 className='text-lg font-medium mb-4'>添加新物品</h3>

                        <div className='mb-4'>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                物品名称<span className='text-red-500'>*</span>
                            </label>

                            <input 
                                type='text'
                                value={newItemName}
                                onChange={(e)=> setNewItemName(e.target.value)}
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
                                value={newItemIcon}
                                onChange={(e) => setNewItemIcon(e.target.value)}
                                className='w-full border border-gray-300 rounded-md py-2 px-3 foucs:outline-none foucs:ring-2 foucus:ring-blue-500'
                                placeholder='请输入物品图标的URL地址(可选)'
                            ></input>
                        </div>

                        <div className='flex justify-end space-x-3'>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className='px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors'
                            >取消</button>

                            <button
                                onClick={handleAddItem}
                                // 禁用条件：名称为空时禁用
                                disabled={!newItemName.trim() }
                                className= {`px-4 py-2 rounded-md text-white ${
                                    !newItemName.trim()?'bg-gray-400 cursor-not-allowed':'bg-blue-500 hover:bg-blue-600 '
                                }`}
                            >确定</button>
                        </div>
                    </div>
                </div>)
            }
        
        </div>
    )
}

export default ItemList;

//**组件功能总结
// 物品展示功能
// 使用响应式网格布局展示所有物品
// 自动适应不同屏幕尺寸
// 为每个物品显示图标和名称
// 高亮显示当前选中的物品
//  
// 物品搜索功能
// 提供实时搜索功能，根据名称过滤物品
// 为空搜索结果显示适当的提示信息
// 使用防抖技术优化搜索性能
// 
// 物品添加功能
// 提供添加新物品的模态框
//  提供表单输入字段，用于输入物品名称和图片URL
// 实现表单验证，确保必填字段不为空
// 成功添加后清空表单并关闭模态框
//
// 状态管理与数据交互
// 通过 useItems Hook 获取和管理物品数据
// 处理物品选择，将选中物品信息传递给父组件
// 实现组件内的本地状态管理
// 
// 错误处理与加载状态
// 显示加载状态动画，提高用户体验
// 显示错误信息，帮助用户理解问题
// 处理空列表状态，提供适当的引导
// 
// 用户体验优化
// 所有交互元素都有悬停效果，提供视觉反馈
// 按钮在无效状态下自动禁用，防止错误操作
// 使用动画和过渡效果，使界面更加流畅
// 响应式设计，确保在各种设备上都有良好的显示效果
// 
// 架构亮点
// 关注点分离：UI逻辑与业务逻辑分离，通过Hook连接
// 条件渲染：根据不同状态显示不同界面
// 副作用管理：使用useeffect处理搜索过滤等副作用
// 类型安全：通过ts类型定义确保数据结构一致性*/
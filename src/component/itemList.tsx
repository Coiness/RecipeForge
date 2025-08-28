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

export const ItemList = () =>{
    return(
        <div className='bg-white p-4 m-0 h-full w-3/4'>
            <div className='flex justify-between items-center            <div className="border border-gray-200 rounded-lg p-3 flex flex-col items-center hover:bg-gray-50 cursor-pointer transition-colors">            <div className="border border-gray-200 rounded-lg p-3 flex flex-col items-center hover:bg-gray-50 cursor-pointer transition-colors"> bg-blue-300 rounded-lg m-4 w-full h-1/6'>{/*顶部操作区域*/}
                <div className='bg-white rounded-lg h-5/6 w-3/5 mx-6'>{/*搜索栏 */}
                    <input type='text' placeholder='搜索物品...'/>
                </div>
                <div className='bg-white h-5/6 w-auto mx-6'>添加物品</div>
            </div>

            <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 overflow-y-scroll'> {/*物品列表区域*/}
                {/*放置物品图标 */}
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="border border-gray-200 rounded-lg p-3 flex items-center hover:bg-gray-50 cursor-pointer transition-colors">
                        <div className="w-12 h-12 bg-gray-200 rounded-md mb-2 flex items-center justify-center text-gray-500">
                            <span>图标</span>
                        </div>
                        <span className="text-sm">物品 {i}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

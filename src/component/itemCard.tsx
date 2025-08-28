/**
 * ItemCard
 * UI：名字 + 图标 + 数量 + 编辑 + 删除
 * 编辑弹出卡片，可以修改名字，图标，数量
 */

export const ItemCard = () => {
    return(
        <div className="bg-blue-200 w-1/5 m-2 h-auto">总容器
            <div className="flex justify-center items-end gap-3">顶部编辑按钮+删除按钮
                <button>编辑按钮</button>
                <button>删除按钮</button>
            </div>
            <div>物品图标</div>
            <div>物品名称</div>
            <div>物品数量</div>
        </div>
    )
}
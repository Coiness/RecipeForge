import { ItemCard } from "../component/itemCard";
import { ItemList } from "../component/itemList";

export const ItemPage = () => {
    return(
        <div className="flex h-full">
            <div className="w-2/5 pr-4">
                <ItemList />
            </div>
            <div className="w-3/5 pl-4">
                <ItemCard />
            </div>
        </div>
    )
}

export default ItemPage;
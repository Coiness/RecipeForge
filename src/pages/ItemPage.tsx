import { ItemCard } from "../component/itemCard";
import { ItemList } from "../component/itemList";

export const ItemPage = () => {
    return(
        <div className="flex h-full">
            <ItemList />
            <ItemCard />
        </div>
    )
}

export default ItemPage;
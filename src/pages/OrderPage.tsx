import {OrderList} from "../component/orderList"
import {OrderCard} from "../component/orderCard"

export const OrderPage = () => {
    return(
        <div className="flex h-full">
            <div className="w-2/5 pr-4">
                <OrderList />
            </div>
            <div className="w-3/5 pl-4">
                <OrderCard />
            </div>
        </div>
    )
}

export default OrderPage;
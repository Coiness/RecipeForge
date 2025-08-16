import { ADD_ORDER,UPDATE_ORDER,DELETE_ORDER,SET_ORDERS,ORDER_ERROR } from "../actions/orderActions";
import type { Order } from '../../types';

//这个是我们正在维护的状态吗？其中的loadding属性是什么，干什么用的
interface OrderState {
    orders: Order[];
    loading: boolean;
    error: string | null;
}

const initialState: OrderState = {
    orders: [],
    loading: false,
    error: null
};

export default function orderReducer(state = initialState, action: any): OrderState {
    switch (action.type) {
        case 'ORDER_LOADING':
            return {
                ...state,
                loading: action.loading
            };

        case ADD_ORDER:
            return {
                ...state,
                orders: [...state.orders, action.payload],
                error: null,
                loading: action.loading
            };

        case UPDATE_ORDER:
            return {
                ...state,
                orders: state.orders.map(order => order.id === action.payload.id ? action.payload : order),
                error: null,
                loading: action.loading
            };

        case DELETE_ORDER:
            return {
                ...state,
                orders: state.orders.filter(order => order.id !== action.payload.id),
                error: null
            };

        case SET_ORDERS:
            return {
                ...state,
                orders: action.payload,
                error: null
            };

        case ORDER_ERROR:
            return {
                ...state,
                error: action.payload
            };

        default:
            return state;
    }
}


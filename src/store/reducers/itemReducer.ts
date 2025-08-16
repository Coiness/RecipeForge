import { ADD_ITEM,UPDATE_ITEM,DELETE_ITEM,SET_ITEMS,ITEM_ERROR } from "../actions/itemActions";
import type {Item} from  '../../types'

interface ItemState{
    items: Item[];
    loading: boolean;
    error: string | null;
}

const initialState:ItemState = {
    items:[],
    loading: false,
    error: null
}

export default function itemReducer(state = initialState,action:any):ItemState{
    switch(action.type){
        case ADD_ITEM:
            return{
                ...state,
                items:[...state.items,action.payload],
                error:null
            }

        case UPDATE_ITEM{
            return{
                ...state,
                items:state.items.map(item=>item.id === action.payload.id ? action.payload : item),
                error:null
            }
        }

        case DELETE_ITEM:
            return{
                ...state,
                items:state.items.filter(item => item.id!== action.payload.id),
                error:null
        }

        case SET_ITEMS:
            return{
                ...state,
                items: action.payload,
                error: null
            }

        case ITEM_ERROR:
            return{
                ...state,
                error: action.payload
            }

        default:
            return state;
    }
}


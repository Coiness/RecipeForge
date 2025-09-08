import { ADD_RECIPE,DELETE_RECIPE,UPDATE_RECIPE,SELECT_RECIPE,RECIPE_ERROR,SET_RECIPES, RECIPE_LOADING} from "../actions/recipeActions";
import type { Recipe } from '../../types';

interface RecipeState {
    recipes: Recipe[];
    loading: boolean;
    error: string | null;
    selectedRecipe: Recipe | null;
}

const initialState: RecipeState = {
    recipes: [],
    loading: false,
    error: null,
    selectedRecipe: null,
};

export default function recipeReducer(state = initialState, action: any): RecipeState {
    switch (action.type) {
        case RECIPE_LOADING:
            return {
                ...state,
                loading: action.loading
            };

        case SELECT_RECIPE:
            return {
                ...state,
                selectedRecipe: action.payload,
            };


        case ADD_RECIPE:
            return {
                ...state,
                recipes: [...state.recipes, action.payload],
                error: null
            };

        case UPDATE_RECIPE:
            return {
                ...state,
                recipes: state.recipes.map(recipe => recipe.id === action.payload.id ? action.payload : recipe),
                error: null
            };

        case DELETE_RECIPE:
            return {
                ...state,
                recipes: state.recipes.filter(recipe => recipe.id !== action.payload.id),
                error: null
            };

        case SET_RECIPES:
            return {
                ...state,
                recipes: action.payload,
                error: null
            };

        case RECIPE_ERROR:
            return {
                ...state,
                error: action.payload
            };

        default:
            return state;
    }
}
import {
  CALCULATION_LOADING,
  SET_CALCULATION_RECIPES,
  CALCULATE_RECIPE_MATERIALS,
  CALCULATE_ORDER_MATERIALS,
  CALCULATE_BULK_ORDERS,
  CHECK_CIRCULAR_DEPENDENCY,
  GET_DEPENDENCY_TREE,
  CALCULATION_ERROR,
  CLEAR_CALCULATION_RESULTS,
  SET_PREFERRED_RECIPE,
  CLEAR_PREFERRED_RECIPE,
  GET_ITEM_RECIPES
} from '../actions/calculationActions';
import type { Recipe, Item_For_Recipe } from '../../types';

interface CalculationState {
  recipes: Recipe[];
  preferredRecipes: Record<string, string>;
  materials: Item_For_Recipe[];
  currentCalculation: {
    type: 'recipe' | 'order' | 'bulk' | null;
    id: string | string[] | null;
    amount?: number;
  };
  circularDependencies: Record<string, boolean>;
  dependencyTrees: Record<string, any>;
  loading: boolean;
  error: string | null;
}

const initialState: CalculationState = {
  recipes: [],
  preferredRecipes: {},
  materials: [],
  currentCalculation: {
    type: null,
    id: null
  },
  circularDependencies: {},
  dependencyTrees: {},
  loading: false,
  error: null
};

export default function calculationReducer(state = initialState, action: any): CalculationState {
  switch (action.type) {
    case SET_PREFERRED_RECIPE:
      return {
        ...state,
        preferredRecipes: {
          ...state.preferredRecipes,
          [action.payload.itemId]: action.payload.recipeId
        }
      };

    


    case CLEAR_PREFERRED_RECIPE:
      const updatedPreferences = { ...state.preferredRecipes };
      delete updatedPreferences[action.payload.itemId];
      return {
        ...state,
        preferredRecipes: updatedPreferences
      };

    case CALCULATION_LOADING:
      return {
        ...state,
        loading: action.loading
      };
      
    case SET_CALCULATION_RECIPES:
      return {
        ...state,
        recipes: action.payload,
        error: null
      };
      
    case CALCULATE_RECIPE_MATERIALS:
      return {
        ...state,
        materials: action.payload.materials,
        currentCalculation: {
          type: 'recipe',
          id: action.payload.recipeId,
          amount: action.payload.amount
        },
        error: null
      };
      
    case CALCULATE_ORDER_MATERIALS:
      return {
        ...state,
        materials: action.payload.materials,
        currentCalculation: {
          type: 'order',
          id: action.payload.orderId
        },
        error: null
      };
      
    case CALCULATE_BULK_ORDERS:
      return {
        ...state,
        materials: action.payload.materials,
        currentCalculation: {
          type: 'bulk',
          id: action.payload.orderIds
        },
        error: null
      };
      
    case CHECK_CIRCULAR_DEPENDENCY:
      return {
        ...state,
        circularDependencies: {
          ...state.circularDependencies,
          [action.payload.recipeId]: action.payload.hasCircularDependency
        },
        error: null
      };
      
    case GET_DEPENDENCY_TREE:
      return {
        ...state,
        dependencyTrees: {
          ...state.dependencyTrees,
          [action.payload.recipeId]: action.payload.dependencyTree
        },
        error: null
      };
      
    case CALCULATION_ERROR:
      return {
        ...state,
        error: action.payload
      };
      
    case CLEAR_CALCULATION_RESULTS:
      return {
        ...state,
        materials: [],
        currentCalculation: {
          type: null,
          id: null
        },
        error: null
      };
      
    default:
      return state;
  }
}
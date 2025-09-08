import { RecipeCard } from "../component/recipeCard";
import { RecipeList } from "../component/recipeList";

export const RecipePage = () => {
    return(
        <div className="flex h-full">
            <div className="w-2/5 pr-4">
                <RecipeList/>
            </div>
            <div className="w-3/5 pl-4">
                <RecipeCard/>
            </div>
        </div>
    )
}

export default RecipePage;
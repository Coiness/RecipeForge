import { useAppSelector } from "./useRedux";
import { useMemo } from "react";

export const useRecipeWithLatestData = (recipeId:string) => {
    if(!recipeId) return null;

    const recipe = useAppSelector(state =>
        state.recipes.recipes.find(r => r.id === recipeId)
    )
    const items = useAppSelector(state => state.items.items);

    return useMemo(() => {
        if(!recipe) return null;

        return{
            ...recipe,
        input:recipe?.input.map(input => {
            const latestItem = items.find(i => i.id === input.item.id) || input.item;
            return { ...input, item: latestItem };
        }),
        output: recipe?.output.map(output => {
            const latestItem = items.find(i => i.id === output.item.id) || output.item;
            return { ...output, item: latestItem };
        })
        }
    },[recipe, items])


}

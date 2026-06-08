"use server";

import { getRecipeLink } from "../_dataprovider/RecipeDataProvider";

export const fetchRecipeLink = async (recipeId: string): Promise<string> => {
    return getRecipeLink(recipeId);
};

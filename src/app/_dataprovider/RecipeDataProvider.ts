import "server-only";
import { Constants } from "../_utils/Constants";
import { Recipe } from "../_models/Recipe";

const apiToken = process.env.TANDOOR_TOKEN;

export const getRecipes = async (): Promise<Recipe[]> => {
    console.log("Fetching list of recipes");
    try {
        const apiUrl = `${Constants.TANDOOR_URI}/api/recipe/?format=json`;
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiToken}`,
        };

        const response = await fetch(apiUrl, {
            method: "GET",
            headers: headers,
            next: { revalidate: 3600 }, // 1 hour
        });

        if (!response.ok) {
            throw new Error(`Error fetching recipes: ${response.statusText}`);
        }

        const data = await response.json();
        return data.results;
    } catch (err) {
        const msg = `Failed to fetch recipes after retries, error: ${err}`;
        console.error(msg);
        return [];
    }
};

export const getRecipeLink = async (recipeId: string): Promise<string> => {
    console.log(`Fetching link for recipe ID: ${recipeId}`);
    try {
        const apiUrl = `${Constants.TANDOOR_URI}/api/share-link/${recipeId}`;
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiToken}`,
        };

        const response = await fetch(apiUrl, {
            method: "GET",
            headers: headers
        });

        if (!response.ok) {
            throw new Error(`Error fetching recipe link: ${response.statusText}`);
        }

        const data = await response.json();
        return data.link;
    } catch (err) {
        const msg = `Failed to fetch recipe link after retries, error: ${err}`;
        console.error(msg);
        return "";
    }
}

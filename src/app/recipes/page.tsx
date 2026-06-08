import { getRecipes } from "../_dataprovider/RecipeDataProvider";
import RecipeList from "../_components/RecipeList";

export const revalidate = 3600;

const RecipePage = async () => {
    const recipes = await getRecipes();

    return <RecipeList recipes={recipes} />;
};

export default RecipePage;

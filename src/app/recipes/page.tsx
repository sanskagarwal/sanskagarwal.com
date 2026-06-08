import { getRecipes } from "../_dataprovider/RecipeDataProvider";
import RecipeList from "../_components/RecipeList";

export const dynamic = "force-dynamic";

const RecipePage = async () => {
    const recipes = await getRecipes();

    return <RecipeList recipes={recipes} />;
};

export default RecipePage;

import { getRecipes } from "../_dataprovider/RecipeDataProvider";
import RecipeList from "../_components/RecipeList";

export const metadata = {
    title: "Recipes",
    description: "A collection of recipes by Sanskar Agarwal.",
    alternates: { canonical: "/recipes" },
};

export const dynamic = "force-dynamic";

const RecipePage = async () => {
    const recipes = await getRecipes();

    return <RecipeList recipes={recipes} />;
};

export default RecipePage;

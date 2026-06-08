"use client";

import React, { useState } from "react";
import { Recipe } from "../_models/Recipe";
import { fetchRecipeLink } from "../_actions/recipes";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardMeta,
} from "semantic-ui-react";
import Image from "next/image";

const RecipeList: React.FC<{ recipes: Recipe[] }> = ({ recipes }) => {
    const [loadingLinks, setLoadingLinks] = useState<{
        [key: string]: boolean;
    }>({});
    const [recipeLinks, setRecipeLinks] = useState<{ [key: string]: string }>(
        {}
    );

    const handleGetLink = async (recipeId: string) => {
        if (recipeLinks[recipeId]) {
            window.open(recipeLinks[recipeId], "_blank");
            return;
        }

        setLoadingLinks((prev) => ({ ...prev, [recipeId]: true }));
        try {
            const dataLink = await fetchRecipeLink(recipeId);
            setRecipeLinks((prev) => ({ ...prev, [recipeId]: dataLink }));
            window.open(dataLink, "_blank");
        } catch (err) {
            console.error("Failed to fetch recipe link", err);
        } finally {
            setLoadingLinks((prev) => ({ ...prev, [recipeId]: false }));
        }
    };

    return (
        <div className="p-4 flex gap-4 flex-col justify-center items-center">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-10">
                {recipes
                    .sort(
                        (a, b) =>
                            new Date(b.created_at).getTime() -
                            new Date(a.created_at).getTime()
                    )
                    .map((recipe: Recipe) => (
                        <Card className="ui card !m-0" key={recipe.id.toString()}>
                            <Image
                                src={recipe.image}
                                alt={recipe.name}
                                width={0}
                                height={0}
                                quality={100}
                                style={{
                                    width: "100%",
                                    height: "20vh",
                                    objectFit: "cover",
                                }}
                                unoptimized
                            />
                            <CardContent>
                                <CardHeader>{recipe.name}</CardHeader>
                                <CardMeta>
                                    {recipe.keywords.map((keyword) => {
                                        return (
                                            <span
                                                className="ui label"
                                                key={keyword.id}
                                            >
                                                {keyword.label}
                                            </span>
                                        );
                                    })}
                                </CardMeta>
                                <CardDescription>
                                    {recipe.description}
                                </CardDescription>
                            </CardContent>
                            <CardContent extra className="self-center">
                                <CardMeta>
                                    <span className="ui grey label">
                                        <i className="clock icon"></i>{" "}
                                        {recipe.working_time} min
                                    </span>
                                    <span className="ui brown label">
                                        <i className="pause icon"></i>{" "}
                                        {recipe.waiting_time} min
                                    </span>
                                    <span className="ui blue label">
                                        <i className="users icon"></i>{" "}
                                        {recipe.servings} servings
                                    </span>
                                </CardMeta>
                            </CardContent>
                            <button
                                className="ui bottom attached button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleGetLink(recipe.id);
                                }}
                            >
                                {loadingLinks[recipe.id] ? (
                                    <i className="loading spinner icon" />
                                ) : (
                                    "View"
                                )}
                            </button>
                        </Card>
                    ))}
            </div>
        </div>
    );
};

export default RecipeList;

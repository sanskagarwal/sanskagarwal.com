"use client";

import React, { useMemo, useState } from "react";
import { Recipe } from "../_models/Recipe";
import { fetchRecipeLink } from "../_actions/recipes";
import {
    FaSpinner,
    FaClock,
    FaPause,
    FaUsers,
    FaUtensils,
    FaArrowUpRightFromSquare,
} from "react-icons/fa6";
import Image from "next/image";

import { Card, CardContent, CardFooter } from "./ui/Card";

const RecipeList: React.FC<{ recipes: Recipe[] }> = ({ recipes }) => {
    const [loadingLinks, setLoadingLinks] = useState<Record<string, boolean>>(
        {}
    );
    const [recipeLinks, setRecipeLinks] = useState<Record<string, string>>({});
    const [errorLinks, setErrorLinks] = useState<Record<string, boolean>>({});

    const sorted = useMemo(
        () =>
            [...recipes].sort(
                (a, b) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime()
            ),
        [recipes]
    );

    const handleGetLink = async (recipeId: string) => {
        if (recipeLinks[recipeId]) {
            window.open(recipeLinks[recipeId], "_blank");
            return;
        }

        setLoadingLinks((prev) => ({ ...prev, [recipeId]: true }));
        setErrorLinks((prev) => ({ ...prev, [recipeId]: false }));
        try {
            const dataLink = await fetchRecipeLink(recipeId);
            setRecipeLinks((prev) => ({ ...prev, [recipeId]: dataLink }));
            window.open(dataLink, "_blank");
        } catch (err) {
            console.error("Failed to fetch recipe link", err);
            setErrorLinks((prev) => ({ ...prev, [recipeId]: true }));
        } finally {
            setLoadingLinks((prev) => ({ ...prev, [recipeId]: false }));
        }
    };

    return (
        <div className="mx-auto w-full max-w-6xl px-5 py-8 md:px-8">
            <header className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Recipes</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    {sorted.length} {sorted.length === 1 ? "recipe" : "recipes"}
                </p>
            </header>

            {sorted.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-16 text-center">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        <FaUtensils className="h-5 w-5" />
                    </span>
                    <p className="text-muted-foreground">
                        No recipes available right now - check back soon.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {sorted.map((recipe) => (
                        <Card key={recipe.id.toString()} className="card-hover overflow-hidden">
                            <div className="relative h-48 w-full">
                                <Image
                                    src={recipe.image}
                                    alt={recipe.name}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    className="object-cover"
                                />
                            </div>
                            <CardContent className="grow pt-4">
                                <h2 className="mb-1 text-lg font-bold">
                                    {recipe.name}
                                </h2>
                                <div
                                    className="mb-2 flex flex-wrap gap-1"
                                    aria-label="Keywords"
                                >
                                    {recipe.keywords.map((keyword) => (
                                        <span
                                            key={keyword.id}
                                            className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
                                        >
                                            {keyword.label}
                                        </span>
                                    ))}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {recipe.description}
                                </p>
                            </CardContent>
                            <div className="flex flex-wrap justify-center gap-1 px-4 pb-4">
                                <span
                                    className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs text-foreground"
                                    aria-label={`Cooking time ${recipe.working_time} minutes`}
                                >
                                    <FaClock aria-hidden="true" />{" "}
                                    {recipe.working_time} min
                                </span>
                                <span
                                    className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs text-amber-700 dark:text-amber-400"
                                    aria-label={`Waiting time ${recipe.waiting_time} minutes`}
                                >
                                    <FaPause aria-hidden="true" />{" "}
                                    {recipe.waiting_time} min
                                </span>
                                <span
                                    className="inline-flex items-center gap-1 rounded-full bg-blue-500/15 px-2.5 py-0.5 text-xs text-blue-700 dark:text-blue-400"
                                    aria-label={`${recipe.servings} servings`}
                                >
                                    <FaUsers aria-hidden="true" />{" "}
                                    {recipe.servings} servings
                                </span>
                            </div>
                            <CardFooter className="flex-col items-stretch">
                                {errorLinks[recipe.id] && (
                                    <p
                                        role="alert"
                                        className="px-4 py-2 text-center text-xs text-red-600 dark:text-red-400"
                                    >
                                        Couldn&apos;t open this recipe. Please
                                        try again.
                                    </p>
                                )}
                                <button
                                    className="flex h-11 flex-1 items-center justify-center gap-1.5 bg-accent font-semibold text-accent-foreground transition-colors hover:bg-muted"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleGetLink(recipe.id);
                                    }}
                                    aria-label={`View recipe: ${recipe.name}`}
                                >
                                    {loadingLinks[recipe.id] ? (
                                        <FaSpinner className="animate-spin" />
                                    ) : (
                                        <>
                                            View recipe
                                            <FaArrowUpRightFromSquare className="text-xs" />
                                        </>
                                    )}
                                </button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecipeList;

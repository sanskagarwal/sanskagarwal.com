"use client";

import React, { useMemo, useState } from "react";
import { Recipe } from "../_models/Recipe";
import { fetchRecipeLink } from "../_actions/recipes";
import { FaSpinner, FaClock, FaPause, FaUsers } from "react-icons/fa6";
import Image from "next/image";

import { Card, CardContent, CardFooter } from "./ui/Card";

const RecipeList: React.FC<{ recipes: Recipe[] }> = ({ recipes }) => {
    const [loadingLinks, setLoadingLinks] = useState<Record<string, boolean>>(
        {}
    );
    const [recipeLinks, setRecipeLinks] = useState<Record<string, string>>({});

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
        <div className="mx-auto w-full max-w-6xl px-5 py-8 md:px-8">
            <header className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Recipes</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    {sorted.length} {sorted.length === 1 ? "recipe" : "recipes"}
                </p>
            </header>

            {sorted.length === 0 ? (
                <p className="py-12 text-center text-muted-foreground">
                    No recipes available right now.
                </p>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {sorted.map((recipe) => (
                        <Card key={recipe.id.toString()} className="overflow-hidden">
                            <Image
                                src={recipe.image}
                                alt={recipe.name}
                                width={0}
                                height={0}
                                quality={100}
                                style={{
                                    width: "100%",
                                    height: "12rem",
                                    objectFit: "cover",
                                }}
                                unoptimized
                            />
                            <CardContent className="grow pt-4">
                                <h2 className="mb-1 text-lg font-bold">
                                    {recipe.name}
                                </h2>
                                <div className="mb-2 flex flex-wrap gap-1">
                                    {recipe.keywords.map((keyword) => (
                                        <span
                                            key={keyword.id}
                                            className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground"
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
                                <span className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-xs text-foreground">
                                    <FaClock /> {recipe.working_time} min
                                </span>
                                <span className="inline-flex items-center gap-1 rounded bg-amber-500/15 px-2 py-0.5 text-xs text-amber-700 dark:text-amber-400">
                                    <FaPause /> {recipe.waiting_time} min
                                </span>
                                <span className="inline-flex items-center gap-1 rounded bg-blue-500/15 px-2 py-0.5 text-xs text-blue-700 dark:text-blue-400">
                                    <FaUsers /> {recipe.servings} servings
                                </span>
                            </div>
                            <CardFooter>
                                <button
                                    className="flex flex-1 items-center justify-center bg-accent py-2 font-semibold text-accent-foreground transition-colors hover:bg-muted"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleGetLink(recipe.id);
                                    }}
                                >
                                    {loadingLinks[recipe.id] ? (
                                        <FaSpinner className="animate-spin" />
                                    ) : (
                                        "View"
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

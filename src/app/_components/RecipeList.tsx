"use client";

import React, { useState } from "react";
import { Recipe } from "../_models/Recipe";
import { fetchRecipeLink } from "../_actions/recipes";
import { FaSpinner, FaClock, FaPause, FaUsers } from "react-icons/fa6";
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
                        <div
                            className="flex flex-col bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
                            key={recipe.id.toString()}
                        >
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
                            <div className="p-4 grow">
                                <div className="font-bold text-lg mb-1">
                                    {recipe.name}
                                </div>
                                <div className="flex flex-wrap gap-1 mb-2">
                                    {recipe.keywords.map((keyword) => {
                                        return (
                                            <span
                                                className="inline-block px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-700"
                                                key={keyword.id}
                                            >
                                                {keyword.label}
                                            </span>
                                        );
                                    })}
                                </div>
                                <div className="text-gray-700 text-sm">
                                    {recipe.description}
                                </div>
                            </div>
                            <div className="px-4 pb-4 self-center">
                                <div className="flex flex-wrap gap-1 justify-center">
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded bg-gray-200 text-gray-700">
                                        <FaClock /> {recipe.working_time} min
                                    </span>
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded bg-amber-100 text-amber-800">
                                        <FaPause /> {recipe.waiting_time} min
                                    </span>
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-800">
                                        <FaUsers /> {recipe.servings} servings
                                    </span>
                                </div>
                            </div>
                            <button
                                className="flex items-center justify-center py-2 bg-gray-100 text-gray-800 font-semibold hover:bg-gray-200 transition-colors border-t border-gray-200"
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
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default RecipeList;

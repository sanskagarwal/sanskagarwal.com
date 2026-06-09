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
    FaMagnifyingGlass,
} from "react-icons/fa6";
import Image from "next/image";

import { cn } from "../_utils/cn";
import { Card, CardContent } from "./ui/Card";
import { Input } from "./ui/Input";

const RecipeList: React.FC<{ recipes: Recipe[] }> = ({ recipes }) => {
    const [loadingLinks, setLoadingLinks] = useState<Record<string, boolean>>(
        {}
    );
    const [recipeLinks, setRecipeLinks] = useState<Record<string, string>>({});
    const [errorLinks, setErrorLinks] = useState<Record<string, boolean>>({});
    const [searchTerm, setSearchTerm] = useState("");
    const [activeKeyword, setActiveKeyword] = useState("all");

    const sorted = useMemo(
        () =>
            [...recipes].sort(
                (a, b) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime()
            ),
        [recipes]
    );

    const keywords = useMemo(() => {
        const labels = new Set<string>();
        sorted.forEach((recipe) =>
            recipe.keywords.forEach((keyword) => labels.add(keyword.label))
        );
        return ["all", ...Array.from(labels).sort()];
    }, [sorted]);

    const filtered = useMemo(
        () =>
            sorted
                .filter(
                    (recipe) =>
                        recipe.name
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()) ||
                        recipe.description
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())
                )
                .filter(
                    (recipe) =>
                        activeKeyword === "all" ||
                        recipe.keywords.some(
                            (keyword) => keyword.label === activeKeyword
                        )
                ),
        [sorted, searchTerm, activeKeyword]
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
                <p
                    className="mt-1 text-sm text-muted-foreground"
                    role="status"
                    aria-live="polite"
                >
                    {filtered.length}{" "}
                    {filtered.length === 1 ? "recipe" : "recipes"}
                </p>
            </header>

            {sorted.length > 0 && (
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div
                        className="flex flex-wrap gap-2"
                        role="group"
                        aria-label="Filter by keyword"
                    >
                        {keywords.map((keyword) => {
                            const isActive = keyword === activeKeyword;
                            return (
                                <button
                                    key={keyword}
                                    onClick={() => setActiveKeyword(keyword)}
                                    aria-pressed={isActive}
                                    className={cn(
                                        "rounded-full border px-3 py-1.5 text-sm font-semibold capitalize transition-colors",
                                        isActive
                                            ? "border-primary bg-primary text-primary-foreground"
                                            : "border-border text-muted-foreground hover:bg-accent"
                                    )}
                                >
                                    {keyword}
                                </button>
                            );
                        })}
                    </div>
                    <div className="relative w-full sm:w-64">
                        <FaMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search recipes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                            aria-label="Search recipes"
                        />
                    </div>
                </div>
            )}

            {sorted.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-16 text-center">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        <FaUtensils className="h-5 w-5" />
                    </span>
                    <p className="text-muted-foreground">
                        No recipes available right now - check back soon.
                    </p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-16 text-center">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        <FaMagnifyingGlass className="h-5 w-5" />
                    </span>
                    <p className="text-muted-foreground">
                        No recipes found. Try a different search or keyword.
                    </p>
                    {(searchTerm || activeKeyword !== "all") && (
                        <button
                            onClick={() => {
                                setSearchTerm("");
                                setActiveKeyword("all");
                            }}
                            className="text-sm font-semibold text-primary hover:underline"
                        >
                            Clear filters
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((recipe) => (
                        <Card
                            key={recipe.id.toString()}
                            className="card-hover group overflow-hidden"
                        >
                            <div className="relative aspect-[16/10] w-full overflow-hidden">
                                <Image
                                    src={recipe.image}
                                    alt={recipe.name}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>
                            <CardContent className="grow space-y-3 pt-4">
                                <h2 className="text-lg font-bold leading-tight">
                                    {recipe.name}
                                </h2>
                                {recipe.keywords.length > 0 && (
                                    <div
                                        className="flex flex-wrap gap-1.5"
                                        aria-label="Keywords"
                                    >
                                        {recipe.keywords.map((keyword) => (
                                            <button
                                                key={keyword.id}
                                                onClick={() =>
                                                    setActiveKeyword(
                                                        keyword.label
                                                    )
                                                }
                                                className="rounded-full border border-border px-2.5 py-0.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                                            >
                                                {keyword.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                <p className="text-sm text-muted-foreground">
                                    {recipe.description}
                                </p>
                            </CardContent>
                            <div className="flex flex-wrap gap-2 px-4 pb-4 pt-1 text-xs text-muted-foreground">
                                <span
                                    className="inline-flex items-center gap-1.5"
                                    aria-label={`Cooking time ${recipe.working_time} minutes`}
                                >
                                    <FaClock
                                        aria-hidden="true"
                                        className="text-foreground/70"
                                    />
                                    {recipe.working_time} min
                                </span>
                                <span aria-hidden="true" className="opacity-40">
                                    ·
                                </span>
                                <span
                                    className="inline-flex items-center gap-1.5"
                                    aria-label={`Waiting time ${recipe.waiting_time} minutes`}
                                >
                                    <FaPause
                                        aria-hidden="true"
                                        className="text-amber-600 dark:text-amber-400"
                                    />
                                    {recipe.waiting_time} min
                                </span>
                                <span aria-hidden="true" className="opacity-40">
                                    ·
                                </span>
                                <span
                                    className="inline-flex items-center gap-1.5"
                                    aria-label={`${recipe.servings} servings`}
                                >
                                    <FaUsers
                                        aria-hidden="true"
                                        className="text-blue-600 dark:text-blue-400"
                                    />
                                    {recipe.servings} servings
                                </span>
                            </div>
                            <div className="mt-auto flex flex-col gap-2 p-4 pt-0">
                                {errorLinks[recipe.id] && (
                                    <p
                                        role="alert"
                                        className="text-center text-xs text-red-600 dark:text-red-400"
                                    >
                                        Couldn&apos;t open this recipe. Please
                                        try again.
                                    </p>
                                )}
                                <button
                                    className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-md bg-primary font-semibold text-primary-foreground shadow-sm transition-all duration-150 hover:opacity-90 active:scale-[0.98]"
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
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecipeList;

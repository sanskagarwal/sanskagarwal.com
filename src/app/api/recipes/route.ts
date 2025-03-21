import "server-only";

import { NextResponse } from "next/server";
import { getRecipes } from "@/app/_dataprovider/RecipeDataProvider";

export async function GET() {
    const data = await getRecipes();
    return NextResponse.json(data);
}

export const dynamic = "force-dynamic"; // defaults to auto

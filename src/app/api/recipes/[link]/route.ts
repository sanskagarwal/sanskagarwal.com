import "server-only";

import { NextResponse } from "next/server";
import { getRecipeLink } from "@/app/_dataprovider/RecipeDataProvider";

type Params = {
    link: string;
};

export async function GET(request: Request, { params }: { params: Params }) {
    const data = await getRecipeLink(params.link);
    return NextResponse.json(data);
}

export const dynamic = "force-dynamic"; // defaults to auto

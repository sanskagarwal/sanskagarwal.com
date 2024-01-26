import "server-only";

import { getBlogs } from "@/app/_dataprovider/BlogDataProvider";
import { NextResponse } from "next/server";

export async function GET() {
    const data = await getBlogs();
    return NextResponse.json(data)
}

export const dynamic = 'force-dynamic' // defaults to auto

import "server-only";

import { getBlog } from "@/app/_dataprovider/BlogDataProvider";
import { NextResponse } from "next/server";

type Params = {
    url: string;
};

export async function GET(
    request: Request,
    { params }: { params: Params }
) {
    const data = await getBlog(params.url);
    return NextResponse.json(data);
}

export const dynamic = 'force-dynamic' // defaults to auto

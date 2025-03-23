import "server-only";

import { getNote } from "@/app/_dataprovider/NoteDataProvider";
import { NextResponse } from "next/server";

type Params = {
    url: string;
};

export async function GET(request: Request, { params }: { params: Params }) {
    const data = await getNote(params.url);
    return NextResponse.json(data);
}

export const dynamic = "force-dynamic"; // defaults to auto

import "server-only";

import { getNotes } from "@/app/_dataprovider/NoteDataProvider";
import { NextResponse } from "next/server";

export async function GET() {
    const data = await getNotes();
    return NextResponse.json(data);
}

export const dynamic = "force-dynamic"; // defaults to auto

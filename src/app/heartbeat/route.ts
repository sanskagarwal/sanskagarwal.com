import { HttpStatusCode } from "axios";
import { NextResponse } from "next/server";

export async function GET() {
    const data = {
        status: HttpStatusCode.Ok,
    };

    return NextResponse.json(data);
}

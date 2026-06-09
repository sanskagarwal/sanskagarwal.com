import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = () =>
    NextResponse.json(
        {
            status: "ok",
            service: "Personal Website",
            timestamp: new Date().toISOString(),
        },
        {
            headers: {
                "Cache-Control": "no-store",
            },
        },
    );

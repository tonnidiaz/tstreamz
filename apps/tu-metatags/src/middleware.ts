import { tuErr } from "@repo/ui-next/lib/funcs";
import { NextRequest, NextResponse } from "next/server";

export const middleware = async (req: NextRequest) => {
    console.log("\n[MIDDLEWARE]");
    const res = NextResponse.next();
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, DELETE"
    );
    res.headers.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
    );

    return res;
};
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        {
            source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
            missing: [
                { type: "header", key: "next-router-prefetch" },
                { type: "header", key: "purpose", value: "prefetch" },
            ],
        },
    ],
};

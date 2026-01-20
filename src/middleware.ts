import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (PUBLIC_FILE.test(pathname)) {
        return NextResponse.next();
    }

    if (
        pathname.startsWith("/lock") ||
        pathname.startsWith("/api") ||
        pathname.startsWith("/_next")
    ) {
        return NextResponse.next();
    }

    const unlocked = req.cookies.get("os_unlocked")?.value === "1";

    if (!unlocked) {
        const url = req.nextUrl.clone();
        url.pathname = "/lock";
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/:path*"],
};

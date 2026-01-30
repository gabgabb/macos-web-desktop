import { verifyUnlockedCookieEdge } from "@/src/core/auth/osUnlockCookie";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;

export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (PUBLIC_FILE.test(pathname)) {
        return NextResponse.next();
    }

    if (
        pathname.startsWith("/lock") ||
        pathname.startsWith("/api") ||
        pathname.startsWith("/_next") ||
        pathname.startsWith("/")
    ) {
        return NextResponse.next();
    }

    const cookies = req.cookies.get("os_unlocked")?.value;

    const unlocked = await verifyUnlockedCookieEdge(
        cookies,
        process.env.COOKIE_SIGN_SECRET!,
    );

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

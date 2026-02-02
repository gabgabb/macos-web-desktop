import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
    const res = NextResponse.json({ unlocked: false });

    res.cookies.set("os_unlocked", "", {
        path: "/",
        maxAge: 0,
    });

    return res;
}

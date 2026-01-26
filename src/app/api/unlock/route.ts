import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    const { password } = await req.json();
    const expected = process.env.NEXT_PUBLIC_LOCK_PASSWORD;

    if (!expected || password !== expected) {
        return NextResponse.json({ unlocked: false }, { status: 401 });
    }

    const res = NextResponse.json({ unlocked: true });

    res.cookies.set("os_unlocked", "1", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 6,
    });

    return res;
}

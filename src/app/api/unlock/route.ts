import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { password } = await req.json();

    const expected = process.env.NEXT_PUBLIC_LOCK_PASSWORD;

    if (!expected) {
        return NextResponse.json(
            { ok: false, error: "Missing server password env" },
            { status: 500 },
        );
    }

    if (password !== expected) {
        return NextResponse.json(
            { ok: false, error: "Invalid password" },
            { status: 401 },
        );
    }

    const res = NextResponse.json({ ok: true });

    res.cookies.set("os_unlocked", "1", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 6,
    });

    return res;
}

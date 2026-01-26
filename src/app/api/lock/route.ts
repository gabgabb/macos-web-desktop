import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
    const res = NextResponse.json({ unlocked: false });

    res.cookies.delete("os_unlocked");

    return res;
}

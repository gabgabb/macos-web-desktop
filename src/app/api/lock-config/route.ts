import { NextResponse } from "next/server";

export function GET() {
    return NextResponse.json({
        passwordLength: process.env.LOCK_PASSWORD?.length ?? 6,
    });
}

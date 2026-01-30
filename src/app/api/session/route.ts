import { verifyUnlockedCookie } from "@/src/core/auth/osUnlockCookie";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    const cookiesStore = await cookies();
    const raw = cookiesStore.get("os_unlocked")?.value;

    const unlocked = verifyUnlockedCookie(raw);

    return NextResponse.json({ unlocked });
}

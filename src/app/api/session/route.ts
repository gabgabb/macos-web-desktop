import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    const cookiesStore = await cookies();
    const unlocked = cookiesStore.get("os_unlocked")?.value === "1";

    return NextResponse.json({ unlocked });
}

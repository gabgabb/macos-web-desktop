export const runtime = "nodejs";

import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

export async function GET() {
    try {
        const dir = path.join(process.cwd(), "public", "Wallpaper");
        const files = await fs.readdir(dir);

        const wallpapers = files
            .filter((f) => /\.(png|jpg|jpeg|webp)$/i.test(f))
            .map((f) => ({
                id: f,
                label: f
                    .replace(/\.(png|jpg|jpeg|webp)$/i, "")
                    .replace(/[-_]/g, " "),
                src: `/Wallpaper/${f}`,
            }));

        return NextResponse.json({ wallpapers });
    } catch (e) {
        console.error("API /wallpapers failed:", e);
        return NextResponse.json({ wallpapers: [] }, { status: 500 });
    }
}

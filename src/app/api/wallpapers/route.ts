export const runtime = "nodejs";

import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

const PROJECT_ROOT = path.join(process.cwd(), "public", "wallpapers");
const VIDEO_ROOT =
    process.env.NODE_ENV === "production"
        ? "/var/www/assets/wallpapers"
        : PROJECT_ROOT;

export async function GET() {
    try {
        const categories = ["dynamic", "static", "video"] as const;
        const wallpapers: any[] = [];

        for (const category of categories) {
            const baseRoot = category === "video" ? VIDEO_ROOT : PROJECT_ROOT;

            const categoryDir = path.join(baseRoot, category);

            let entries: string[];
            try {
                entries = await fs.readdir(categoryDir);
            } catch {
                continue;
            }

            // ---- DYNAMIC (light / dark) ----
            if (category === "dynamic") {
                const map = new Map<string, any>();

                for (const file of entries) {
                    const ext = path.extname(file);
                    if (![".webp", ".jpg", ".png"].includes(ext)) continue;

                    const name = path.basename(file, ext);
                    const match = name.match(/(.+)-(light|dark)$/i);
                    if (!match) continue;

                    const base = match[1];
                    const variant = match[2] as "light" | "dark";

                    if (!map.has(base)) {
                        map.set(base, {
                            id: base,
                            label: base.replace(/[-_]/g, " "),
                            category: "dynamic",
                            variants: {},
                            media: null,
                            thumb: undefined,
                        });
                    }

                    const entry = map.get(base);

                    const src = `/wallpapers/dynamic/${file}`;

                    entry.variants[variant] = {
                        type: "image",
                        src,
                    };

                    if (!entry.thumb) entry.thumb = src;
                }

                for (const w of map.values()) {
                    w.media = w.variants.light ?? w.variants.dark;
                    wallpapers.push(w);
                }
            }

            // ---- STATIC ----
            if (category === "static") {
                for (const file of entries) {
                    const ext = path.extname(file);
                    if (![".webp", ".jpg", ".png"].includes(ext)) continue;

                    const name = path.basename(file, ext);

                    wallpapers.push({
                        id: name,
                        label: name.replace(/[-_]/g, " "),
                        category: "static",
                        media: {
                            type: "image",
                            src: `/wallpapers/static/${file}`,
                        },
                        thumb: `/wallpapers/static/${file}`,
                    });
                }
            }

            // ---- VIDEO ----
            if (category === "video") {
                for (const file of entries) {
                    if (!file.endsWith(".mp4")) continue;

                    const name = path.basename(file, ".mp4");
                    const poster = `${name}-poster.webp`;

                    wallpapers.push({
                        id: name,
                        label: name.replace(/[-_]/g, " "),
                        category: "video",
                        media: {
                            type: "video",
                            src: `/wallpapers/video/${file}`,
                            poster: `/wallpapers/video/${poster}`,
                        },
                        thumb: `/wallpapers/video/${poster}`,
                    });
                }
            }
        }

        return NextResponse.json({ wallpapers });
    } catch {
        return NextResponse.json({ wallpapers: [] }, { status: 500 });
    }
}

"use client";

import { WallpaperGrid } from "@/src/components/apps/SettingsApp/WallpaperGrid";
import { Wallpaper } from "@/src/core/apps/types";
import { ACCENTS } from "@/src/core/ui/ui-constants";
import { withViewTransition } from "@/src/helpers/withViewTransition.helpers";
import { useDesktopStore } from "@/src/store/desktop-store";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export function SettingsApp() {
    const wallpaper = useDesktopStore((s) => s.settings.wallpaper);
    const setWallpaper = useDesktopStore((s) => s.setWallpaper);
    const accentColor = useDesktopStore((s) => s.settings.accentColor);
    const setAccent = useDesktopStore((s) => s.setAccentColor);

    const [loading, setLoading] = useState<boolean>(true);
    const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);

    const appearanceRef = useRef<HTMLDivElement>(null);
    const dynamicRef = useRef<HTMLDivElement>(null);
    const staticRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLDivElement>(null);
    const accentColorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetch("/api/wallpapers")
            .then((r) => r.json())
            .then((data) => setWallpapers(data.wallpapers))
            .finally(() => setLoading(false));
    }, []);

    const dynamic = wallpapers.filter((w) => w.category === "dynamic");
    const statics = wallpapers.filter((w) => w.category === "static");
    const videos = wallpapers.filter((w) => w.category === "video");

    const { theme, setTheme } = useTheme();

    return (
        <div className="flex h-full gap-4 rounded-b-2xl bg-white/10 p-4 text-white">
            <div className="flex w-48 shrink-0 flex-col gap-2 rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-md">
                <div className="flex gap-3">
                    <Image
                        src="/Cameleon.webp"
                        alt="Avatar"
                        width={200}
                        height={160}
                        className="size-10 rounded-full object-cover"
                    />
                    <div className="mt-2 text-lg font-semibold">Aurora</div>
                </div>

                <div className="mt-3 space-y-1 text-sm text-white/80">
                    <div className="text-lg font-semibold opacity-90">
                        Settings
                    </div>
                    <div
                        className="rounded-lg px-2 py-1 text-white transition-all hover:cursor-pointer hover:bg-white/20 hover:font-semibold"
                        onClick={() =>
                            appearanceRef.current?.scrollIntoView({
                                behavior: "smooth",
                            })
                        }
                    >
                        Appearance
                    </div>
                    <div
                        onClick={() =>
                            accentColorRef.current?.scrollIntoView({
                                behavior: "smooth",
                            })
                        }
                        className="rounded-lg px-2 py-1 text-white transition-all hover:cursor-pointer hover:bg-white/20 hover:font-semibold"
                    >
                        Color
                    </div>
                    <div className="flex flex-col items-start text-white">
                        Wallpapers
                        <div
                            className="mt-1 w-full rounded-lg px-2 py-1 transition-all hover:cursor-pointer hover:bg-white/20 hover:font-semibold"
                            onClick={() =>
                                dynamicRef.current?.scrollIntoView({
                                    behavior: "smooth",
                                })
                            }
                        >
                            Dynamic wallpapers
                        </div>
                        <div
                            className="w-full rounded-lg px-2 py-1 transition-all hover:cursor-pointer hover:bg-white/20 hover:font-semibold"
                            onClick={() =>
                                staticRef.current?.scrollIntoView({
                                    behavior: "smooth",
                                })
                            }
                        >
                            Static wallpapers
                        </div>
                        <div
                            className="w-full rounded-lg px-2 py-1 transition-all hover:cursor-pointer hover:bg-white/20 hover:font-semibold"
                            onClick={() =>
                                videoRef.current?.scrollIntoView({
                                    behavior: "smooth",
                                })
                            }
                        >
                            Video wallpapers
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 space-y-6 overflow-auto rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                <section ref={appearanceRef}>
                    <div className="text-base font-semibold">Appearance</div>

                    <div className="mt-3 inline-flex gap-1 rounded-xl bg-black/20 p-1 transition-transform duration-300">
                        {(["light", "dark", "system"] as const).map((t) => {
                            const active = theme === t;

                            return (
                                <button
                                    key={t}
                                    onClick={() =>
                                        withViewTransition(() => setTheme(t))
                                    }
                                    className={`relative rounded-lg px-4 py-2 text-sm font-medium transition transition-all duration-200 ${
                                        active
                                            ? "bg-[rgb(var(--accent))]/60 text-black shadow-md"
                                            : "text-white/70 hover:text-white"
                                    } `}
                                >
                                    {t === "light"
                                        ? "☀️ Light"
                                        : t === "dark"
                                          ? "🌙 Dark"
                                          : "💻 System"}
                                </button>
                            );
                        })}
                    </div>
                </section>
                <section>
                    <div
                        ref={accentColorRef}
                        className="text-base font-semibold"
                    >
                        Accent color
                    </div>
                    <div className="mt-3 flex gap-2">
                        {Object.entries(ACCENTS).map(([key, value]) => {
                            const active = accentColor === key;

                            return (
                                <button
                                    key={key}
                                    onClick={() => setAccent(key as any)}
                                    className={`relative h-8 w-8 rounded-full ring-2 transition ${
                                        active
                                            ? "ring-accent scale-110"
                                            : "ring-transparent hover:scale-105"
                                    }`}
                                    style={{
                                        backgroundColor: `rgb(${value})`,
                                    }}
                                    aria-label={key}
                                />
                            );
                        })}
                    </div>
                </section>
                {loading && (
                    <div className="flex h-48 w-full items-center justify-center">
                        <div className="flex items-center gap-3 text-sm text-white/70">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            Loading wallpapers…
                        </div>
                    </div>
                )}
                {!loading && wallpapers.length === 0 && (
                    <div className="text-center text-sm text-white/60">
                        No wallpapers found
                    </div>
                )}
                <WallpaperGrid
                    title="Dynamic wallpapers"
                    wallpapers={dynamic}
                    activeId={wallpaper.id}
                    onSelect={setWallpaper}
                    ref={dynamicRef}
                />

                <WallpaperGrid
                    title="Static wallpapers"
                    wallpapers={statics}
                    activeId={wallpaper.id}
                    onSelect={setWallpaper}
                    ref={staticRef}
                />

                <WallpaperGrid
                    title="Video wallpapers"
                    wallpapers={videos}
                    activeId={wallpaper.id}
                    onSelect={setWallpaper}
                    ref={videoRef}
                />
            </div>
        </div>
    );
}

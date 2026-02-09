"use client";

import { AccentColor } from "@/src/components/apps/SettingsApp/AccentColor";
import { LinkToSection } from "@/src/components/apps/SettingsApp/LinkToSection";
import { Theme } from "@/src/components/apps/SettingsApp/Theme";
import { WallpaperGrid } from "@/src/components/apps/SettingsApp/WallpaperGrid";
import { Wallpaper } from "@/src/core/apps/types";
import { useDesktopStore } from "@/src/store/desktop-store";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export function SettingsApp() {
    const wallpaper = useDesktopStore((s) => s.settings.wallpaper);
    const setWallpaper = useDesktopStore((s) => s.setWallpaper);

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

    useEffect(() => {
        wallpapers.forEach((w) => {
            const src =
                w.thumb ??
                (w.media.type === "image" ? w.media.src : w.media.poster);

            if (!src) return;

            const img = new window.Image();
            img.decoding = "async";
            img.loading = "eager";
            img.src = src;
            img.src = src;
        });
    }, [wallpapers]);

    const dynamic = wallpapers.filter((w) => w.category === "dynamic");
    const statics = wallpapers.filter((w) => w.category === "static");
    const videos = wallpapers.filter((w) => w.category === "video");

    return (
        <div className="flex h-full gap-4 rounded-b-2xl bg-(--window) p-4 text-(--text-primary)">
            <div className="flex w-48 shrink-0 flex-col gap-2 rounded-2xl border border-(--border-control) bg-(--sidebar) p-3 shadow-(--shadow-sidebar) backdrop-blur-md">
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

                <div className="mt-3 flex flex-col text-sm font-semibold text-(--text-strong)">
                    <LinkToSection ref={appearanceRef} content={"Theme"} />
                    <LinkToSection
                        ref={accentColorRef}
                        content="Accent color"
                    />
                    <div className="mt-3 flex flex-col items-start">
                        Wallpapers
                        <LinkToSection
                            ref={dynamicRef}
                            content={"Dynamic wallpapers"}
                        />
                        <LinkToSection
                            ref={staticRef}
                            content={"Static wallpapers"}
                        />
                        <LinkToSection
                            ref={videoRef}
                            content={"Video wallpapers"}
                        />
                    </div>
                </div>
            </div>

            <div className="flex-1 space-y-4 overflow-auto rounded-2xl border border-(--border-control) bg-(--sidebar) p-4 shadow-(--shadow-window) backdrop-blur-md">
                <section
                    ref={appearanceRef}
                    className="flex flex-col items-start gap-2"
                    key="theme"
                    id="theme"
                >
                    <div className="text-base font-semibold">Theme</div>
                    <Theme />
                </section>
                <section
                    className="flex flex-col items-start gap-2"
                    key="accent"
                    id="accent"
                >
                    <div
                        ref={accentColorRef}
                        className="text-base font-semibold"
                    >
                        Accent color
                    </div>
                    <AccentColor />
                </section>
                {loading && (
                    <div className="flex h-48 w-full items-center justify-center">
                        <div className="/70 flex items-center gap-3 text-sm">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30" />
                            Loading wallpapers…
                        </div>
                    </div>
                )}
                {!loading && wallpapers.length === 0 && (
                    <div className="/60 text-center text-sm">
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

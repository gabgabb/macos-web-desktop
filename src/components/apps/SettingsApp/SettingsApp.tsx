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
    const reset = useDesktopStore((s) => s.reset);

    const [loading, setLoading] = useState<boolean>(true);
    const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);

    const appearanceRef = useRef<HTMLDivElement>(null);
    const dynamicRef = useRef<HTMLDivElement>(null);
    const staticRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLDivElement>(null);
    const accentColorRef = useRef<HTMLDivElement>(null);
    const resetSessionRef = useRef<HTMLDivElement>(null);
    const aboutRef = useRef<HTMLDivElement>(null);

    const [showResetModal, setShowResetModal] = useState<boolean>(false);

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
        <div className="relative flex h-full gap-4 rounded-b-2xl bg-(--window) p-4 text-(--text-primary)">
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
                    <LinkToSection
                        ref={resetSessionRef}
                        content={"Reset session"}
                    />
                    <LinkToSection
                        ref={aboutRef}
                        content={"About this project"}
                    />
                </div>
            </div>

            <div
                data-testid="wallpaper-root"
                className="flex-1 space-y-4 overflow-auto rounded-2xl border border-(--border-control) bg-(--sidebar) p-4 shadow-(--shadow-window) backdrop-blur-md"
            >
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
                    <div
                        data-testid="wallpapers-loaded"
                        className="flex h-48 w-full items-center justify-center"
                    >
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
                <section
                    ref={resetSessionRef}
                    className="flex flex-col items-start gap-2"
                    key="resetSession"
                    id="resetSession"
                >
                    <div className="text-base font-semibold">Reset session</div>
                    <button
                        className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                        onClick={() => setShowResetModal(true)}
                    >
                        Reset Session
                    </button>
                </section>
                <section
                    ref={aboutRef}
                    className="mt-8 flex flex-col gap-4 border-t border-(--border-control) pt-4"
                >
                    <div className="text-base font-semibold">
                        About the webOS
                    </div>

                    <div className="flex items-start">
                        <div className="max-w-4/5 space-y-2 text-justify text-base text-(--text-primary)/80">
                            <p>
                                This webOS is a personal project inspired by
                                modern operating systems, built with Next.js and
                                TypeScript. It features a customizable desktop,
                                dynamic wallpapers, and a variety of
                                applications to enhance your productivity and
                                creativity.
                            </p>

                            <p>
                                Designed and developed by{" "}
                                <a
                                    href={
                                        "https://www.linkedin.com/in/gabriel-filiot-475277209/"
                                    }
                                    target="_blank"
                                    className="inline-block text-blue-400 hover:underline"
                                >
                                    Gabriel Filiot
                                </a>
                                .
                            </p>
                            <a
                                href="https://github.com/gabgabb/macos-web-desktop"
                                target="_blank"
                                className="inline-block text-blue-400 hover:underline"
                            >
                                View source on GitHub
                            </a>
                        </div>
                    </div>
                </section>
            </div>
            {showResetModal && (
                <div
                    className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 backdrop-blur-md"
                    onClick={() => setShowResetModal(false)}
                >
                    <div
                        className="bg-background w-full max-w-md rounded-xl border border-(--border-control) p-6 text-(--text-primary)"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="mb-4 text-lg font-semibold">
                            Reset session?
                        </h3>

                        <p className="mb-6 text-sm text-(--text-secondary)">
                            This will clear all saved state and restart the
                            system.
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowResetModal(false)}
                                className="rounded-md px-4 py-2 hover:bg-(--border-control)"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={async () => {
                                    setShowResetModal(false);
                                    reset();
                                }}
                                className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

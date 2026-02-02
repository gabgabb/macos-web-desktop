"use client";

import { useDesktopStore } from "@/src/store/desktop-store";
import Image from "next/image";
import { useEffect, useState } from "react";

export function SettingsApp() {
    const wallpaper = useDesktopStore((s) => s.settings.wallpaper);
    const theme = useDesktopStore((s) => s.settings.theme);
    const setWallpaper = useDesktopStore((s) => s.setWallpaper);
    const setTheme = useDesktopStore((s) => s.setTheme);

    const [wallpapers, setWallpapers] = useState<any[]>([]);

    useEffect(() => {
        fetch("/api/wallpapers")
            .then((r) => r.json())
            .then((data) => setWallpapers(data.wallpapers));
    }, []);

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
                    <div className="text-sm font-semibold opacity-90">
                        Settings
                    </div>
                    <div className="rounded-lg px-2 py-1 text-white transition-all hover:cursor-pointer hover:bg-white/20 hover:font-semibold">
                        Appearance
                    </div>
                    <div className="rounded-lg px-2 py-1 text-white transition-all hover:cursor-pointer hover:bg-white/20 hover:font-semibold">
                        Wallpaper
                    </div>
                </div>
            </div>

            <div className="flex-1 space-y-6 overflow-auto rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                <section>
                    <div className="text-base font-semibold">Appearance</div>
                    <div className="mt-3 flex gap-2">
                        {(["light", "dark", "auto"] as const).map((t) => (
                            <button
                                key={t}
                                onClick={() => setTheme(t)}
                                className={`rounded-xl px-3 py-2 text-sm transition ${
                                    theme === t
                                        ? "bg-white/20"
                                        : "bg-white/10 hover:bg-white/15"
                                }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </section>

                <section>
                    <div className="text-base font-semibold">Wallpapers</div>
                    <div className="mt-3 flex flex-wrap gap-3">
                        {wallpapers.map((w) => (
                            <button
                                data-testid={w.id}
                                key={w.id}
                                onClick={() => setWallpaper(w.src)}
                                className={`transform-all max-w-87.5 overflow-hidden rounded-2xl hover:scale-101 ${
                                    wallpaper === w.src
                                        ? "border-3 border-blue-400/80"
                                        : ""
                                }`}
                            >
                                <Image
                                    src={w.src}
                                    alt={w.label}
                                    width={320}
                                    height={180}
                                    loading="lazy"
                                    className="h-48 object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}

"use client";

import {
    getReducedMotionMedia,
    useAccessibilityPreferency,
} from "@/src/hooks/useAccessibilityPreferency";
import { useDesktopStore } from "@/src/store/desktop-store";
import { useTheme } from "next-themes";
import { WallpaperLayer } from "./WallpaperLayer";

export function Wallpaper() {
    const wallpaper = useDesktopStore((s) => s.settings.wallpaper);
    const reduceMotion = useAccessibilityPreferency();
    const { resolvedTheme } = useTheme();

    const theme = resolvedTheme === "dark" ? "dark" : "light";

    const resolvedMedia = wallpaper.variants?.[theme] ?? wallpaper.media;

    const media = reduceMotion
        ? getReducedMotionMedia(resolvedMedia)
        : resolvedMedia;

    return (
        <div className="pointer-events-none fixed inset-0">
            <WallpaperLayer key={media.src + theme} media={media} />
        </div>
    );
}

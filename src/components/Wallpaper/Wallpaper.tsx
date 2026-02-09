"use client";

import {
    getReducedMotionMedia,
    useAccessibilityPreferency,
} from "@/src/hooks/useAccessibilityPreferency";
import { useDesktopStore } from "@/src/store/desktop-store";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { WallpaperLayer } from "./WallpaperLayer";

export function Wallpaper() {
    const wallpaper = useDesktopStore((s) => s.settings.wallpaper);
    const reduceMotion = useAccessibilityPreferency();
    const { resolvedTheme } = useTheme();

    const theme: "light" | "dark" =
        resolvedTheme === "dark" || resolvedTheme === "light"
            ? resolvedTheme
            : "light";

    const [shouldFreeze, setShouldFreeze] = useState(false);
    const [displayTheme, setDisplayTheme] = useState(theme);
    const nextThemeRef = useRef(theme);

    useEffect(() => {
        const onStart = () => setShouldFreeze(true);
        const onEnd = () => setShouldFreeze(false);

        window.addEventListener("theme-transition-start", onStart);
        window.addEventListener("theme-transition-end", onEnd);

        return () => {
            window.removeEventListener("theme-transition-start", onStart);
            window.removeEventListener("theme-transition-end", onEnd);
        };
    }, []);

    useEffect(() => {
        nextThemeRef.current = theme;

        if (!shouldFreeze) {
            setDisplayTheme(theme);
        }
    }, [theme, shouldFreeze]);

    useEffect(() => {
        if (!shouldFreeze) {
            setDisplayTheme(nextThemeRef.current);
        }
    }, [shouldFreeze]);

    const resolvedMedia =
        wallpaper?.variants?.[displayTheme] ?? wallpaper?.media;

    const media = reduceMotion
        ? getReducedMotionMedia(resolvedMedia)
        : resolvedMedia;

    if (!media?.src) return null;

    return (
        <div className="wallpaper pointer-events-none fixed inset-0">
            <WallpaperLayer media={media} />
        </div>
    );
}

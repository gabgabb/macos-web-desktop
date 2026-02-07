import { WallpaperMedia } from "@/src/core/apps/types";
import { useEffect, useState } from "react";

export function useAccessibilityPreferency() {
    const [reduced, setReduced] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        setReduced(mq.matches);

        const handler = () => setReduced(mq.matches);
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);

    return reduced;
}

export function getReducedMotionMedia(
    media: WallpaperMedia | undefined,
): WallpaperMedia | undefined {
    if (!media) return undefined;

    if (media.type === "video") {
        return {
            type: "image",
            src: media.poster ?? media.src,
        };
    }

    return media;
}

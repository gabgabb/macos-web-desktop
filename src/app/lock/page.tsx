"use client";

import { LockScreen } from "@/src/_components/LockScreen";
import { Wallpaper } from "@/src/_components/Wallpaper";
import { useDesktopStore } from "@/src/store/desktop-store";
import { useEffect } from "react";

export default function LockPage() {
    const wallpaper = useDesktopStore((s) => s.settings.wallpaper);
    const hydrate = useDesktopStore((s) => s.hydrate);
    const hydrated = useDesktopStore((s) => s.hydrated);

    useEffect(() => {
        hydrate();
    }, [hydrate]);

    if (!hydrated) {
        return null;
    }

    return (
        <>
            <LockScreen />
            <Wallpaper url={wallpaper} />
        </>
    );
}

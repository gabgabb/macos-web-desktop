"use client";

import { Desktop } from "@/src/_components/Desktop/Desktop";
import { Wallpaper } from "@/src/_components/Wallpaper";
import { useDesktopStore } from "@/src/store/desktop-store";
import { useEffect } from "react";

export default function Home() {
    const hydrate = useDesktopStore((s) => s.hydrate);
    const hydrated = useDesktopStore((s) => s.hydrated);
    const wallpaper = useDesktopStore((s) => s.settings.wallpaper);

    useEffect(() => {
        hydrate();
    }, [hydrate]);

    if (!hydrated) return <div className="h-screen w-screen bg-black" />;

    return (
        <>
            <Desktop />
            <Wallpaper url={wallpaper} />
        </>
    );
}

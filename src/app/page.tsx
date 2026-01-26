"use client";

import { Desktop } from "@/src/_components/Desktop/Desktop";
import { Wallpaper } from "@/src/_components/Wallpaper";
import { useSessionGuard } from "@/src/hooks/useSessionGuard";
import { useDesktopStore } from "@/src/store/desktop-store";

export default function Home() {
    const hydrated = useSessionGuard("unlocked");
    const wallpaper = useDesktopStore((s) => s.settings.wallpaper);

    return (
        <>
            {hydrated && <Desktop />}
            <Wallpaper url={wallpaper} />
        </>
    );
}

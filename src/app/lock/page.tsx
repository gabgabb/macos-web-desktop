"use client";

import { LockScreen } from "@/src/_components/LockScreen";
import { Wallpaper } from "@/src/_components/Wallpaper";
import { useSessionGuard } from "@/src/hooks/useSessionGuard";
import { useDesktopStore } from "@/src/store/desktop-store";

export default function LockPage() {
    const hydrated = useSessionGuard("locked");
    const wallpaper = useDesktopStore((s) => s.settings.wallpaper);

    return (
        <>
            {hydrated && <LockScreen />}
            <Wallpaper url={wallpaper} />
        </>
    );
}

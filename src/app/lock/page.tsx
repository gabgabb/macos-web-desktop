"use client";

import { LockScreen } from "@/src/_components/LockScreen";
import { Wallpaper } from "@/src/_components/Wallpaper";
import { useDesktopStore } from "@/src/store/desktop-store";

export default function LockPage() {
    const wallpaper = useDesktopStore((s) => s.settings.wallpaper);

    return (
        <>
            <LockScreen />
            <Wallpaper url={wallpaper} />
        </>
    );
}

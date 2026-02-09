"use client";

import { LockScreen } from "@/src/components/UI/LockScreen";
import { Wallpaper } from "@/src/components/Wallpaper/Wallpaper";
import { useSessionGuard } from "@/src/hooks/useSessionGuard";

export default function LockPage() {
    const hydrated = useSessionGuard("locked");

    if (!hydrated) return null;

    return (
        <>
            <LockScreen />
            <Wallpaper />
        </>
    );
}

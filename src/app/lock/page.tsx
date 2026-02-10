"use client";

import { AccentSync } from "@/src/components/AccentSync";
import { ThemeSync } from "@/src/components/ThemeSync";
import { LockScreen } from "@/src/components/UI/LockScreen";
import { Wallpaper } from "@/src/components/Wallpaper/Wallpaper";
import { useSessionGuard } from "@/src/hooks/useSessionGuard";
import { ThemeProvider } from "next-themes";

export default function LockPage() {
    const hydrated = useSessionGuard("locked");

    if (!hydrated) return null;

    return (
        <ThemeProvider
            attribute="data-theme"
            defaultTheme="system"
            enableSystem
        >
            <ThemeSync />
            <AccentSync />
            <Wallpaper />
            <LockScreen />
        </ThemeProvider>
    );
}

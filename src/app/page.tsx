"use client";

import { AccentSync } from "@/src/components/AccentSync";
import { Desktop } from "@/src/components/Desktop/Desktop";
import { ThemeSync } from "@/src/components/ThemeSync";
import { Wallpaper } from "@/src/components/Wallpaper/Wallpaper";
import { useSessionGuard } from "@/src/hooks/useSessionGuard";
import { ThemeProvider } from "next-themes";

export default function Home() {
    const hydrated = useSessionGuard("unlocked");

    if (!hydrated) return null;

    console.log("hydrated");

    return (
        <ThemeProvider
            attribute="data-theme"
            defaultTheme="system"
            enableSystem
        >
            <ThemeSync />
            <AccentSync />
            <Wallpaper />
            <Desktop />
        </ThemeProvider>
    );
}

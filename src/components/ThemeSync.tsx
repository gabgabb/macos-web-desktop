"use client";

import { useDesktopStore } from "@/src/store/desktop-store";
import { useTheme } from "next-themes";
import { useEffect } from "react";

export function ThemeSync() {
    const { theme, resolvedTheme } = useTheme();
    const setTheme = useDesktopStore((s) => s.setTheme);

    useEffect(() => {
        if (!theme) return;

        setTheme(theme as "light" | "dark" | "system");
    }, [theme]);

    return null;
}

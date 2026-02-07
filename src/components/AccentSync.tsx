"use client";

import { ACCENTS } from "@/src/core/ui/ui-constants";
import { useDesktopStore } from "@/src/store/desktop-store";
import { useEffect } from "react";

export function AccentSync() {
    const accent = useDesktopStore((s) => s.settings.accentColor);

    useEffect(() => {
        const value = ACCENTS[accent];

        if (!value) return;

        document.documentElement.style.setProperty("--accent", value);
    }, [accent]);

    return null;
}

"use client";

import { useDesktopStore } from "@/src/store/desktop-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useSessionGuard(mode: "locked" | "unlocked") {
    const hydrate = useDesktopStore((s) => s.hydrate);
    const hydrated = useDesktopStore((s) => s.hydrated);
    const isLocked = useDesktopStore((s) => s.isLocked);
    const router = useRouter();

    useEffect(() => {
        hydrate();
    }, [hydrate]);

    useEffect(() => {
        if (!hydrated) return;

        if (mode === "unlocked" && isLocked) {
            router.replace("/lock");
        }

        if (mode === "locked" && !isLocked) {
            router.replace("/");
        }
    }, [hydrated, isLocked, mode, router]);

    return hydrated;
}

"use client";

import { Desktop } from "@/src/_components/Desktop/Desktop";
import { Wallpaper } from "@/src/_components/Wallpaper";
import { useDesktopStore } from "@/src/store/desktop-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
    const hydrate = useDesktopStore((s) => s.hydrate);
    const hydrated = useDesktopStore((s) => s.hydrated);
    const isLocked = useDesktopStore((s) => s.isLocked);
    const wallpaper = useDesktopStore((s) => s.settings.wallpaper);
    const router = useRouter();

    useEffect(() => {
        hydrate();
    }, [hydrate]);

    useEffect(() => {
        if (hydrated && isLocked) {
            router.replace("/lock");
        }
    }, [hydrated, isLocked, router]);

    return (
        <>
            <Desktop />
            <Wallpaper url={wallpaper} />
        </>
    );
}

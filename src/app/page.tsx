"use client";

import { Desktop } from "@/src/_components/Desktop/Desktop";
import { useDesktopStore } from "@/src/store/desktop-store";
import { useEffect } from "react";

export default function Home() {
    const hydrate = useDesktopStore((s) => s.hydrate);
    const hydrated = useDesktopStore((s) => s.hydrated);

    useEffect(() => {
        hydrate();
    }, [hydrate]);

    if (!hydrated) return <div className="h-screen w-screen bg-black" />;

    return <Desktop />;
}

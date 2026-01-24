"use client";

import { useRef } from "react";

export function DoomApp() {
    const iframeRef = useRef<HTMLIFrameElement | null>(null);

    return (
        <iframe
            ref={iframeRef}
            src="/doom/index.html"
            title="Doom"
            className="h-full w-full border-0 bg-black"
            allow="autoplay; fullscreen"
        />
    );
}

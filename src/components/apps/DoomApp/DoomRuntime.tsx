"use client";

import { useEffect, useRef } from "react";

export function DoomRuntime({
    wad,
    onExit,
}: {
    wad: string;
    onExit: () => void;
}) {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        const iframe = iframeRef.current;
        if (!iframe) return;

        iframe.onload = () => {
            iframe.contentWindow?.focus();
        };

        return () => {
            iframe.remove();
        };
    }, []);

    return (
        <div
            data-testid="doom-runtime"
            className="relative h-full w-full bg-black"
        >
            <iframe
                data-testid="doom-iframe"
                src={`/doom/index.html?wad=${wad}`}
                className="h-full w-full border-0"
                allow="autoplay; fullscreen; gamepad;"
                sandbox="allow-scripts allow-same-origin allow-pointer-lock"
            />

            <button
                data-testid="doom-quit"
                onClick={onExit}
                className="absolute top-4 right-4 z-10 rounded bg-black/70 px-3 py-1 text-sm text-white hover:bg-red-600"
            >
                Quit
            </button>
        </div>
    );
}

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
        return () => {
            iframeRef.current?.remove();
        };
    }, []);

    return (
        <div className="relative h-full w-full bg-black">
            <iframe
                src={`/doom/index.html?wad=${wad}`}
                className="h-full w-full border-0"
                allow="autoplay; fullscreen"
            />

            <button
                onClick={onExit}
                className="absolute top-4 right-4 z-10 rounded bg-black/70 px-3 py-1 text-sm text-white hover:bg-red-600"
            >
                Quit
            </button>
        </div>
    );
}

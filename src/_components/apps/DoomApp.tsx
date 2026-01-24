"use client";

export function DoomApp() {
    return (
        <iframe
            src="/doom/index.html"
            title="Doom"
            className="h-full w-full border-0 bg-black"
            allow="autoplay; fullscreen"
        />
    );
}

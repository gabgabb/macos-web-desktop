"use client";

import { useDesktopStore } from "@/src/store/desktop-store";

export function AboutApp() {
    const reset = useDesktopStore((s) => s.reset);

    return (
        <div className="h-full w-full">
            <button
                onClick={reset}
                className="mt-4 rounded-xl bg-white/20 px-4 py-2 transition hover:bg-white/30"
            >
                Reset saved layout
            </button>
        </div>
    );
}

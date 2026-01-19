"use client";

import { useDesktopStore } from "@/src/store/desktop-store";

export function LockScreen() {
    const unlock = useDesktopStore((s) => s.unlock);
    const skipLock = useDesktopStore((s) => s.skipLock);

    const time = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <div className="absolute inset-0 z-[10000] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-xl" />

            <div className="relative w-[360px] rounded-3xl border border-white/10 bg-white/10 p-6 text-center text-white shadow-2xl">
                <div className="text-5xl font-semibold">{time}</div>
                <div className="mt-2 text-sm opacity-80">Locked (optional)</div>

                <div className="mt-6 flex flex-col gap-2">
                    <button
                        onClick={unlock}
                        className="rounded-xl bg-white/20 px-4 py-2 transition hover:bg-white/30"
                    >
                        Unlock
                    </button>

                    <button
                        onClick={skipLock}
                        className="rounded-xl bg-transparent px-4 py-2 text-sm opacity-90 transition hover:bg-white/10"
                    >
                        Continue without unlocking
                    </button>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useDesktopStore } from "@/src/store/desktop-store";

export function AudioPanel({ onClose }: { onClose: () => void }) {
    const setMasterVolume = useDesktopStore((s) => s.setMasterVolume);
    const audio = useDesktopStore((s) => s.audio);

    return (
        <>
            <div className="fixed inset-0 z-40" onMouseDown={onClose} />

            <div
                className="fixed top-10 right-4 z-50 mt-2 w-56 rounded-xl border border-black/10 bg-white/10 p-4 shadow-2xl backdrop-blur-md"
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="mb-3 text-sm font-semibold text-white">
                    Sound
                </div>

                <input
                    type="range"
                    id={"masterVolume"}
                    min={0}
                    max={1}
                    step={0.01}
                    value={audio.masterVolume}
                    onChange={(e) => setMasterVolume(Number(e.target.value))}
                    className="bg-neutral-quaternary h-2 w-full cursor-pointer rounded-full accent-blue-400"
                />
            </div>
        </>
    );
}

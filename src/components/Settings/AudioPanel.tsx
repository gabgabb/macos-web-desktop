"use client";

import { useDesktopStore } from "@/src/store/desktop-store";
import { motion } from "framer-motion";

export function AudioPanel({ onCloseAction }: { onCloseAction: () => void }) {
    const setMasterVolume = useDesktopStore((s) => s.setMasterVolume);
    const audio = useDesktopStore((s) => s.audio);

    return (
        <>
            <div className="fixed inset-0 z-40" onMouseDown={onCloseAction} />

            <motion.div
                initial={{ opacity: 0, scale: 0.96, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -10 }}
                transition={{ duration: 0.15 }}
                className="fixed top-10 right-4 z-50 mt-2 w-56 rounded-xl border border-(--dock-border) bg-(--dock-bg) p-4 text-(--text-primary) shadow-2xl backdrop-blur-md"
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="text-md mb-3 font-semibold">Sound</div>

                <input
                    type="range"
                    id={"masterVolume"}
                    min={0}
                    max={1}
                    step={0.01}
                    value={audio.masterVolume}
                    onChange={(e) => setMasterVolume(Number(e.target.value))}
                    className="bg-neutral-quaternary h-2 w-full cursor-pointer rounded-full accent-[rgb(var(--accent))]"
                />
            </motion.div>
        </>
    );
}

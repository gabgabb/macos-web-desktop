"use client";

import type { DockApp } from "@/src/core/types";
import { useDesktopStore } from "@/src/store/desktop-store";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

const DOCK_APPS: DockApp[] = [
    { id: "finder", title: "Finder", icon: "🗂️" },
    { id: "notes", title: "Notes", icon: "📝" },
    { id: "about", title: "About", icon: "ℹ️" },
];

export function Dock() {
    const openApp = useDesktopStore((s) => s.openApp);
    const windows = useDesktopStore((s) => s.windows);

    const [bouncing, setBouncing] = useState<string | null>(null);

    const openAppIds = useMemo(
        () => new Set(windows.map((w) => w.appId)),
        [windows],
    );

    return (
        <div className="dock absolute bottom-5 left-1/2 z-[9998] -translate-x-1/2 rounded-3xl border border-white/10 bg-white/10 px-4 py-2 shadow-lg backdrop-blur-md">
            <div className="flex items-end gap-3">
                {DOCK_APPS.map((app) => {
                    const isOpen = openAppIds.has(app.id);

                    return (
                        <button
                            key={app.id}
                            onClick={() => {
                                openApp(app.id);
                                setBouncing(app.id);
                                window.setTimeout(() => {
                                    setBouncing((v) =>
                                        v === app.id ? null : v,
                                    );
                                }, 450);
                            }}
                            className="flex w-16 flex-col items-center justify-end select-none"
                            title={app.title}
                        >
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl transition">
                                <motion.div
                                    className="text-4xl transition-all hover:mb-2 hover:scale-120"
                                    animate={
                                        bouncing === app.id
                                            ? { y: [0, -10, 0, -6, 0] }
                                            : { y: 0 }
                                    }
                                    transition={{ duration: 0.45 }}
                                >
                                    {app.icon}
                                </motion.div>
                            </div>

                            <div className="mt-1 flex h-1 items-center justify-center">
                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            key="dot"
                                            initial={{
                                                opacity: 0,
                                                scale: 0.6,
                                                y: -2,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                scale: 1,
                                                y: 0,
                                            }}
                                            exit={{
                                                opacity: 0,
                                                scale: 0.6,
                                                y: -2,
                                            }}
                                            transition={{ duration: 0.15 }}
                                            className="h-1.5 w-1.5 rounded-full bg-white/80"
                                        />
                                    )}
                                </AnimatePresence>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

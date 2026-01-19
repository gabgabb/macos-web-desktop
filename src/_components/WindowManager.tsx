"use client";

import { AboutApp } from "@/src/_components/apps/AboutApp";
import { FinderApp } from "@/src/_components/apps/FinderApp";
import { NotesApp } from "@/src/_components/apps/NotesApp";

import { MacWindow } from "@/src/_components/MacWindow";
import { useDesktopStore } from "@/src/store/desktop-store";
import { AnimatePresence } from "framer-motion";
import { useMemo } from "react";

export function WindowManager() {
    const windows = useDesktopStore((s) => s.windows);

    const visibleWindows = useMemo(
        () => windows.filter((w) => !w.isMinimized),
        [windows],
    );

    return (
        <div className="absolute inset-0">
            <AnimatePresence>
                {visibleWindows.map((w) => (
                    <MacWindow key={w.windowId} win={w}>
                        {w.appId === "notes" && <NotesApp />}
                        {w.appId === "finder" && <FinderApp />}
                        {w.appId === "about" && <AboutApp />}
                    </MacWindow>
                ))}
            </AnimatePresence>
        </div>
    );
}

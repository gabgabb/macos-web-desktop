"use client";

import { MacWindow } from "@/src/components/Desktop/MacWindow";
import { APP_COMPONENTS } from "@/src/core/apps/app-components";
import { APP_REGISTRY } from "@/src/core/apps/registry";
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
                {visibleWindows.map((w) => {
                    const AppComponent = APP_COMPONENTS[w.appId];
                    const appDef = APP_REGISTRY[w.appId];

                    if (!AppComponent || !appDef) return null;

                    return (
                        <MacWindow key={w.windowId} win={w} appDef={appDef}>
                            <AppComponent windowId={w.windowId} />
                        </MacWindow>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}

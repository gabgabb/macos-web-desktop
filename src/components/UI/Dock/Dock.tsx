"use client";

import { DockIconButton } from "@/src/components/UI/Dock/DockIconButton";
import { AppDefinition } from "@/src/core/apps/types";
import { useSystemApps } from "@/src/hooks/useSystemApps";
import { useDesktopStore } from "@/src/store/desktop-store";
import { motion, useMotionValue } from "framer-motion";
import { useMemo, useRef, useState } from "react";

export function Dock() {
    const openApp = useDesktopStore((s) => s.openApp);
    const closeWindow = useDesktopStore((s) => s.closeWindow);

    const windows = useDesktopStore((s) => s.windows);

    const apps = useSystemApps();
    const dockApps = apps.filter((a) => a.showInDock);

    const [bouncing, setBouncing] = useState<string | null>(null);
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    const openAppIds = useMemo(
        () => new Set(windows.map((w) => w.appId)),
        [windows],
    );

    const mouseX = useMotionValue(Infinity);
    const dockRef = useRef<HTMLDivElement | null>(null);

    if (!dockApps.length) {
        return (
            <div className="absolute bottom-5 left-1/2 h-20 w-64 -translate-x-1/2" />
        );
    }

    function onClickDockIcon(app: AppDefinition) {
        const win = windows.find((w) => w.appId === app.id);

        if (win?.isMinimized) {
            openApp(app.id);
            return;
        }

        if (win) {
            closeWindow(win.windowId);
            return;
        }

        openApp(app.id);
        setBouncing(app.id);
        window.setTimeout(() => setBouncing(null), 450);
    }

    return (
        <motion.div
            ref={dockRef}
            className="dock absolute bottom-5 left-1/2 z-9998 -translate-x-1/2 rounded-3xl border border-(--dock-border) bg-(--dock-bg) px-4 py-2 shadow-(--dock-shadow) backdrop-blur-md"
            onMouseMove={(e) => {
                mouseX.set(e.clientX);
            }}
            onMouseLeave={() => {
                mouseX.set(Infinity);
            }}
            initial={false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
        >
            <div data-testid="dock" className="flex items-end">
                {dockApps.map((app) => {
                    const isOpen = openAppIds.has(app.id);
                    return (
                        <DockIconButton
                            key={app.id}
                            app={app}
                            isOpen={isOpen}
                            bouncing={bouncing === app.id}
                            hovered={hoveredId === app.id}
                            onHover={(isHover) =>
                                setHoveredId(isHover ? app.id : null)
                            }
                            onClick={() => onClickDockIcon(app)}
                        />
                    );
                })}
            </div>
        </motion.div>
    );
}

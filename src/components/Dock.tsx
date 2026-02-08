"use client";

import { APP_ICONS } from "@/src/core/apps/icon-map";
import { AppDefinition } from "@/src/core/apps/types";
import { useSystemApps } from "@/src/hooks/useSystemApps";
import { useDesktopStore } from "@/src/store/desktop-store";
import { AnimatePresence, motion, useMotionValue } from "framer-motion";
import Image from "next/image";
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
                            onClick={() => {
                                const minimized = windows.find(
                                    (w) => w.appId === app.id && w.isMinimized,
                                );

                                if (minimized) {
                                    openApp(app.id);
                                    return;
                                }

                                if (openAppIds.has(app.id)) {
                                    closeWindow(app.id);
                                    return;
                                }

                                openApp(app.id);
                                setBouncing(app.id);
                                window.setTimeout(() => setBouncing(null), 450);
                            }}
                        />
                    );
                })}
            </div>
        </motion.div>
    );
}

function DockIconButton({
    app,
    isOpen,
    bouncing,
    onHover,
    hovered,
    onClick,
    datatestid = app.id,
}: {
    app: AppDefinition;
    isOpen: boolean;
    bouncing: boolean;
    hovered: boolean;
    onHover: (v: boolean) => void;
    onClick: () => void;
    datatestid?: string;
}) {
    const icon = APP_ICONS[app.icon];
    return (
        <button
            data-testid={`dock-${datatestid}`}
            onMouseEnter={() => onHover(true)}
            onMouseLeave={() => onHover(false)}
            onClick={onClick}
            className="flex w-19 flex-col items-center justify-end select-none"
            title={app.title}
        >
            <div className="relative flex h-14 w-14 items-center justify-center">
                <motion.div
                    animate={{
                        scale: hovered ? 1.18 : 1,
                        y: hovered ? -6 : 0,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 420,
                        damping: 26,
                        mass: 0.5,
                    }}
                >
                    <motion.div
                        animate={
                            bouncing ? { y: [0, -12, 0, -7, 0] } : { y: 0 }
                        }
                        transition={{ duration: 0.45 }}
                    >
                        {typeof icon === "string" ? (
                            <Image
                                src={icon}
                                alt={app.title}
                                width={56}
                                height={56}
                                loading="eager"
                                className="pointer-events-none drop-shadow-md select-none"
                            />
                        ) : (
                            <div className="size-12">{icon}</div>
                        )}
                    </motion.div>
                </motion.div>
            </div>

            <div
                data-testid={`dock-${datatestid}-active`}
                className="mt-1 flex h-2 items-center justify-center"
            >
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            key="dot"
                            initial={{ opacity: 0, scale: 0.6, y: -2 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.6, y: -2 }}
                            transition={{ duration: 0.15 }}
                            className="h-1.5 w-1.5 rounded-full bg-white/80"
                        />
                    )}
                </AnimatePresence>
            </div>
        </button>
    );
}

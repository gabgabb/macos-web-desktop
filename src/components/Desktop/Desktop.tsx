"use client";

import { DesktopContextMenu } from "@/src/components/Desktop/DesktopContextMenu";
import { DesktopIcons } from "@/src/components/Desktop/DesktopIcons";
import { WindowManager } from "@/src/components/Desktop/WindowManager";
import { AppearancePanel } from "@/src/components/Settings/AppearancePanel";
import { AudioPanel } from "@/src/components/Settings/AudioPanel";
import { WifiPanel } from "@/src/components/Settings/WifiPanel";
import { Dock } from "@/src/components/UI/Dock/Dock";
import { MenuBar } from "@/src/components/UI/MenuBar";
import { DOCK_RESERVED, MENU_BAR_HEIGHT } from "@/src/core/ui/ui-constants";
import { useDesktopStore } from "@/src/store/desktop-store";
import { AnimatePresence } from "framer-motion";
import React, { useCallback, useState } from "react";

export function Desktop() {
    const [ctx, setCtx] = useState<{ open: boolean; x: number; y: number }>({
        open: false,
        x: 0,
        y: 0,
    });
    const reset = useDesktopStore((s) => s.reset);
    const openApp = useDesktopStore((s) => s.openApp);
    const activePanel = useDesktopStore((s) => s.ui.activePanel);
    const togglePanel = useDesktopStore((s) => s.togglePanel);

    const closeCtx = useCallback(() => {
        setCtx((s) => ({ ...s, open: false }));
    }, []);

    const audioPanelOpen = activePanel === "audio";
    const wifiPanelOpen = activePanel === "wifi";
    const appearancePanelOpen = activePanel === "appearance";

    return (
        <main
            style={
                {
                    "--menu-bar-height": `${MENU_BAR_HEIGHT}px`,
                    "--dock-height": `${DOCK_RESERVED}px`,
                } as React.CSSProperties
            }
            data-testid="desktop"
            className="relative h-screen w-screen overflow-hidden text-white"
            onContextMenu={(e) => {
                e.preventDefault();
                const target = e.target as HTMLElement;
                if (
                    target.closest(".mac-window") ||
                    target.closest(".dock") ||
                    target.closest(".lock-screen") ||
                    target.closest(".desktop-icons")
                )
                    return;
                setCtx({ open: true, x: e.clientX, y: e.clientY });
            }}
            onMouseDown={() => {
                if (ctx.open) closeCtx();
            }}
        >
            <MenuBar />
            <AnimatePresence>
                {wifiPanelOpen && (
                    <WifiPanel onCloseAction={() => togglePanel("wifi")} />
                )}
                {audioPanelOpen && (
                    <AudioPanel onCloseAction={() => togglePanel("audio")} />
                )}
                {appearancePanelOpen && (
                    <AppearancePanel
                        onCloseAction={() => togglePanel("appearance")}
                    />
                )}
            </AnimatePresence>

            <DesktopIcons />

            <div className="absolute inset-x-0 top-(--menu-bar-height) bottom-(--dock-height)">
                <WindowManager />
            </div>
            <Dock />

            <DesktopContextMenu
                open={ctx.open}
                x={ctx.x}
                y={ctx.y}
                onClose={closeCtx}
                onAction={(id) => {
                    if (id === "refresh") reset();
                    if (id === "wallpaper") openApp("settings");
                }}
            />
        </main>
    );
}

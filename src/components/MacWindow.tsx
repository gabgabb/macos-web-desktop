"use client";

import { AppDefinition, WindowInstance } from "@/src/core/apps/types";
import { DOCK_RESERVED, MENU_BAR_HEIGHT } from "@/src/core/ui/ui-constants";
import { useDesktopStore } from "@/src/store/desktop-store";
import { motion } from "framer-motion";
import React from "react";
import { Rnd } from "react-rnd";

export function MacWindow({
    win,
    children,
    appDef,
}: {
    win: WindowInstance;
    children: React.ReactNode;
    appDef: AppDefinition;
}) {
    const closeWindow = useDesktopStore((s) => s.closeWindow);
    const focusWindow = useDesktopStore((s) => s.focusWindow);
    const setWindowRect = useDesktopStore((s) => s.setWindowRect);

    const minimizeWindow = useDesktopStore((s) => s.minimizeWindow);
    const toggleFullscreen = useDesktopStore((s) => s.toggleFullscreen);

    const isFullscreen = win.isFullscreen;

    return (
        <Rnd
            data-testid={`window-${win.appId}`}
            size={
                isFullscreen
                    ? {
                          width: window.innerWidth,
                          height:
                              window.innerHeight -
                              MENU_BAR_HEIGHT -
                              DOCK_RESERVED,
                      }
                    : { width: win.width, height: win.height }
            }
            position={{ x: win.x, y: win.y }}
            onDragStart={() => focusWindow(win.windowId)}
            onResizeStart={() => focusWindow(win.windowId)}
            onMouseDown={() => focusWindow(win.windowId)}
            onDragStop={(_, data) => {
                setWindowRect(win.windowId, {
                    x: data.x,
                    y: data.y,
                    width: win.width,
                    height: win.height,
                });
            }}
            onResizeStop={(_, __, ref, ___, position) => {
                setWindowRect(win.windowId, {
                    x: position.x,
                    y: position.y,
                    width: ref.offsetWidth,
                    height: ref.offsetHeight,
                });
            }}
            enableResizing={!isFullscreen && appDef.window.resizable}
            disableDragging={isFullscreen}
            minWidth={appDef.window.minSize?.w || 690}
            minHeight={appDef.window.minSize?.h || 480}
            bounds="parent"
            dragHandleClassName="mac-window-header"
            style={{ zIndex: win.zIndex }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 10 }}
                transition={{ duration: 0.15 }}
                className="mac-window h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-white/10 shadow-2xl backdrop-blur-md"
            >
                <div
                    data-testid={`window-${win.appId}-header`}
                    className={`mac-window-header flex h-10 items-center justify-between border-b border-white/10 bg-[rgb(var(--accent))]/80 px-3 transition-all select-none ${isFullscreen ? "" : "hover:cursor-grab active:cursor-grabbing"}`}
                >
                    <div className="flex items-center gap-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                closeWindow(win.windowId);
                            }}
                            className="h-3 w-3 rounded-full bg-red-500/90"
                            title="Close"
                        />
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                minimizeWindow(win.windowId);
                            }}
                            className="h-3 w-3 rounded-full bg-yellow-500/90"
                            title="Minimize"
                        />
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleFullscreen(win.windowId);
                            }}
                            className="h-3 w-3 rounded-full bg-green-500/90"
                            title="Fullscreen"
                        />
                    </div>

                    <div className="text-m font-semibold">{win.title}</div>
                    <div className="w-10" />
                </div>

                <div
                    className={`h-[calc(100%-40px)] ${appDef.window.withPadding ? "p-3" : ""}`}
                >
                    {children}
                </div>
            </motion.div>
        </Rnd>
    );
}

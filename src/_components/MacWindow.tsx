"use client";

import { WindowInstance } from "@/src/core/types";
import { useDesktopStore } from "@/src/store/desktop-store";
import { motion } from "framer-motion";
import React from "react";
import { Rnd } from "react-rnd";

export function MacWindow({
    win,
    children,
}: {
    win: WindowInstance;
    children: React.ReactNode;
}) {
    const closeWindow = useDesktopStore((s) => s.closeWindow);
    const focusWindow = useDesktopStore((s) => s.focusWindow);
    const setWindowRect = useDesktopStore((s) => s.setWindowRect);

    const minimizeWindow = useDesktopStore((s) => s.minimizeWindow);
    const toggleFullscreen = useDesktopStore((s) => s.toggleFullscreen);

    return (
        <Rnd
            size={{ width: win.width, height: win.height }}
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
            minWidth={360}
            minHeight={240}
            bounds="window"
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
                {/* Header */}
                <div className="mac-window-header flex h-10 items-center justify-between border-b border-white/10 px-3 select-none">
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

                    <div className="text-sm opacity-90">{win.title}</div>
                    <div className="w-10" />
                </div>

                {/* Content */}
                <div className="h-[calc(100%-40px)] p-4">{children}</div>
            </motion.div>
        </Rnd>
    );
}

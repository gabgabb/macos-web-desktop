"use client";

import { DesktopContextMenu } from "@/src/_components/Desktop/DesktopContextMenu";
import { DesktopIcons } from "@/src/_components/Desktop/DesktopIcons";
import { Dock } from "@/src/_components/Dock";
import { LockScreen } from "@/src/_components/LockScreen";
import { MenuBar } from "@/src/_components/MenuBar";
import { WindowManager } from "@/src/_components/WindowManager";
import { useDesktopStore } from "@/src/store/desktop-store";
import { useCallback, useState } from "react";

export function Desktop() {
    const isLocked = useDesktopStore((s) => s.isLocked);

    const [ctx, setCtx] = useState<{ open: boolean; x: number; y: number }>({
        open: false,
        x: 0,
        y: 0,
    });

    const closeCtx = useCallback(
        () => setCtx((s) => ({ ...s, open: false })),
        [],
    );

    return (
        <main
            className="relative h-screen w-screen overflow-hidden text-white"
            style={{
                backgroundImage: "url('/Big-Sur-Color-Day.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
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
            <DesktopIcons />
            <WindowManager />
            <Dock />

            <DesktopContextMenu
                open={ctx.open}
                x={ctx.x}
                y={ctx.y}
                onClose={closeCtx}
                onAction={(id) => {
                    if (id === "refresh") window.location.reload();
                }}
            />

            {isLocked && <LockScreen />}
        </main>
    );
}

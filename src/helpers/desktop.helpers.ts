import { WindowInstance } from "@/src/core/apps/types";

export type Rect = {
    x: number;
    y: number;
    width: number;
    height: number;
};

export function updateWindow(
    windows: WindowInstance[],
    windowId: string,
    patch: Partial<WindowInstance>,
) {
    return windows.map((w) =>
        w.windowId === windowId ? { ...w, ...patch } : w,
    );
}

export function bringToFront(
    windows: WindowInstance[],
    topZ: number,
    windowId: string,
) {
    const z = topZ + 1;
    return {
        windows: updateWindow(windows, windowId, { zIndex: z }),
        topZ: z,
        activeWindowId: windowId,
    };
}

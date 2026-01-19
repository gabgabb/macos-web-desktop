import { loadSnapshot, saveSnapshot } from "@/src/core/persist";
import type { AppId, DesktopSnapshot, WindowInstance } from "@/src/core/types";
import { create } from "zustand";

const randId = () => Math.random().toString(16).slice(2);

const DEFAULT_STATE: DesktopSnapshot = {
    windows: [],
    activeWindowId: null,
    topZ: 10,
    isLocked: true,
};

type DesktopState = DesktopSnapshot & {
    hydrated: boolean;
    hydrate: () => void;

    openApp: (appId: AppId) => void;
    closeWindow: (windowId: string) => void;

    focusWindow: (windowId: string) => void;
    setWindowRect: (
        windowId: string,
        rect: { x: number; y: number; width: number; height: number },
    ) => void;

    minimizeWindow: (windowId: string) => void;
    toggleFullscreen: (windowId: string) => void;

    unlock: () => void;

    reset: () => void;
};

function persist(get: () => DesktopState) {
    const { windows, activeWindowId, topZ, isLocked } = get();
    saveSnapshot({ windows, activeWindowId, topZ, isLocked });
}

export const useDesktopStore = create<DesktopState>((set, get) => ({
    ...DEFAULT_STATE,
    hydrated: false,

    hydrate: () => {
        const snap = loadSnapshot();
        if (!snap) {
            set({ hydrated: true });
            return;
        }
        set({ ...snap, hydrated: true });
    },

    openApp: (appId) => {
        const { windows, topZ } = get();

        const existing = windows.find((w) => w.appId === appId);
        if (existing) {
            set((state) => ({
                windows: state.windows.map((w) =>
                    w.windowId === existing.windowId
                        ? { ...w, isMinimized: false }
                        : w,
                ),
            }));

            get().focusWindow(existing.windowId);
            persist(get);
            return;
        }

        const titleMap: Record<AppId, string> = {
            finder: "Finder",
            notes: "Notes",
            about: "About",
        };

        const newZ = topZ + 1;

        const win: WindowInstance = {
            windowId: randId(),
            appId,
            title: titleMap[appId],

            x: 90 + windows.length * 18,
            y: 80 + windows.length * 18,
            width: appId === "finder" ? 640 : 520,
            height: appId === "notes" ? 380 : 360,

            isMinimized: false,
            zIndex: newZ,
            isFullscreen: false,
            restoreRect: undefined,
        };

        set({
            windows: [...windows, win],
            activeWindowId: win.windowId,
            topZ: newZ,
        });

        persist(get);
    },

    closeWindow: (windowId) => {
        set((state) => ({
            windows: state.windows.filter((w) => w.windowId !== windowId),
            activeWindowId:
                state.activeWindowId === windowId ? null : state.activeWindowId,
        }));
        persist(get);
    },

    focusWindow: (windowId) => {
        const { windows, topZ } = get();
        const newZ = topZ + 1;

        set({
            windows: windows.map((w) =>
                w.windowId === windowId ? { ...w, zIndex: newZ } : w,
            ),
            activeWindowId: windowId,
            topZ: newZ,
        });

        persist(get);
    },

    setWindowRect: (windowId, rect) => {
        set((state) => ({
            windows: state.windows.map((w) =>
                w.windowId === windowId ? { ...w, ...rect } : w,
            ),
        }));
        persist(get);
    },

    reset: () => {
        set({ ...DEFAULT_STATE });
        saveSnapshot(DEFAULT_STATE);
    },

    minimizeWindow: (windowId) => {
        set((state) => ({
            windows: state.windows.map((w) =>
                w.windowId === windowId
                    ? { ...w, isMinimized: !w.isMinimized }
                    : w,
            ),
            activeWindowId:
                state.activeWindowId === windowId ? null : state.activeWindowId,
        }));
        persist(get);
    },

    toggleFullscreen: (windowId) => {
        const { windows, topZ } = get();
        const newZ = topZ + 1;

        const target = windows.find((w) => w.windowId === windowId);
        if (!target) return;

        if (!target.isFullscreen) {
            set((state) => ({
                windows: state.windows.map((w) =>
                    w.windowId === windowId
                        ? {
                              ...w,
                              isFullscreen: true,
                              restoreRect: {
                                  x: w.x,
                                  y: w.y,
                                  width: w.width,
                                  height: w.height,
                              },
                              x: 0,
                              y: 40,
                              width: window.innerWidth,
                              height: window.innerHeight - 40,
                              zIndex: newZ,
                          }
                        : w,
                ),
                activeWindowId: windowId,
                topZ: newZ,
            }));
        } else {
            // exit fullscreen
            set((state) => ({
                windows: state.windows.map((w) => {
                    if (w.windowId !== windowId) return w;
                    const r = w.restoreRect;
                    return {
                        ...w,
                        isFullscreen: false,
                        restoreRect: undefined,
                        x: r?.x ?? 120,
                        y: r?.y ?? 80,
                        width: r?.width ?? 520,
                        height: r?.height ?? 360,
                        zIndex: newZ,
                    };
                }),
                activeWindowId: windowId,
                topZ: newZ,
            }));
        }

        persist(get);
    },

    unlock: () => {
        set({ isLocked: false });
        persist(get);
    },
}));

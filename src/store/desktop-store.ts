import { loadSnapshot, saveSnapshot } from "@/src/core/persist";
import type { AppId, DesktopSnapshot, WindowInstance } from "@/src/core/types";
import { create } from "zustand";

const randId = () => Math.random().toString(16).slice(2);

const DEFAULT_STATE: DesktopSnapshot = {
    windows: [],
    activeWindowId: null,
    topZ: 10,
    isLocked: true,
    notes: { content: "" },
    terminal: { content: "" },
    settings: {
        theme: "auto",
        wallpaper: "/Wallpaper/Big-Sur-Color-Day.webp",
    },
};

type DesktopState = DesktopSnapshot & {
    hydrated: boolean;
    hydrate: () => void;

    openApp: (appId: AppId) => void;
    closeApp: (appId: AppId) => void;
    isAppOpen: (appId: AppId) => boolean;

    closeWindow: (windowId: string) => void;

    focusWindow: (windowId: string) => void;
    setWindowRect: (
        windowId: string,
        rect: { x: number; y: number; width: number; height: number },
    ) => void;

    minimizeWindow: (windowId: string) => void;
    toggleFullscreen: (windowId: string) => void;

    lock: () => void;
    unlock: () => void;

    setNotes: (content: string) => void;
    setTerminal: (content: string) => void;

    setWallpaper: (url: string) => void;
    setTheme: (theme: "auto" | "dark" | "light") => void;

    reset: () => void;
};

function persist(get: () => DesktopState) {
    const {
        windows,
        activeWindowId,
        topZ,
        isLocked,
        notes,
        terminal,
        settings,
    } = get();
    saveSnapshot({
        windows,
        activeWindowId,
        topZ,
        isLocked,
        notes,
        terminal,
        settings,
    });
}

export const useDesktopStore = create<DesktopState>((set, get) => ({
    ...DEFAULT_STATE,
    hydrated: false,
    notes: DEFAULT_STATE.notes,
    terminal: DEFAULT_STATE.terminal,
    settings: DEFAULT_STATE.settings,

    hydrate: () => {
        const snap = loadSnapshot();
        if (!snap) {
            set({ hydrated: true });
            return;
        }

        set({
            ...DEFAULT_STATE,
            ...snap,
            notes: snap.notes ?? DEFAULT_STATE.notes,
            terminal: snap.terminal ?? DEFAULT_STATE.terminal,
            hydrated: true,
        });
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
            settings: "Settings",
            terminal: "Terminal",
            safari: "Safari",
        };

        const newZ = topZ + 1;

        const win: WindowInstance = {
            windowId: randId(),
            appId,
            title: titleMap[appId],

            x: 90 + windows.length * 18,
            y: 80 + windows.length * 18,

            width:
                appId === "safari" || appId === "settings"
                    ? 920
                    : appId === "terminal"
                      ? 720
                      : appId === "finder"
                        ? 640
                        : 520,

            height:
                appId === "safari" || appId === "settings"
                    ? 620
                    : appId === "terminal"
                      ? 420
                      : appId === "notes"
                        ? 380
                        : 360,

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

    closeApp: (appId) => {
        set((state) => ({
            windows: state.windows.filter((w) => w.appId !== appId),
            activeWindowId:
                state.activeWindowId &&
                state.windows.some(
                    (w) =>
                        w.windowId === state.activeWindowId &&
                        w.appId !== appId,
                )
                    ? state.activeWindowId
                    : null,
        }));
    },

    isAppOpen: (appId) => get().windows.some((w) => w.appId === appId),

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

    setNotes: (content) => {
        set((state) => ({
            notes: {
                ...state.notes,
                content,
            },
        }));

        persist(get);
    },

    setTerminal: (content) => {
        set(() => ({
            terminal: { content },
        }));

        persist(get);
    },

    setWallpaper: (wallpaper: string) => {
        set((state) => ({
            settings: { ...state.settings, wallpaper },
        }));
        persist(get);
    },

    setTheme: (theme: "light" | "dark" | "auto") => {
        set((state) => ({
            settings: { ...state.settings, theme },
        }));
        persist(get);
    },

    lock: () => {
        set({ isLocked: true });
        persist(get);
    },

    unlock: () => {
        set({ isLocked: false });
        persist(get);
    },
}));

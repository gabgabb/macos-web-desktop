import { APP_REGISTRY } from "@/src/core/apps/registry";
import { Conversation, CONVERSATIONS } from "@/src/core/chatData";
import { FS } from "@/src/core/fs/fs.service";
import { loadSnapshot, saveSnapshot } from "@/src/core/persist";
import type {
    AppId,
    DesktopSnapshot,
    TerminalLine,
    WindowInstance,
} from "@/src/core/types";
import { create } from "zustand";

const randId = () => Math.random().toString(16).slice(2);

const DEFAULT_STATE: DesktopSnapshot = {
    windows: [],
    activeWindowId: null,
    topZ: 10,
    notes: { content: "" },
    terminal: { lines: [] },
    settings: {
        theme: "auto",
        wallpaper: "/Wallpaper/Big-Sur-Color-Day.webp",
    },
    audio: {
        masterVolume: 1,
        muted: false,
        appVolumes: {},
    },
    ui: {
        audioPanelOpen: false,
        wifiPanelOpen: false,
    },
    progress: {
        slackIntroPlayed: false,
    },
    slack: {
        conversations: CONVERSATIONS,
        typing: null,
    },
};

type DesktopState = DesktopSnapshot & {
    hydrated: boolean;
    hydrate: () => void;
    isLocked: boolean;

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
    setTerminal: (lines: TerminalLine[]) => void;

    cwd: string[];
    refreshFs: () => void;

    setWallpaper: (url: string) => void;
    setTheme: (theme: "auto" | "dark" | "light") => void;

    setMasterVolume: (v: number) => void;
    toggleMute: () => void;
    setAppVolume: (appId: AppId, v: number) => void;

    toggleAudioPanel: () => void;
    closeAudioPanel: () => void;

    toggleWifiPanel: () => void;
    closeWifiPanel: () => void;

    markSlackIntroPlayed: () => void;
    setSlackConversations: (
        updater: (prev: Conversation[]) => Conversation[],
    ) => void;

    startTyping: (conversationId: string, authorId: string) => void;
    stopTyping: () => void;

    reset: () => void;
};

function persist(get: () => DesktopState) {
    const {
        windows,
        activeWindowId,
        topZ,
        notes,
        terminal,
        settings,
        audio,
        ui,
        progress,
        slack,
    } = get();
    saveSnapshot({
        windows,
        activeWindowId,
        topZ,
        notes,
        terminal,
        settings,
        audio,
        ui,
        progress,
        slack,
    });
}

export const useDesktopStore = create<DesktopState>((set, get) => ({
    ...DEFAULT_STATE,
    isLocked: true,
    hydrated: false,
    notes: DEFAULT_STATE.notes,
    terminal: DEFAULT_STATE.terminal,
    cwd: FS.getCwd(),
    settings: DEFAULT_STATE.settings,
    audio: DEFAULT_STATE.audio,
    progress: DEFAULT_STATE.progress,
    slack: DEFAULT_STATE.slack,

    hydrate: async () => {
        const snap = loadSnapshot();

        let unlocked = false;
        try {
            const res = await fetch("/api/session");
            const data = await res.json();
            unlocked = !!data.unlocked;
        } catch {}

        set({
            ...DEFAULT_STATE,
            ...snap,
            notes: snap?.notes ?? DEFAULT_STATE.notes,
            isLocked: !unlocked,
            terminal: snap?.terminal ?? DEFAULT_STATE.terminal,
            cwd: FS.getCwd(),
            audio: { ...DEFAULT_STATE.audio, ...snap?.audio },
            ui: { ...DEFAULT_STATE.ui, ...snap?.ui },
            progress: snap?.progress ?? DEFAULT_STATE.progress,
            slack: snap?.slack ?? DEFAULT_STATE.slack,
            hydrated: true,
        });
    },

    openApp: (appId) => {
        const { windows, topZ } = get();
        const appDef = APP_REGISTRY[appId];

        const existing = windows.find((w) => w.appId === appId);
        if (existing) {
            set({
                windows: windows.map((w) =>
                    w.windowId === existing.windowId
                        ? { ...w, isMinimized: false }
                        : w,
                ),
            });
            get().focusWindow(existing.windowId);
            return;
        }

        const newZ = topZ + 1;

        const win: WindowInstance = {
            windowId: randId(),
            appId,
            title: appDef.title,

            x: 90 + windows.length * 18,
            y: 80 + windows.length * 18,

            width: appDef.window.defaultSize.w,
            height: appDef.window.defaultSize.h,

            isMinimized: false,
            isFullscreen: false,
            zIndex: newZ,
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
            ui: {
                audioPanelOpen: false,
                wifiPanelOpen: false,
            },
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
        set({
            ...DEFAULT_STATE,
            hydrated: false,
            cwd: FS.getCwd(),
        });
        window.location.reload();
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

    setTerminal: (lines) => {
        set(() => ({
            terminal: { lines },
        }));

        persist(get);
    },

    refreshFs: () => set({ cwd: FS.getCwd() }),

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
    },

    unlock: () => {
        set({ isLocked: false });
    },

    setMasterVolume: (v) => {
        set((s) => ({
            audio: { ...s.audio, masterVolume: v },
        }));
        persist(get);
    },

    toggleMute: () => {
        set((s) => ({
            audio: { ...s.audio, muted: !s.audio.muted },
        }));
        persist(get);
    },

    setAppVolume: (appId, v) => {
        set((s) => ({
            audio: {
                ...s.audio,
                appVolumes: { ...s.audio.appVolumes, [appId]: v },
            },
        }));
        persist(get);
    },

    toggleAudioPanel: () =>
        set((state) => ({
            ui: {
                audioPanelOpen: !state.ui.audioPanelOpen,
                wifiPanelOpen: false,
            },
        })),

    closeAudioPanel: () =>
        set((state) => ({
            ui: { ...state.ui, audioPanelOpen: false },
        })),

    toggleWifiPanel: () =>
        set((state) => ({
            ui: {
                wifiPanelOpen: !state.ui.wifiPanelOpen,
                audioPanelOpen: false,
            },
        })),

    closeWifiPanel: () =>
        set((state) => ({
            ui: { ...state.ui, wifiPanelOpen: false },
        })),

    markSlackIntroPlayed: () => {
        set((state) => ({
            progress: {
                ...state.progress,
                slackIntroPlayed: true,
            },
        }));
        persist(get);
    },

    setSlackConversations: (
        updater: (prev: Conversation[]) => Conversation[],
    ) => {
        set((state) => ({
            slack: {
                ...state.slack,
                conversations: updater(state.slack!.conversations),
            },
        }));
        persist(get);
    },

    startTyping: (conversationId, authorId) => {
        set((state) => ({
            slack: {
                ...state.slack!,
                typing: {
                    conversationId,
                    authorId,
                },
            },
        }));
    },

    stopTyping: () => {
        set((state) => ({
            slack: {
                ...state.slack!,
                typing: null,
            },
        }));
    },
}));

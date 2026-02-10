import { Conversation, CONVERSATIONS } from "@/src/core/apps/chatData";
import { APP_REGISTRY } from "@/src/core/apps/registry";
import {
    AppId,
    DesktopSnapshot,
    Panel,
    TerminalLine,
    Wallpaper,
    WindowInstance,
} from "@/src/core/apps/types";
import { FS } from "@/src/core/fs/fs.service";
import { AccentColor } from "@/src/core/ui/ui-constants";
import { bringToFront, updateWindow } from "@/src/helpers/desktop.helpers";
import { loadSnapshot, saveSnapshot } from "@/src/store/persist";
import { persistDesktop } from "@/src/store/persist-desktop";
import { create } from "zustand";

const randId = () => crypto.randomUUID();

const DEFAULT_STATE: DesktopSnapshot = {
    windows: [],
    activeWindowId: null,
    topZ: 10,
    notes: { content: "" },
    terminal: { lines: [] },
    settings: {
        theme: "system",
        accentColor: "blue",
        wallpaper: {
            id: "default",
            label: "Default Wallpaper",
            category: "dynamic",
            variants: {
                light: {
                    type: "image",
                    src: "/wallpapers/dynamic/big-sur-color-light.webp",
                },
                dark: {
                    type: "image",
                    src: "/wallpapers/dynamic/big-sur-color-dark.webp",
                },
            },
            media: {
                type: "image",
                src: "/wallpapers/dynamic/big-sur-color-light.webp",
            },
        },
    },
    audio: {
        masterVolume: 1,
        muted: false,
        appVolumes: {},
    },
    ui: {
        activePanel: null,
    },
    progress: {
        slackIntroPlayed: false,
    },
    slack: {
        conversations: CONVERSATIONS,
        typing: null,
    },
};

export type DesktopState = DesktopSnapshot & {
    hydrated: boolean;
    isLocked: boolean;
    cwd: string[];

    hydrate: () => void;
    reset: () => void;

    openApp: (appId: AppId) => void;
    closeWindow: (windowId: string) => void;
    focusWindow: (windowId: string) => void;

    setWindowRect: (
        windowId: string,
        rect: { x: number; y: number; width: number; height: number },
    ) => void;
    setWindowTitle: (windowId: string, title: string) => void;
    minimizeWindow: (windowId: string) => void;
    toggleFullscreen: (windowId: string) => void;

    lock: () => void;
    lockConfig?: {
        passwordLength: number;
    };
    unlock: () => void;
    refreshSession: () => Promise<void>;

    setNotes: (content: string) => void;
    setTerminal: (lines: TerminalLine[]) => void;

    refreshFs: () => void;
    activeFile?: {
        name: string;
        path: string[];
    };

    setActiveFile(file: DesktopState["activeFile"]): void;

    setWallpaper: (wallpaper: Wallpaper) => void;
    setTheme: (theme: "dark" | "light" | "system") => void;
    setAccentColor: (color: AccentColor) => void;

    setMasterVolume: (v: number) => void;
    toggleMute: () => void;
    setAppVolume: (appId: AppId, v: number) => void;

    togglePanel: (panel: "audio" | "wifi" | "appearance" | null) => void;

    markSlackIntroPlayed: () => void;
    setSlackConversations: (
        updater: (prev: Conversation[]) => Conversation[],
    ) => void;

    startTyping: (conversationId: string, authorId: string) => void;
    stopTyping: () => void;
};

export const useDesktopStore = create<DesktopState>((set, get) => ({
    ...DEFAULT_STATE,
    isLocked: true,
    hydrated: false,
    cwd: FS.getCwd(),

    hydrate: async () => {
        let unlocked = false;
        const [snap] = await Promise.all([
            loadSnapshot(),
            fetch("/api/lock-config").then((r) => r.json()),
            fetch("/api/session", { credentials: "same-origin" })
                .then(async (r) => {
                    const data = await r.json();
                    unlocked = !!data.unlocked;
                })
                .catch(() => null),
        ]);

        set({
            ...DEFAULT_STATE,
            ...snap,
            isLocked: !unlocked,
            cwd: FS.getCwd(),
            hydrated: true,
        });

        if (snap?.activeFile) {
            get().openApp("preview");
        }
    },

    openApp(appId) {
        const { windows, topZ } = get();
        const appDef = APP_REGISTRY[appId];

        const existing = windows.find((w) => w.appId === appId);
        if (existing) {
            set((s) => ({
                ...bringToFront(
                    updateWindow(s.windows, existing.windowId, {
                        isMinimized: false,
                    }),
                    s.topZ,
                    existing.windowId,
                ),
            }));
            persistDesktop(get);
            return;
        }

        const win: WindowInstance = {
            windowId: randId(),
            appId,
            title: appDef.title,
            x: 120,
            y: 80,
            width: appDef.window.defaultSize.w,
            height: appDef.window.defaultSize.h,
            isMinimized: false,
            isFullscreen: false,
            zIndex: topZ + 1,
        };

        set({
            windows: [...windows, win],
            activeWindowId: win.windowId,
            topZ: topZ + 1,
        });

        persistDesktop(get);
    },

    closeWindow(windowId) {
        set((s) => {
            const win = s.windows.find((w) => w.windowId === windowId);

            return {
                windows: s.windows.filter((w) => w.windowId !== windowId),
                activeWindowId:
                    s.activeWindowId === windowId ? null : s.activeWindowId,
                activeFile: win?.appId === "preview" ? undefined : s.activeFile,
            };
        });
        persistDesktop(get);
    },

    focusWindow(windowId) {
        set((s) => ({
            ...bringToFront(s.windows, s.topZ, windowId),
            ui: DEFAULT_STATE.ui,
        }));
        persistDesktop(get);
    },

    setWindowRect(windowId, rect) {
        set((s) => ({
            windows: updateWindow(s.windows, windowId, rect),
        }));
        persistDesktop(get);
    },

    setWindowTitle(windowId: string, title: string) {
        set((s) => ({
            windows: updateWindow(s.windows, windowId, { title }),
        }));
        persistDesktop(get);
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

    minimizeWindow(windowId) {
        set((s) => ({
            windows: updateWindow(s.windows, windowId, {
                isMinimized: !s.windows.find((w) => w.windowId === windowId)
                    ?.isMinimized,
            }),
        }));
        persistDesktop(get);
    },

    toggleFullscreen(windowId) {
        const w = get().windows.find((w) => w.windowId === windowId);
        if (!w) return;

        if (!w.isFullscreen) {
            set((s) => ({
                windows: updateWindow(s.windows, windowId, {
                    isFullscreen: true,
                    restoreRect: {
                        x: w.x,
                        y: w.y,
                        width: w.width,
                        height: w.height,
                    },
                    x: 0,
                    y: 0,
                    width: window.innerWidth,
                    height: window.innerHeight,
                }),
            }));
        } else if (w.restoreRect) {
            set((s) => ({
                windows: updateWindow(s.windows, windowId, {
                    isFullscreen: false,
                    ...w.restoreRect,
                    restoreRect: undefined,
                }),
            }));
        }

        persistDesktop(get);
    },

    setNotes(content) {
        set((s) => ({ notes: { ...s.notes, content } }));
        persistDesktop(get);
    },

    setTerminal(lines) {
        set({ terminal: { lines } });
        persistDesktop(get);
    },

    refreshFs: () => set({ cwd: FS.getCwd() }),

    setActiveFile(file) {
        set({ activeFile: file });
        persistDesktop(get);
    },

    setWallpaper: (wallpaper) => {
        set({ settings: { ...get().settings, wallpaper } });
        persistDesktop(get);
    },

    setTheme: (theme: "light" | "dark" | "system") => {
        set((state) => ({
            settings: { ...state.settings, theme },
        }));
        persistDesktop(get);
    },

    setAccentColor: (accentColor: AccentColor) => {
        set((state) => ({
            settings: {
                ...state.settings,
                accentColor,
            },
        }));
        persistDesktop(get);
    },

    lock: () => {
        set({ isLocked: true });
    },

    unlock: () => {
        set({ isLocked: false });
    },

    refreshSession: async () => {
        try {
            const res = await fetch("/api/session", {
                cache: "no-store",
                credentials: "same-origin",
            });
            const data = await res.json();

            set({
                isLocked: !data.unlocked,
            });
        } catch {
            set({ isLocked: true });
        }
    },

    setMasterVolume: (v) => {
        set((s) => ({
            audio: { ...s.audio, masterVolume: v },
        }));
        persistDesktop(get);
    },

    toggleMute: () => {
        set((s) => ({
            audio: { ...s.audio, muted: !s.audio.muted },
        }));
        persistDesktop(get);
    },

    setAppVolume: (appId, v) => {
        set((s) => ({
            audio: {
                ...s.audio,
                appVolumes: { ...s.audio.appVolumes, [appId]: v },
            },
        }));
        persistDesktop(get);
    },

    togglePanel: (panel: Panel) =>
        set((state) => ({
            ui: {
                activePanel: state.ui.activePanel === panel ? null : panel,
            },
        })),

    markSlackIntroPlayed: () => {
        set((state) => ({
            progress: {
                ...state.progress,
                slackIntroPlayed: true,
            },
        }));
        persistDesktop(get);
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
        persistDesktop(get);
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

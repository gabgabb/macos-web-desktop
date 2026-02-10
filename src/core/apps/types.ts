import { Conversation } from "@/src/core/apps/chatData";
import { AccentKey } from "@/src/core/ui/ui-constants";

export type AppId =
    | "finder"
    | "notes"
    | "settings"
    | "terminal"
    | "safari"
    | "calculator"
    | "calendar"
    | "slack"
    | "preview"
    | "doom";

export type AppDefinition = {
    id: AppId;
    title: string;
    icon: string;
    showInDock?: boolean;
    showOnDesktop?: boolean;

    window: {
        defaultSize: { w: number; h: number };
        minSize?: { w: number; h: number };
        resizable?: boolean;
        withPadding?: boolean;
    };
};

export type WindowInstance = {
    windowId: string;
    appId: AppId;
    title: string;

    x: number;
    y: number;
    width: number;
    height: number;

    isMinimized: boolean;

    isFullscreen: boolean;
    restoreRect?: { x: number; y: number; width: number; height: number };

    zIndex: number;
};

export type Panel = "audio" | "wifi" | "appearance" | null;

export type DesktopSnapshot = {
    windows: WindowInstance[];
    activeWindowId: string | null;
    topZ: number;
    notes: {
        content: string;
    };
    terminal: {
        lines: TerminalLine[];
    };
    settings: {
        theme: "light" | "dark" | "system";
        accentColor: AccentKey;
        wallpaper: Wallpaper;
    };
    audio: {
        masterVolume: number;
        muted: boolean;
        appVolumes: Partial<Record<AppId, number>>;
    };
    ui: {
        activePanel: Panel;
    };
    progress?: {
        slackIntroPlayed?: boolean;
    };
    slack: {
        conversations: Conversation[];
        typing: {
            conversationId: string;
            authorId: string;
        } | null;
    };
    activeFile?: {
        name: string;
        path: string[];
    };
};

export type TerminalLine = {
    id: string;
    type: "out" | "err" | "info";
    text: string;
};

export type AppProps = {
    windowId?: string;
};

export type WallpaperMedia =
    | { type: "image"; src: string }
    | { type: "video"; src: string; poster?: string };

export type Wallpaper = {
    id: string;
    label: string;
    category: "dynamic" | "static" | "video";
    media: WallpaperMedia;

    variants?: {
        light?: WallpaperMedia;
        dark?: WallpaperMedia;
    };
    thumb?: string;
};

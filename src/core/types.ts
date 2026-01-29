import { Conversation } from "@/src/core/chatData";

export type AppId =
    | "finder"
    | "notes"
    | "settings"
    | "terminal"
    | "safari"
    | "calculator"
    | "calendar"
    | "slack"
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
        theme: "light" | "dark" | "auto";
        wallpaper: string;
    };
    audio: {
        masterVolume: number;
        muted: boolean;
        appVolumes: Partial<Record<AppId, number>>;
    };
    ui: {
        audioPanelOpen: boolean;
        wifiPanelOpen: boolean;
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
};

export type TerminalLine = {
    id: string;
    type: "out" | "err" | "info";
    text: string;
};

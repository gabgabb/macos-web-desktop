import { ReactNode } from "react";

export type AppId =
    | "finder"
    | "notes"
    | "settings"
    | "terminal"
    | "safari"
    | "calculator"
    | "calendar"
    | "slack";

export type DockApp = {
    id: AppId;
    title: string;
    icon: string | ReactNode;
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
        content: string;
    };
    isLocked: boolean;
    settings: {
        theme: "light" | "dark" | "auto";
        wallpaper: string;
    };
};

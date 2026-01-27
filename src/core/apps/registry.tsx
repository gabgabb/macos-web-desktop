import { AppDefinition } from "@/src/core/types";

export const APP_REGISTRY: Record<string, AppDefinition> = {
    finder: {
        id: "finder",
        title: "Finder",
        icon: "finder",
        showInDock: true,
        showOnDesktop: true,
        window: {
            defaultSize: { w: 720, h: 520 },
            resizable: true,
            withPadding: false,
        },
    },
    notes: {
        id: "notes",
        title: "Notes",
        icon: "notes",
        showInDock: true,
        showOnDesktop: true,
        window: {
            defaultSize: { w: 520, h: 420 },
            resizable: true,
            withPadding: true,
        },
    },
    settings: {
        id: "settings",
        title: "Settings",
        icon: "settings",
        showInDock: true,
        showOnDesktop: true,
        window: {
            defaultSize: { w: 600, h: 480 },
            withPadding: false,
        },
    },
    terminal: {
        id: "terminal",
        title: "Terminal",
        icon: "terminal",
        showInDock: true,
        showOnDesktop: true,
        window: {
            defaultSize: { w: 700, h: 400 },
            resizable: true,
            withPadding: true,
        },
    },
    safari: {
        id: "safari",
        title: "Safari",
        icon: "safari",
        showInDock: true,
        showOnDesktop: true,
        window: {
            defaultSize: { w: 900, h: 600 },
            withPadding: false,
        },
    },
    calculator: {
        id: "calculator",
        title: "Calculator",
        icon: "calculator",
        showInDock: true,
        showOnDesktop: true,
        window: {
            defaultSize: { w: 320, h: 420 },
            resizable: false,
            withPadding: false,
        },
    },
    calendar: {
        id: "calendar",
        title: "Calendar",
        icon: "calendar",
        showInDock: true,
        showOnDesktop: true,
        window: {
            defaultSize: { w: 820, h: 620 },
            resizable: true,
            withPadding: true,
        },
    },
    slack: {
        id: "slack",
        title: "Slack",
        icon: "slack",
        showInDock: true,
        showOnDesktop: true,
        window: {
            defaultSize: { w: 900, h: 650 },
            resizable: true,
            withPadding: false,
        },
    },
    doom: {
        id: "doom",
        title: "DOOM",
        icon: "doom",
        showInDock: true,
        showOnDesktop: true,
        window: {
            defaultSize: { w: 910, h: 610 },
            resizable: false,
            withPadding: false,
        },
    },
};

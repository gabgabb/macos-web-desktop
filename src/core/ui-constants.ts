import type { DockApp } from "@/src/core/types";

export const MENU_BAR_HEIGHT = 40;
export const DOCK_HEIGHT = 88;
export const DOCK_MARGIN_BOTTOM = 20;
export const DOCK_RESERVED = DOCK_HEIGHT + DOCK_MARGIN_BOTTOM + 8;

export const DOCK_APPS: DockApp[] = [
    { id: "finder", title: "Finder", icon: "/icones/folder.png" },
    { id: "notes", title: "Notes", icon: "/icones/notes.png" },
    { id: "settings", title: "Settings", icon: "/icones/settings.png" },
    { id: "terminal", title: "Terminal", icon: "/icones/terminal.png" },
    { id: "safari", title: "Safari", icon: "/icones/safari.png" },
];

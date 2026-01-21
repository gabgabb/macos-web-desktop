import type { DockApp } from "@/src/core/types";

export const MENU_BAR_HEIGHT = 40;
export const DOCK_HEIGHT = 88;
export const DOCK_MARGIN_BOTTOM = 20;
export const DOCK_RESERVED = DOCK_HEIGHT + DOCK_MARGIN_BOTTOM + 8;

export const DOCK_APPS: DockApp[] = [
    { id: "finder", title: "Finder", icon: "/icones/folder.webp" },
    { id: "notes", title: "Notes", icon: "/icones/notes.webp" },
    { id: "settings", title: "Settings", icon: "/icones/settings.webp" },
    { id: "terminal", title: "Terminal", icon: "/icones/terminal.webp" },
    { id: "safari", title: "Safari", icon: "/icones/safari.webp" },
];

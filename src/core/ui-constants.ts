import type { DockApp } from "@/src/core/types";

export const MENU_BAR_HEIGHT = 40;
export const DOCK_HEIGHT = 88;
export const DOCK_MARGIN_BOTTOM = 20;
export const DOCK_RESERVED = DOCK_HEIGHT + DOCK_MARGIN_BOTTOM + 8;

export const DOCK_APPS: DockApp[] = [
    { id: "finder", title: "Finder", icon: "/folder.png" },
    { id: "notes", title: "Notes", icon: "/notes.png" },
    { id: "about", title: "About", icon: "/settings.png" },
    { id: "terminal", title: "Terminal", icon: "/terminal.png" },
    { id: "safari", title: "Safari", icon: "/safari.png" },
];

export const MENU_BAR_HEIGHT = 40;
export const DOCK_HEIGHT = 88;
export const DOCK_MARGIN_BOTTOM = 20;
export const DOCK_RESERVED = DOCK_HEIGHT + DOCK_MARGIN_BOTTOM - 3;

export type AccentColor =
    | "blue"
    | "purple"
    | "pink"
    | "green"
    | "orange"
    | "teal";

export const ACCENTS = {
    blue: "96 165 250",
    purple: "168 85 247",
    pink: "236 72 153",
    green: "34 197 94",
    orange: "249 115 22",
    teal: "20 184 166",
} as const;

export type AccentKey = keyof typeof ACCENTS;

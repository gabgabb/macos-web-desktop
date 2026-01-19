import type { DesktopSnapshot } from "./types";

const KEY = "macos-web-desktop:v1";

export function saveSnapshot(snapshot: DesktopSnapshot) {
    try {
        localStorage.setItem(KEY, JSON.stringify(snapshot));
    } catch {
        // ignore
    }
}

export function loadSnapshot(): DesktopSnapshot | null {
    try {
        const raw = localStorage.getItem(KEY);
        if (!raw) return null;
        return JSON.parse(raw) as DesktopSnapshot;
    } catch {
        return null;
    }
}

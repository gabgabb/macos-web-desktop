import type { DesktopSnapshot, TerminalLine } from "../core/apps/types";

const STORAGE_KEY = "macos-web-desktop:v1";
const SALT = "--macos-web-desktop-salt--";

function encode(data: unknown): string {
    const json = JSON.stringify(data);
    const utf8 = encodeURIComponent(json + SALT);
    return btoa(utf8);
}

function decode(raw: string): unknown | null {
    try {
        const utf8 = atob(raw);
        const decoded = decodeURIComponent(utf8);

        if (!decoded.endsWith(SALT)) return null;

        const json = decoded.slice(0, -SALT.length);
        return JSON.parse(json);
    } catch {
        return null;
    }
}

export function saveSnapshot(snapshot: DesktopSnapshot) {
    try {
        const encoded = encode(snapshot);
        localStorage.setItem(STORAGE_KEY, encoded);
    } catch {}
}

function migrateSnapshot(raw: any): DesktopSnapshot {
    const snap = { ...raw };

    if (snap.terminal) {
        if (
            "content" in snap.terminal &&
            typeof snap.terminal.content === "string"
        ) {
            const lines: TerminalLine[] = snap.terminal.content
                .split("\n")
                .filter(Boolean)
                .map((text: string) => ({
                    id: crypto.randomUUID(),
                    type: "out",
                    text,
                }));

            snap.terminal = { lines };
        }

        if (!Array.isArray(snap.terminal.lines)) {
            snap.terminal = { lines: [] };
        }
    } else {
        snap.terminal = { lines: [] };
    }

    return snap as DesktopSnapshot;
}

export function loadSnapshot(): DesktopSnapshot | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;

        const decoded = decode(raw);
        if (!decoded) return null;

        return migrateSnapshot(decoded);
    } catch {
        return null;
    }
}

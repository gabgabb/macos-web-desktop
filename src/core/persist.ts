import type { DesktopSnapshot, TerminalLine } from "./types";

const KEY = "macos-web-desktop:v1";

export function saveSnapshot(snapshot: DesktopSnapshot) {
    try {
        localStorage.setItem(KEY, JSON.stringify(snapshot));
    } catch {
        // ignore
    }
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
        const raw = localStorage.getItem(KEY);
        if (!raw) return null;

        const parsed = JSON.parse(raw);

        return migrateSnapshot(parsed);
    } catch {
        return null;
    }
}

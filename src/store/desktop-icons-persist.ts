const KEY = "macos-web-desktop:desktop-icons-v1";

export function loadDesktopIconOrder(): string[] | null {
    try {
        const raw = localStorage.getItem(KEY);
        if (!raw) return null;
        return JSON.parse(raw) as string[];
    } catch {
        return null;
    }
}

export function saveDesktopIconOrder(order: string[]) {
    try {
        localStorage.setItem(KEY, JSON.stringify(order));
    } catch {
        // ignore
    }
}

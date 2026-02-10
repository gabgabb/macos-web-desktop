import { useDesktopStore } from "@/src/store/desktop-store";
import { describe, expect, it } from "vitest";

describe("desktop store", () => {
    it("opens an app", () => {
        const store = useDesktopStore.getState();

        store.openApp("notes");

        const windows = useDesktopStore.getState().windows;
        expect(windows).toHaveLength(1);
        expect(windows[0].appId).toBe("notes");
    });

    it("minimizes a window", () => {
        const store = useDesktopStore.getState();

        store.openApp("notes");
        const win = useDesktopStore.getState().windows[0];

        store.minimizeWindow(win.windowId);

        expect(useDesktopStore.getState().windows[0].isMinimized).toBe(true);
    });

    it("sets accent color", () => {
        const store = useDesktopStore.getState();

        store.setAccentColor("red" as any);

        expect(useDesktopStore.getState().settings.accentColor).toBe("red");
    });
});

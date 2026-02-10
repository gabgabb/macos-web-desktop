import { FS } from "@/src/core/fs/fs.service";
import { useDesktopStore } from "@/src/store/desktop-store";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/src/store/persist-desktop", () => ({
    persistDesktop: vi.fn(),
}));

vi.mock("@/src/store/persist", () => ({
    loadSnapshot: vi.fn(async () => null),
    saveSnapshot: vi.fn(),
}));

describe("useDesktopStore", () => {
    beforeEach(() => {
        useDesktopStore.setState(useDesktopStore.getInitialState(), true);
    });

    it("opens an app and adds a window", () => {
        const store = useDesktopStore.getState();

        store.openApp("notes");

        const state = useDesktopStore.getState();
        expect(state.windows.length).toBe(1);
        expect(state.windows[0].appId).toBe("notes");
        expect(state.activeWindowId).toBe(state.windows[0].windowId);
    });

    it("does not duplicate an already opened app", () => {
        const store = useDesktopStore.getState();

        store.openApp("notes");
        store.openApp("notes");

        const state = useDesktopStore.getState();
        expect(state.windows.length).toBe(1);
    });

    it("closes a window", () => {
        const store = useDesktopStore.getState();

        store.openApp("calculator");
        const winId = useDesktopStore.getState().windows[0].windowId;

        store.closeWindow(winId);

        const state = useDesktopStore.getState();
        expect(state.windows.length).toBe(0);
        expect(state.activeWindowId).toBeNull();
    });

    it("minimizes and restores a window", () => {
        const store = useDesktopStore.getState();

        store.openApp("terminal");
        const winId = useDesktopStore.getState().windows[0].windowId;

        store.minimizeWindow(winId);
        expect(useDesktopStore.getState().windows[0].isMinimized).toBe(true);

        store.minimizeWindow(winId);
        expect(useDesktopStore.getState().windows[0].isMinimized).toBe(false);
    });

    it("toggles fullscreen and restores geometry", () => {
        const store = useDesktopStore.getState();

        store.openApp("notes");
        const win = useDesktopStore.getState().windows[0];

        store.toggleFullscreen(win.windowId);
        const fsWin = useDesktopStore.getState().windows[0];
        expect(fsWin.isFullscreen).toBe(true);
        expect(fsWin.restoreRect).toBeDefined();

        store.toggleFullscreen(win.windowId);
        const restored = useDesktopStore.getState().windows[0];
        expect(restored.isFullscreen).toBe(false);
        expect(restored.restoreRect).toBeUndefined();
    });

    it("sets notes content", () => {
        const store = useDesktopStore.getState();
        store.setNotes("hello");

        expect(useDesktopStore.getState().notes.content).toBe("hello");
    });

    it("locks and unlocks desktop", () => {
        const store = useDesktopStore.getState();

        store.lock();
        expect(useDesktopStore.getState().isLocked).toBe(true);

        store.unlock();
        expect(useDesktopStore.getState().isLocked).toBe(false);
    });

    it("updates cwd when refreshing FS", () => {
        FS.cd("/home/user/Documents");
        useDesktopStore.getState().refreshFs();

        expect(useDesktopStore.getState().cwd).toEqual([
            "home",
            "user",
            "Documents",
        ]);
    });

    it("starts and stops typing", () => {
        useDesktopStore.getState().startTyping("general", "bob");

        expect(useDesktopStore.getState().slack?.typing).toEqual({
            conversationId: "general",
            authorId: "bob",
        });

        useDesktopStore.getState().stopTyping();
        expect(useDesktopStore.getState().slack?.typing).toBeNull();
    });
});

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

    it("focuses a window and brings it to front", () => {
        const store = useDesktopStore.getState();

        store.openApp("notes");
        store.openApp("terminal");

        const [first, second] = useDesktopStore.getState().windows;

        store.focusWindow(first.windowId);

        const state = useDesktopStore.getState();
        const focused = state.windows.find(
            (w) => w.windowId === first.windowId,
        )!;

        expect(state.activeWindowId).toBe(first.windowId);
        expect(focused.zIndex).toBeGreaterThan(second.zIndex);
        expect(state.ui.activePanel).toBeNull();
    });

    it("updates window rect and title", () => {
        const store = useDesktopStore.getState();

        store.openApp("notes");
        const winId = useDesktopStore.getState().windows[0].windowId;

        store.setWindowRect(winId, { x: 10, y: 20, width: 300, height: 400 });
        store.setWindowTitle(winId, "My Notes");

        const win = useDesktopStore.getState().windows[0];
        expect(win.x).toBe(10);
        expect(win.y).toBe(20);
        expect(win.width).toBe(300);
        expect(win.height).toBe(400);
        expect(win.title).toBe("My Notes");
    });

    it("controls audio settings", () => {
        const store = useDesktopStore.getState();

        store.setMasterVolume(0.5);
        expect(useDesktopStore.getState().audio.masterVolume).toBe(0.5);

        store.toggleMute();
        expect(useDesktopStore.getState().audio.muted).toBe(true);

        store.setAppVolume("terminal", 0.2);
        expect(useDesktopStore.getState().audio.appVolumes.terminal).toBe(0.2);
    });

    it("updates appearance settings", () => {
        const store = useDesktopStore.getState();

        store.setTheme("dark");
        store.setAccentColor("orange");

        expect(useDesktopStore.getState().settings.theme).toBe("dark");
        expect(useDesktopStore.getState().settings.accentColor).toBe("orange");

        const wp = {
            ...useDesktopStore.getState().settings.wallpaper,
            id: "custom",
            label: "Custom",
        };

        store.setWallpaper(wp);
        expect(useDesktopStore.getState().settings.wallpaper.id).toBe("custom");
    });

    it("toggles panels", () => {
        const store = useDesktopStore.getState();

        store.togglePanel("audio");
        expect(useDesktopStore.getState().ui.activePanel).toBe("audio");

        store.togglePanel("audio");
        expect(useDesktopStore.getState().ui.activePanel).toBeNull();

        store.togglePanel("wifi");
        expect(useDesktopStore.getState().ui.activePanel).toBe("wifi");
    });

    it("updates slack conversations via updater", () => {
        const store = useDesktopStore.getState();

        store.setSlackConversations((prev) => [
            ...prev,
            {
                id: "new",
                title: "New channel",
                messages: [],
            } as any,
        ]);

        expect(
            useDesktopStore
                .getState()
                .slack?.conversations.some((c) => c.id === "new"),
        ).toBe(true);
    });

    it("hydrates state from snapshot", async () => {
        const snap = {
            windows: [],
            activeWindowId: null,
            topZ: 42,
        };

        const persist = await import("@/src/store/persist");
        vi.spyOn(persist, "loadSnapshot").mockResolvedValueOnce(snap as any);

        global.fetch = vi
            .fn()
            .mockResolvedValueOnce({
                json: async () => ({ passwordLength: 4 }),
            } as any)
            .mockResolvedValueOnce({
                json: async () => ({ unlocked: true }),
            } as any);

        await useDesktopStore.getState().hydrate();

        const state = useDesktopStore.getState();

        expect(state.hydrated).toBe(true);
        expect(state.isLocked).toBe(false);
        expect(state.topZ).toBe(42);
    });
});

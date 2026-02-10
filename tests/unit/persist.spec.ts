import type { DesktopSnapshot } from "@/src/core/apps/types";
import { loadSnapshot, saveSnapshot } from "@/src/store/persist";
import { beforeEach, describe, expect, it, vi } from "vitest";

const STORAGE_KEY = "macos-web-desktop:v1";

function mockLocalStorage() {
    let store: Record<string, string> = {};

    return {
        getItem: vi.fn((key: string) => store[key] ?? null),
        setItem: vi.fn((key: string, value: string) => {
            store[key] = value;
        }),
        clear: () => {
            store = {};
        },
    };
}

describe("persist snapshot", () => {
    let localStorageMock: ReturnType<typeof mockLocalStorage>;

    beforeEach(() => {
        localStorageMock = mockLocalStorage();

        vi.stubGlobal("localStorage", localStorageMock as any);
        vi.stubGlobal("crypto", {
            randomUUID: vi.fn(() => "uuid"),
        } as any);
    });

    it("saves snapshot to localStorage", () => {
        const snap = { foo: "bar" } as unknown as DesktopSnapshot;

        saveSnapshot(snap);

        expect(localStorageMock.setItem).toHaveBeenCalledOnce();
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
            STORAGE_KEY,
            expect.any(String),
        );
    });

    it("loads a previously saved snapshot", () => {
        const snap = {
            terminal: { lines: [] },
        } as unknown as DesktopSnapshot;

        saveSnapshot(snap);

        const loaded = loadSnapshot();

        expect(loaded).toEqual(
            expect.objectContaining({
                terminal: { lines: [] },
            }),
        );
    });

    it("returns null if no snapshot is stored", () => {
        expect(loadSnapshot()).toBeNull();
    });

    it("returns null for corrupted data", () => {
        localStorageMock.getItem.mockReturnValueOnce("not-base64");

        expect(loadSnapshot()).toBeNull();
    });

    it("migrates legacy terminal content string to lines", () => {
        const legacy = {
            terminal: {
                content: "hello\nworld\n",
            },
        };

        const encoded = btoa(
            encodeURIComponent(
                JSON.stringify(legacy) + "--macos-web-desktop-salt--",
            ),
        );

        localStorageMock.getItem.mockReturnValueOnce(encoded);

        const snap = loadSnapshot();

        expect(snap?.terminal.lines).toHaveLength(2);
        expect(snap?.terminal.lines[0]).toEqual({
            id: "uuid",
            type: "out",
            text: "hello",
        });
        expect(snap?.terminal.lines[1].text).toBe("world");
    });

    it("handles terminal without lines array", () => {
        const broken = {
            terminal: {},
        };

        const encoded = btoa(
            encodeURIComponent(
                JSON.stringify(broken) + "--macos-web-desktop-salt--",
            ),
        );

        localStorageMock.getItem.mockReturnValueOnce(encoded);

        const snap = loadSnapshot();

        expect(snap?.terminal.lines).toEqual([]);
    });

    it("adds empty terminal if missing", () => {
        const noTerminal = {};

        const encoded = btoa(
            encodeURIComponent(
                JSON.stringify(noTerminal) + "--macos-web-desktop-salt--",
            ),
        );

        localStorageMock.getItem.mockReturnValueOnce(encoded);

        const snap = loadSnapshot();

        expect(snap?.terminal).toEqual({ lines: [] });
    });

    it("returns null if salt is missing", () => {
        const bad = btoa(encodeURIComponent(JSON.stringify({ foo: "bar" })));

        localStorageMock.getItem.mockReturnValueOnce(bad);

        expect(loadSnapshot()).toBeNull();
    });

    it("does not throw if localStorage.setItem fails", () => {
        localStorageMock.setItem.mockImplementationOnce(() => {
            throw new Error("quota exceeded");
        });

        expect(() =>
            saveSnapshot({
                terminal: { lines: [] },
            } as unknown as DesktopSnapshot),
        ).not.toThrow();
    });
});

import {
    loadDesktopIconOrder,
    saveDesktopIconOrder,
} from "@/src/store/desktop-icons-persist";
import { beforeEach, describe, expect, it, vi } from "vitest";

const KEY = "macos-web-desktop:desktop-icons-v1";

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

describe("desktop icon order persistence", () => {
    let localStorageMock: ReturnType<typeof mockLocalStorage>;

    beforeEach(() => {
        localStorageMock = mockLocalStorage();
        vi.stubGlobal("localStorage", localStorageMock as any);
    });

    it("returns null when no icon order is stored", () => {
        expect(loadDesktopIconOrder()).toBeNull();
        expect(localStorageMock.getItem).toHaveBeenCalledWith(KEY);
    });

    it("loads a previously saved icon order", () => {
        const order = ["notes", "terminal", "browser"];

        localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(order));

        const result = loadDesktopIconOrder();

        expect(result).toEqual(order);
    });

    it("returns null if stored data is invalid JSON", () => {
        localStorageMock.getItem.mockReturnValueOnce("{not-valid-json");

        const result = loadDesktopIconOrder();

        expect(result).toBeNull();
    });

    it("saves icon order to localStorage", () => {
        const order = ["finder", "trash"];

        saveDesktopIconOrder(order);

        expect(localStorageMock.setItem).toHaveBeenCalledOnce();
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
            KEY,
            JSON.stringify(order),
        );
    });

    it("does not throw if localStorage.setItem fails", () => {
        localStorageMock.setItem.mockImplementationOnce(() => {
            throw new Error("quota exceeded");
        });

        expect(() => saveDesktopIconOrder(["a", "b"])).not.toThrow();
    });
});

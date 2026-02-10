import { useSystemApps } from "@/src/hooks/useSystemApps";
import { renderHook } from "@/tests/unit/useLiveClock.spec";
import { act } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("useSystemApps", () => {
    const mockApps = [
        {
            id: "notes",
            title: "Notes",
            icon: "notes",
            window: {
                defaultSize: { w: 400, h: 300 },
            },
        },
        {
            id: "terminal",
            title: "Terminal",
            icon: "terminal",
            window: {
                defaultSize: { w: 600, h: 400 },
            },
        },
    ] as any;

    let fetchMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        fetchMock = vi.fn();
        vi.stubGlobal("fetch", fetchMock);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("fetches system apps on mount and updates state", async () => {
        fetchMock.mockResolvedValueOnce({
            json: vi.fn().mockResolvedValue(mockApps),
        });

        const hook = renderHook(() => useSystemApps());

        await act(async () => {
            await Promise.resolve();
        });

        expect(hook.current).toEqual(mockApps);
    });
});

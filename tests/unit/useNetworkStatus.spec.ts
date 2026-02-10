import { useNetworkStatus } from "@/src/hooks/useNetworkStatus";
import { renderHook } from "@/tests/unit/useLiveClock.spec";
import { act } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("useNetworkStatus", () => {
    let addEventListenerSpy: any;
    let removeEventListenerSpy: any;

    beforeEach(() => {
        Object.defineProperty(navigator, "onLine", {
            configurable: true,
            get: () => true,
        });

        const connection = {
            effectiveType: "4g",
            downlink: 10,
            rtt: 50,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
        };

        Object.defineProperty(navigator, "connection", {
            configurable: true,
            value: connection,
        });

        addEventListenerSpy = vi.spyOn(window, "addEventListener");
        removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
    });

    it("returns initial online state", () => {
        const hook = renderHook(() => useNetworkStatus());

        expect(hook.current.online).toBe(true);
    });

    it("reads connection information on mount", () => {
        const hook = renderHook(() => useNetworkStatus());

        expect(hook.current).toEqual({
            online: true,
            type: "4g",
            downlink: 10,
            rtt: 50,
        });
    });

    it("updates state when going offline", () => {
        const hook = renderHook(() => useNetworkStatus());

        Object.defineProperty(navigator, "onLine", {
            configurable: true,
            get: () => false,
        });

        act(() => {
            window.dispatchEvent(new Event("offline"));
        });

        expect(hook.current.online).toBe(false);
    });

    it("updates state when going online", () => {
        Object.defineProperty(navigator, "onLine", {
            configurable: true,
            get: () => false,
        });

        const hook = renderHook(() => useNetworkStatus());

        Object.defineProperty(navigator, "onLine", {
            configurable: true,
            get: () => true,
        });

        act(() => {
            window.dispatchEvent(new Event("online"));
        });

        expect(hook.current.online).toBe(true);
    });

    it("updates when connection info changes", () => {
        const hook = renderHook(() => useNetworkStatus());

        const conn = (navigator as any).connection;

        conn.effectiveType = "3g";
        conn.downlink = 1.5;
        conn.rtt = 300;

        const listener = conn.addEventListener.mock.calls.find(
            (c: any[]) => c[0] === "change",
        )?.[1];

        expect(listener).toBeDefined();

        act(() => {
            listener();
        });

        expect(hook.current).toEqual({
            online: true,
            type: "3g",
            downlink: 1.5,
            rtt: 300,
        });
    });

    it("cleans up event listeners on unmount", () => {
        const hook = renderHook(() => useNetworkStatus());

        hook.unmount();

        expect(removeEventListenerSpy).toHaveBeenCalledWith(
            "online",
            expect.any(Function),
        );
        expect(removeEventListenerSpy).toHaveBeenCalledWith(
            "offline",
            expect.any(Function),
        );

        const conn = (navigator as any).connection;
        expect(conn.removeEventListener).toHaveBeenCalledWith(
            "change",
            expect.any(Function),
        );
    });
});

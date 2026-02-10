import { useLiveClock } from "@/src/hooks/useLiveClock";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

export function renderHook<T>(hook: () => T) {
    let value: T | undefined;

    function Test() {
        value = hook();
        return null;
    }

    const container = document.createElement("div");
    document.body.appendChild(container);

    const root = createRoot(container);

    act(() => {
        root.render(<Test />);
    });

    return {
        get current() {
            if (value === undefined) {
                throw new Error("Hook not rendered yet");
            }
            return value;
        },
        rerender() {
            act(() => {
                root.render(<Test />);
            });
        },
        unmount() {
            act(() => {
                root.unmount();
            });
            container.remove();
        },
    };
}

describe("useLiveClock", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2024-01-15T10:05:00"));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("returns formatted values", () => {
        const hook = renderHook(() =>
            useLiveClock({ tickMs: 60_000, locale: "en-US" }),
        );

        expect(hook.current.hhmm).toBe("10:05");
        expect(hook.current.MMM).toBe("Jan");
        expect(hook.current.dayDigit).toBe("15");

        hook.unmount();
    });

    it("updates after tick", () => {
        const hook = renderHook(() =>
            useLiveClock({ tickMs: 60_000, locale: "en-US" }),
        );

        const first = hook.current.hhmm;

        act(() => {
            vi.advanceTimersByTime(60_000);
            hook.rerender();
        });

        expect(hook.current.hhmm).not.toBe(first);

        hook.unmount();
    });

    it("respects locale", () => {
        const hook = renderHook(() =>
            useLiveClock({ tickMs: 60_000, locale: "fr-FR" }),
        );

        expect(hook.current.dateLong.toLowerCase()).toContain("janvier");

        hook.unmount();
    });
});

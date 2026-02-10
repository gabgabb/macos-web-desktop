import {
    getReducedMotionMedia,
    useAccessibilityPreferency,
} from "@/src/hooks/useAccessibilityPreferency";
import { renderHook } from "@/tests/unit/useLiveClock.spec";
import { act } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("useAccessibilityPreferency", () => {
    let listener: ((e: MediaQueryListEvent) => void) | null = null;

    beforeEach(() => {
        vi.stubGlobal(
            "matchMedia",
            vi.fn().mockImplementation(() => ({
                matches: true,
                addEventListener: (_: string, cb: any) => {
                    listener = cb;
                },
                removeEventListener: vi.fn(),
            })),
        );
    });

    it("returns prefers-reduced-motion value", () => {
        const hook = renderHook(() => useAccessibilityPreferency());
        expect(hook.current).toBe(true);
        hook.unmount();
    });

    it("updates when media query changes", () => {
        let mq: any;

        vi.stubGlobal(
            "matchMedia",
            vi.fn().mockImplementation(() => {
                mq = {
                    matches: true,
                    addEventListener: (_: string, cb: any) => {
                        listener = cb;
                    },
                    removeEventListener: vi.fn(),
                };
                return mq;
            }),
        );

        const hook = renderHook(() => useAccessibilityPreferency());
        expect(hook.current).toBe(true);

        act(() => {
            mq.matches = false;
            listener?.({} as MediaQueryListEvent);
        });

        expect(hook.current).toBe(false);
        hook.unmount();
    });
});

describe("getReducedMotionMedia", () => {
    it("returns undefined if no media", () => {
        expect(getReducedMotionMedia(undefined)).toBeUndefined();
    });

    it("converts video to image using poster", () => {
        const media = {
            type: "video",
            src: "/video.mp4",
            poster: "/poster.png",
        } as const;

        expect(getReducedMotionMedia(media)).toEqual({
            type: "image",
            src: "/poster.png",
        });
    });

    it("converts video to image using src fallback", () => {
        const media = {
            type: "video",
            src: "/video.mp4",
        } as const;

        expect(getReducedMotionMedia(media)).toEqual({
            type: "image",
            src: "/video.mp4",
        });
    });

    it("returns image as-is", () => {
        const media = {
            type: "image",
            src: "/img.png",
        } as const;

        expect(getReducedMotionMedia(media)).toBe(media);
    });
});

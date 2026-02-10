import { useSessionGuard } from "@/src/hooks/useSessionGuard";
import { useDesktopStore } from "@/src/store/desktop-store";
import { renderHook } from "@/tests/unit/useLiveClock.spec";
import { beforeEach, describe, expect, it, vi } from "vitest";

const hydrate = vi.fn();
const replace = vi.fn();

vi.mock("@/src/store/desktop-store", () => ({
    useDesktopStore: vi.fn(),
}));

vi.mock("next/navigation", () => ({
    useRouter: () => ({ replace }),
}));

describe("useSessionGuard", () => {
    beforeEach(() => {
        hydrate.mockClear();
        replace.mockClear();
    });

    it("hydrates on mount", () => {
        vi.mocked(useDesktopStore).mockImplementation((sel: any) =>
            sel({
                hydrate,
                hydrated: false,
                isLocked: true,
            }),
        );

        renderHook(() => useSessionGuard("locked"));
        expect(hydrate).toHaveBeenCalledOnce();
    });

    it("redirects when unlocked but mode is locked", () => {
        vi.mocked(useDesktopStore).mockImplementation((sel: any) =>
            sel({
                hydrate,
                hydrated: true,
                isLocked: false,
            }),
        );

        renderHook(() => useSessionGuard("locked"));
        expect(replace).toHaveBeenCalledWith("/");
    });
});

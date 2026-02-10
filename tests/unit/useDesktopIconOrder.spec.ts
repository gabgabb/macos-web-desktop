import { useDesktopIconOrder } from "@/src/hooks/useDesktopIcons";
import {
    loadDesktopIconOrder,
    saveDesktopIconOrder,
} from "@/src/store/desktop-icons-persist";
import { renderHook } from "@/tests/unit/useLiveClock.spec";
import { act } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/src/store/desktop-icons-persist", () => ({
    loadDesktopIconOrder: vi.fn(),
    saveDesktopIconOrder: vi.fn(),
}));

describe("useDesktopIconOrder", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("initializes order from items when no saved order", () => {
        vi.mocked(loadDesktopIconOrder).mockReturnValue(null);

        const items = [{ id: "notes" }, { id: "terminal" }] as any;

        const hook = renderHook(() => useDesktopIconOrder(items));

        expect(hook.current.order).toEqual(["notes", "terminal"]);
    });

    it("hydrates order from persisted storage", () => {
        vi.mocked(loadDesktopIconOrder).mockReturnValue(["terminal", "notes"]);

        const items = [{ id: "notes" }, { id: "terminal" }] as any;

        const hook = renderHook(() => useDesktopIconOrder(items));

        expect(hook.current.order).toEqual(["terminal", "notes"]);
    });

    it("filters out removed apps from saved order", () => {
        vi.mocked(loadDesktopIconOrder).mockReturnValue([
            "terminal",
            "notes",
            "ghost",
        ]);

        const items = [{ id: "notes" }, { id: "terminal" }] as any;

        const hook = renderHook(() => useDesktopIconOrder(items));

        expect(hook.current.order).toEqual(["terminal", "notes"]);
    });

    it("updates order on drag end and persists it", () => {
        vi.mocked(loadDesktopIconOrder).mockReturnValue(null);

        const items = [{ id: "notes" }, { id: "terminal" }] as any;
        const hook = renderHook(() => useDesktopIconOrder(items));

        act(() => {
            hook.current.onDragEnd({
                active: { id: "notes" },
                over: { id: "terminal" },
            } as any);
        });

        expect(hook.current.order).toEqual(["terminal", "notes"]);
        expect(saveDesktopIconOrder).toHaveBeenCalledWith([
            "terminal",
            "notes",
        ]);
    });

    it("does nothing if dragged over itself", () => {
        vi.mocked(loadDesktopIconOrder).mockReturnValue(null);

        const items = [{ id: "notes" }] as any;
        const hook = renderHook(() => useDesktopIconOrder(items));

        act(() => {
            hook.current.onDragEnd({
                active: { id: "notes" },
                over: { id: "notes" },
            } as any);
        });

        expect(hook.current.order).toEqual(["notes"]);
        expect(saveDesktopIconOrder).not.toHaveBeenCalled();
    });
});

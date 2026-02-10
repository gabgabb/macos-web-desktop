import { useMarqueeSelection } from "@/src/hooks/useDesktopIcons";
import { renderHook } from "@/tests/unit/useLiveClock.spec";
import { act } from "react";

it("starts marquee selection on empty area", () => {
    const layer = document.createElement("div");
    layer.getBoundingClientRect = () =>
        ({ left: 0, top: 0, width: 500, height: 500 }) as any;

    const child = document.createElement("div");
    layer.appendChild(child);

    const ref = { current: layer };

    const hook = renderHook(() => useMarqueeSelection(ref));

    act(() => {
        hook.current.onMouseDown({
            button: 0,
            clientX: 10,
            clientY: 10,
            target: child,
            shiftKey: false,
        } as any);
    });

    expect(hook.current.drag).not.toBeNull();
});

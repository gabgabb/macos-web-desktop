"use client";

import { useEffect, useRef } from "react";

export type ContextAction =
    | { id: "new-folder"; label: string }
    | { id: "refresh"; label: string }
    | { id: "wallpaper"; label: string };

export function DesktopContextMenu({
    x,
    y,
    open,
    onClose,
    onAction,
}: {
    x: number;
    y: number;
    open: boolean;
    onClose: () => void;
    onAction: (id: ContextAction["id"]) => void;
}) {
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!open) return;

        const onDown = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node))
                onClose();
        };

        window.addEventListener("mousedown", onDown);
        return () => {
            window.removeEventListener("mousedown", onDown);
        };
    }, [open, onClose]);

    if (!open) return null;

    const items: ContextAction[] = [
        { id: "new-folder", label: "New Folder" },
        { id: "refresh", label: "Refresh (dev mode only)" },
        { id: "wallpaper", label: "Change Wallpaper" },
    ];

    return (
        <div
            ref={ref}
            className="desktop-context-menu fixed z-20000 min-w-52.5 rounded-xl border border-white/10 bg-black/55 py-2 text-white/90 shadow-2xl backdrop-blur-xl"
            style={{ left: x, top: y }}
            onMouseDown={(e) => e.stopPropagation()}
        >
            {items.map((it) => (
                <button
                    key={it.id}
                    className="w-full px-3 py-2 text-left text-sm transition hover:bg-white/10"
                    onClick={() => {
                        onAction(it.id);
                        onClose();
                    }}
                >
                    {it.label}
                </button>
            ))}
        </div>
    );
}

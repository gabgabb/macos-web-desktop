import {
    loadDesktopIconOrder,
    saveDesktopIconOrder,
} from "@/src/core/desktop-icons-persist";
import { AppId } from "@/src/core/types";
import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import React, { useEffect, useState } from "react";

type WithId = { id: AppId };

function intersects(a: any, b: any) {
    const ar = a.left + a.width;
    const ab = a.top + a.height;
    const br = b.left + b.width;
    const bb = b.top + b.height;
    return !(ar < b.left || br < a.left || ab < b.top || bb < a.top);
}

function useDesktopIconOrder(items: WithId[]) {
    const [order, setOrder] = useState<AppId[]>([]);

    useEffect(() => {
        const ids = items.map((i) => i.id);

        setOrder((prev) => {
            const next = prev.filter((id) => ids.includes(id));

            for (const id of ids) {
                if (!next.includes(id)) {
                    next.push(id);
                }
            }

            if (prev.length === 0) {
                const saved = loadDesktopIconOrder();
                if (saved) {
                    const cleaned = saved.filter((id) =>
                        ids.includes(id as AppId),
                    ) as AppId[];

                    for (const id of ids) {
                        if (!cleaned.includes(id)) cleaned.push(id);
                    }

                    return cleaned;
                }
            }

            return next;
        });
    }, [items]);

    const onDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        setOrder((prev) => {
            const from = active.id as AppId;
            const to = over.id as AppId;

            const oldIndex = prev.indexOf(from);
            const newIndex = prev.indexOf(to);
            if (oldIndex === -1 || newIndex === -1) return prev;

            const next = arrayMove(prev, oldIndex, newIndex);
            saveDesktopIconOrder(next);
            return next;
        });
    };

    return { order, onDragEnd };
}

function useMarqueeSelection(layerRef: React.RefObject<HTMLElement | null>) {
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [drag, setDrag] = useState<null | {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
    }>(null);

    const onMouseDown = (e: React.MouseEvent) => {
        if (!layerRef.current) return;
        if (e.button === 2) return;

        const target = e.target as HTMLElement;
        if (
            target.closest(".mac-window") ||
            target.closest(".dock") ||
            target.closest("[data-desktop-icon]")
        ) {
            return;
        }

        const bounds = layerRef.current.getBoundingClientRect();
        const startX = e.clientX - bounds.left;
        const startY = e.clientY - bounds.top;

        setDrag({ x1: startX, y1: startY, x2: startX, y2: startY });
        if (!e.shiftKey) setSelected(new Set());

        const onMove = (ev: MouseEvent) => {
            const nx = ev.clientX - bounds.left;
            const ny = ev.clientY - bounds.top;

            setDrag((d) => d && { ...d, x2: nx, y2: ny });

            const rect = {
                left: Math.min(startX, nx),
                top: Math.min(startY, ny),
                width: Math.abs(nx - startX),
                height: Math.abs(ny - startY),
            };

            const icons =
                layerRef.current!.querySelectorAll<HTMLElement>(
                    "[data-icon-id]",
                );

            setSelected((prev: Set<string>) => {
                const next: Set<string> = e.shiftKey
                    ? new Set(prev)
                    : new Set();
                icons.forEach((node) => {
                    const r = node.getBoundingClientRect();
                    const local = {
                        left: r.left - bounds.left,
                        top: r.top - bounds.top,
                        width: r.width,
                        height: r.height,
                    };

                    if (intersects(rect, local)) {
                        next.add(node.dataset.iconId!);
                    }
                });
                return next;
            });
        };

        const onUp = () => {
            setDrag(null);
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
        };

        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
    };

    return { selected, setSelected, drag, onMouseDown };
}

export { useDesktopIconOrder, useMarqueeSelection };

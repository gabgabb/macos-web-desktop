"use client";

import { DesktopIconSortable } from "@/src/_components/Desktop/DesktopIconSortable";
import {
    loadDesktopIconOrder,
    saveDesktopIconOrder,
} from "@/src/core/desktop-icons-persist";
import { useDesktopStore } from "@/src/store/desktop-store";
import {
    DndContext,
    DragEndEvent,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    SortableContext,
    arrayMove,
    rectSortingStrategy,
} from "@dnd-kit/sortable";
import { useMemo, useRef, useState } from "react";

type DesktopItem = {
    id: string;
    appId: "finder" | "notes" | "about";
    icon: string;
    label: string;
};

export function DesktopIcons() {
    const openApp = useDesktopStore((s) => s.openApp);

    const baseItems: DesktopItem[] = useMemo(
        () => [
            { id: "finder", appId: "finder", icon: "🗂️", label: "Finder" },
            { id: "notes", appId: "notes", icon: "📝", label: "Notes" },
            { id: "about", appId: "about", icon: "ℹ️", label: "About" },
        ],
        [],
    );

    const [order, setOrder] = useState<string[]>(() => {
        if (typeof window === "undefined") {
            return baseItems.map((i) => i.id);
        }

        const saved = loadDesktopIconOrder();
        if (!saved) return baseItems.map((i) => i.id);

        const known = new Set(baseItems.map((i) => i.id));
        const cleaned = saved.filter((id) => known.has(id));

        for (const it of baseItems) {
            if (!cleaned.includes(it.id)) cleaned.push(it.id);
        }

        return cleaned;
    });

    const [selected, setSelected] = useState<Set<string>>(new Set());

    const layerRef = useRef<HTMLDivElement | null>(null);
    const [drag, setDrag] = useState<null | {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
    }>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    );

    const items = useMemo(() => {
        const map = new Map(baseItems.map((i) => [i.id, i]));
        return order.map((id) => map.get(id)).filter(Boolean) as DesktopItem[];
    }, [baseItems, order]);

    const marqueeRect = drag
        ? {
              left: Math.min(drag.x1, drag.x2),
              top: Math.min(drag.y1, drag.y2),
              width: Math.abs(drag.x2 - drag.x1),
              height: Math.abs(drag.y2 - drag.y1),
          }
        : null;

    function intersects(a: any, b: any) {
        const ar = a.left + a.width;
        const ab = a.top + a.height;
        const br = b.left + b.width;
        const bb = b.top + b.height;
        return !(ar < b.left || br < a.left || ab < b.top || bb < a.top);
    }

    function onDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over) return;
        if (active.id === over.id) return;

        setOrder((prev) => {
            const oldIndex = prev.indexOf(String(active.id));
            const newIndex = prev.indexOf(String(over.id));
            const next = arrayMove(prev, oldIndex, newIndex);
            saveDesktopIconOrder(next);
            return next;
        });
    }

    return (
        <div
            ref={layerRef}
            className="absolute inset-0 z-[5] px-6 pt-14 pb-24 select-none"
            onMouseDown={(e) => {
                if (!layerRef.current) return;
                if (e.button === 2) return;

                const target = e.target as HTMLElement;

                if (target.closest(".mac-window")) return;
                if (target.closest(".dock")) return;
                if (target.closest("[data-desktop-icon]")) return;

                const bounds = layerRef.current.getBoundingClientRect();
                const x = e.clientX - bounds.left;
                const y = e.clientY - bounds.top;

                setDrag({ x1: x, y1: y, x2: x, y2: y });

                if (!e.shiftKey) setSelected(new Set());

                const onMove = (ev: MouseEvent) => {
                    const nx = ev.clientX - bounds.left;
                    const ny = ev.clientY - bounds.top;

                    setDrag((d) => (d ? { ...d, x2: nx, y2: ny } : d));

                    const rect = {
                        left: Math.min(x, nx),
                        top: Math.min(y, ny),
                        width: Math.abs(nx - x),
                        height: Math.abs(ny - y),
                    };

                    const iconNodes = Array.from(
                        layerRef.current!.querySelectorAll<HTMLElement>(
                            "[data-icon-id]",
                        ),
                    );

                    setSelected((prev) => {
                        const next = new Set(prev);
                        if (!e.shiftKey) next.clear();

                        for (const node of iconNodes) {
                            const id = node.dataset.iconId;
                            if (!id) continue;

                            const r = node.getBoundingClientRect();
                            const local = {
                                left: r.left - bounds.left,
                                top: r.top - bounds.top,
                                width: r.width,
                                height: r.height,
                            };

                            if (intersects(rect, local)) next.add(id);
                        }

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
            }}
            onClick={(e) => {
                const target = e.target as HTMLElement;
                if (target.closest(".mac-window")) return;
                if (target.closest(".dock")) return;
                setSelected(new Set());
            }}
        >
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={onDragEnd}
            >
                <SortableContext items={order} strategy={rectSortingStrategy}>
                    <div className="desktop-icons grid w-fit">
                        {items.map((it) => (
                            <div
                                key={it.id}
                                data-desktop-icon
                                data-icon-id={it.id}
                                className="w-20"
                            >
                                <DesktopIconSortable
                                    id={it.id}
                                    icon={it.icon}
                                    label={it.label}
                                    selected={selected.has(it.id)}
                                    onClick={(id) => {
                                        setSelected((prev) => {
                                            const next = new Set(prev);
                                            if (!prev.has(id)) next.clear();
                                            next.add(id);
                                            return next;
                                        });
                                    }}
                                    onDoubleClick={() => openApp(it.appId)}
                                />
                            </div>
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            {marqueeRect && (
                <div
                    className="pointer-events-none absolute rounded-md border border-blue-400/70 bg-blue-500/15"
                    style={{
                        left: marqueeRect.left,
                        top: marqueeRect.top,
                        width: marqueeRect.width,
                        height: marqueeRect.height,
                    }}
                />
            )}
        </div>
    );
}

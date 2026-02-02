"use client";

import { DesktopIconSortable } from "@/src/_components/Desktop/DesktopIconSortable";
import { APP_ICONS } from "@/src/core/apps/icon-map";
import { useSystemApps } from "@/src/hooks/useSystemApps";
import { useDesktopStore } from "@/src/store/desktop-store";

import { AppDefinition, AppId } from "@/src/core/apps/types";
import {
    useDesktopIconOrder,
    useMarqueeSelection,
} from "@/src/hooks/useDesktopIcons";
import {
    DndContext,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { useMemo, useRef } from "react";

export function DesktopIcons() {
    const openApp = useDesktopStore((s) => s.openApp);
    const layerRef = useRef<HTMLDivElement | null>(null);

    const apps = useSystemApps();

    const desktopApps = useMemo(
        () => apps.filter((a) => a.showOnDesktop),
        [apps],
    );

    const { order, onDragEnd } = useDesktopIconOrder(desktopApps);

    const { selected, setSelected, drag, onMouseDown } =
        useMarqueeSelection(layerRef);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    );

    const orderedApps = useMemo(() => {
        const map = new Map(desktopApps.map((a) => [a.id, a]));
        return order.map((id: string) =>
            map.get(id as AppId),
        ) as AppDefinition[];
    }, [desktopApps, order]);

    const marqueeRect = drag
        ? {
              left: Math.min(drag.x1, drag.x2),
              top: Math.min(drag.y1, drag.y2),
              width: Math.abs(drag.x2 - drag.x1),
              height: Math.abs(drag.y2 - drag.y1),
          }
        : null;

    return (
        <div
            ref={layerRef}
            className="absolute inset-0 z-5 px-6 pt-14 pb-24 select-none"
            onMouseDown={onMouseDown}
        >
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={onDragEnd}
            >
                <SortableContext items={order} strategy={rectSortingStrategy}>
                    <div className="desktop-icons flex h-full w-fit flex-col flex-wrap gap-1">
                        {orderedApps.map((app) => (
                            <div
                                key={app.id}
                                data-desktop-icon
                                data-icon-id={app.id}
                                className="h-fit"
                            >
                                <DesktopIconSortable
                                    id={app.id}
                                    icon={APP_ICONS[app.icon]}
                                    label={app.title}
                                    selected={selected.has(app.id)}
                                    onClick={(id) => {
                                        setSelected((prev) => {
                                            const next = new Set<string>(prev);
                                            if (!prev.has(id)) next.clear();
                                            next.add(id);
                                            return next;
                                        });
                                    }}
                                    onDoubleClick={() => openApp(app.id)}
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

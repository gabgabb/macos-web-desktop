"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import React from "react";

export function DesktopIconSortable({
    id,
    icon,
    label,
    selected,
    onClick,
    onDoubleClick,
}: {
    id: string;
    icon: string;
    label: string;
    selected: boolean;
    onClick: (id: string) => void;
    onDoubleClick: (id: string) => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.6 : 1,
    };

    return (
        <button
            ref={setNodeRef}
            style={style}
            type="button"
            className={clsx(
                "flex w-20 flex-col items-center gap-1 rounded-xl p-2 transition select-none",
                "hover:bg-white/10 active:bg-white/20",
                selected && "bg-blue-500/25 ring-1 ring-blue-400/40",
            )}
            onClick={(e) => {
                e.stopPropagation();
                onClick(id);
            }}
            onDoubleClick={(e) => {
                e.stopPropagation();
                onDoubleClick(id);
            }}
            {...attributes}
            {...listeners}
        >
            <div className="text-3xl">{icon}</div>
            <div className="text-center text-xs leading-tight text-white/90">
                {label}
            </div>
        </button>
    );
}

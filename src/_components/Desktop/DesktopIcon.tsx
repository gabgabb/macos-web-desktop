"use client";

import clsx from "clsx";

export function DesktopIcon({
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
    return (
        <button
            type="button"
            className={clsx(
                "desktop-icon flex w-20 flex-col items-center gap-1 rounded-xl p-2 transition select-none",
                selected
                    ? "bg-blue-500/25 ring-1 ring-blue-400/40"
                    : "hover:bg-white/10",
            )}
            onClick={(e) => {
                e.stopPropagation();
                onClick(id);
            }}
            onDoubleClick={(e) => {
                e.stopPropagation();
                onDoubleClick(id);
            }}
        >
            <div className="text-3xl">{icon}</div>
            <div className="text-center text-xs leading-tight text-white/90">
                {label}
            </div>
        </button>
    );
}

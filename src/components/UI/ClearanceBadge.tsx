import { useDesktopStore } from "@/src/store/desktop-store";
import { useEffect, useRef, useState } from "react";

const LEVEL_COLORS: Record<number, string> = {
    0: "bg-gray-400 text-black",
    1: "bg-yellow-400 text-black",
    2: "bg-orange-500 text-black",
    3: "bg-red-600 text-white",
    4: "bg-red-800 text-white",
    5: "bg-black text-red-500 border border-red-500",
};

export function ClearanceBadge() {
    const level = useDesktopStore((s) => s.progress.clearanceLevel);
    const color = LEVEL_COLORS[level] ?? "bg-purple-600 text-white";

    const prevLevel = useRef(level);
    const [flash, setFlash] = useState<boolean>(false);

    useEffect(() => {
        if (level > prevLevel.current) {
            setFlash(true);
            setTimeout(() => setFlash(false), 800);
        }
        prevLevel.current = level;
    }, [level]);

    return (
        <div
            className={`flex size-7 items-center justify-center rounded-full px-3 py-1 text-xs font-bold tracking-wider ${color} ${flash ? "scale-110 animate-pulse transition" : ""}`}
        >
            {level}
        </div>
    );
}

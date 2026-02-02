"use client";

import { useEffect, useState } from "react";

const DOOMS = [
    {
        id: "doom-ori",
        title: "DOOM (1993)",
        wad: "doom-ori.wad",
        image: "/doom/doom1.webp",
    },
    {
        id: "doom-ud",
        title: "Ultimate DOOM",
        wad: "doom-ud.wad",
        image: "/doom/doom_ue.webp",
    },
    {
        id: "doom2",
        title: "DOOM II",
        wad: "doom2.wad",
        image: "/doom/doom2.webp",
    },
];

export function DoomLauncher({
    onLaunch,
}: {
    onLaunch: (wad: string) => void;
}) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") setIndex((i) => (i + 1) % DOOMS.length);
            if (e.key === "ArrowLeft")
                setIndex((i) => (i - 1 + DOOMS.length) % DOOMS.length);
            if (e.key === "Enter") onLaunch(DOOMS[index].wad);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [index, onLaunch]);

    return (
        <div className="flex h-full w-full flex-col items-center justify-center bg-black text-white">
            <h1 className="mb-6 text-xl font-bold tracking-widest">
                SELECT YOUR DOOM
            </h1>

            <div className="flex gap-6">
                {DOOMS.map((d, i) => (
                    <button
                        key={d.id}
                        onClick={() => onLaunch(d.wad)}
                        className={`w-48 overflow-hidden rounded-xl border transition ${
                            i === index
                                ? "scale-105 border-2 border-red-600"
                                : "border-white/20 opacity-70"
                        }`}
                    >
                        <img
                            src={d.image}
                            alt={d.title}
                            className="h-48 w-full object-cover"
                        />
                        <div className="bg-black/80 p-2 text-center font-semibold">
                            {d.title}
                        </div>
                    </button>
                ))}
            </div>

            <div className="mt-6 text-xs opacity-60">
                ← → select • ENTER launch
            </div>
            <div className="mt-4 flex items-center justify-center text-center text-xs opacity-60">
                WASD / ZQSD • Move & strafe
                <br />
                Mouse • Look around
                <br />
                Shift • Run • Ctrl / Click • Fire
                <br />
                Space / E • Use • Esc • Exit mouse
            </div>
        </div>
    );
}

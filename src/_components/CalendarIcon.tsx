"use client";

import { useLiveClock } from "@/src/hooks/useLiveClock";

export function CalendarIcon() {
    const { MMM, dayDigit } = useLiveClock();

    return (
        <div className="flex size-12 flex-col overflow-hidden rounded-xl bg-white text-black shadow">
            <div className="flex h-1/3 items-center justify-center bg-red-600 text-[10px] font-bold tracking-wide text-white">
                {MMM}
            </div>

            <div className="flex flex-1 items-center justify-center text-2xl font-bold">
                {dayDigit}
            </div>
        </div>
    );
}

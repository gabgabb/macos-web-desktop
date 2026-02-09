import { useLiveClock } from "@/src/hooks/useLiveClock";

export function CalendarIcon() {
    const { MMM, dayDigit } = useLiveClock();

    return (
        <div className="h-full w-full rounded-xl bg-white shadow">
            <div className="flex h-[40%] items-center justify-center rounded-t-xl bg-red-600 text-[70%] font-bold text-white">
                {MMM}
            </div>
            <div className="flex h-[60%] items-center justify-center text-[100%] font-bold text-black">
                {dayDigit}
            </div>
        </div>
    );
}

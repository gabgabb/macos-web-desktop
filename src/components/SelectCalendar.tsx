import { MoveLeft, MoveRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Option = {
    label: string;
    value: number;
};

type CalendarSelectProps = {
    value: number;
    options: Option[];
    onChange: (v: number) => void;
    isMonth?: boolean;
    onPrevMonth?: () => void;
    onNextMonth?: () => void;
};

export function SelectCalendar({
    value,
    options,
    onChange,
    isMonth = false,
    onPrevMonth = () => {},
    onNextMonth = () => {},
}: CalendarSelectProps) {
    const [open, setOpen] = useState<boolean>(false);
    const ref = useRef<HTMLDivElement>(null);
    const selected = options.find((o) => o.value === value);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={ref} className="relative">
            {isMonth ? (
                <div className="flex items-center justify-center gap-1 rounded-lg bg-white/10 px-3 py-2 text-sm backdrop-blur hover:bg-white/20">
                    <button onClick={onPrevMonth} aria-label="Previous month">
                        <MoveLeft className="size-4" />
                    </button>
                    <button onClick={() => setOpen((v) => !v)} className="w-20">
                        <span>{selected?.label}</span>
                    </button>
                    <button onClick={onNextMonth} aria-label="Next month">
                        <MoveRight className="size-4" />
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => setOpen((v) => !v)}
                    className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm backdrop-blur hover:bg-white/20"
                >
                    <span>{selected?.label}</span>
                </button>
            )}

            {open && (
                <div className="absolute z-10 mt-1 max-h-48 w-40 overflow-y-auto rounded-xl bg-neutral-900 shadow-lg">
                    {options.map((o) => (
                        <button
                            key={o.value}
                            onClick={() => {
                                onChange(o.value);
                                setOpen(false);
                            }}
                            className={`w-full px-3 py-1.5 text-left text-sm transition hover:bg-white/10 ${
                                o.value === value ? "bg-white/10" : ""
                            }`}
                        >
                            {o.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

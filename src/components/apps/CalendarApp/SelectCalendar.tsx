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
        <div ref={ref} className="relative text-(--text-primary)">
            {isMonth ? (
                <div
                    data-testid={"month-select"}
                    className="bg-background flex items-center justify-center gap-1 rounded-lg border border-(--border-control)/30 px-3 py-2 text-sm shadow hover:bg-(--border-soft)/10"
                >
                    <button onClick={onPrevMonth} aria-label="Previous month">
                        <MoveLeft className="size-4" />
                    </button>
                    <button
                        onClick={() => setOpen((v) => !v)}
                        className="w-20 font-bold"
                    >
                        <span>{selected?.label}</span>
                    </button>
                    <button onClick={onNextMonth} aria-label="Next month">
                        <MoveRight className="size-4" />
                    </button>
                </div>
            ) : (
                <button
                    data-testid={"month-select"}
                    onClick={() => setOpen((v) => !v)}
                    className="bg-background flex items-center gap-2 rounded-lg border border-(--border-control)/30 px-3 py-2 text-sm shadow backdrop-blur hover:bg-(--border-soft)/10"
                >
                    <span className="font-bold">{selected?.label}</span>
                </button>
            )}

            {open && (
                <div className="bg-background absolute z-10 mt-1 max-h-48 w-40 overflow-y-auto rounded-xl border border-(--border-control) shadow-lg">
                    {options.map((o) => (
                        <button
                            data-testid={`select-option-${o.value}`}
                            key={o.value}
                            onClick={() => {
                                onChange(o.value);
                                setOpen(false);
                            }}
                            className={`w-full px-3 py-1.5 text-left text-sm transition hover:bg-(--border-soft) ${
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

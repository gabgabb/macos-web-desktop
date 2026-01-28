"use client";

import { SelectCalendar } from "@/src/_components/SelectCalendar";
import { motion } from "framer-motion";
import { useState } from "react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

type CalendarEvent = {
    id: string;
    title: string;
};

const EVENTS: Record<string, CalendarEvent[]> = {
    "2025-01-15": [{ id: "1", title: "Meeting" }],
    "2025-01-22": [{ id: "2", title: "Doctor" }],
    "2025-02-03": [{ id: "3", title: "Birthday 🎉" }],
    "2026-01-30": [{ id: "4", title: "Meeting" }],
};

export function CalendarApp() {
    const today = new Date();

    const [month, setMonth] = useState(today.getMonth());
    const [year, setYear] = useState(today.getFullYear());
    const [direction, setDirection] = useState<"prev" | "next">("next");

    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const startOffset = (firstDayOfMonth.getDay() + 6) % 7;

    function dateKey(day: number) {
        return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    }

    function handleOpenEvent(day: number) {
        const key = dateKey(day);
        const events = EVENTS[key];
        if (!events) return;
    }

    const CURRENT_YEAR = new Date().getFullYear();
    const YEAR_RANGE = 20;

    const YEAR_OPTIONS = Array.from({ length: YEAR_RANGE * 2 + 1 }).map(
        (_, i) => {
            const y = CURRENT_YEAR - i;
            return { label: `${y}`, value: y };
        },
    );

    function changeMonth(delta: number) {
        setDirection(delta > 0 ? "next" : "prev");

        setMonth((prev) => {
            const next = prev + delta;

            if (next < 0) {
                setYear((y) => y - 1);
                return 11;
            }

            if (next > 11) {
                setYear((y) => y + 1);
                return 0;
            }

            return next;
        });
    }

    function isToday(day: number) {
        const today = new Date();
        return (
            today.getDate() === day &&
            today.getMonth() === month &&
            today.getFullYear() === year
        );
    }
    return (
        <div className="p-3 text-white">
            <div className="mb-8 flex items-center justify-center gap-2">
                <SelectCalendar
                    value={month}
                    onChange={(m) => {
                        setDirection(m > month ? "next" : "prev");
                        setMonth(m);
                    }}
                    options={MONTHS.map((m, i) => ({ label: m, value: i }))}
                    isMonth
                    changeMonth={changeMonth}
                />

                <SelectCalendar
                    value={year}
                    onChange={setYear}
                    options={YEAR_OPTIONS}
                />
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs opacity-70">
                {DAYS.map((d) => (
                    <div key={d}>{d}</div>
                ))}
            </div>

            <motion.div
                key={`${year}-${month}`}
                initial={{ x: direction === "next" ? 40 : -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-2 grid grid-cols-7 gap-1"
            >
                {Array.from({ length: startOffset }).map((_, i) => (
                    <div key={`empty-${i}`} />
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const key = dateKey(day);
                    const hasEvent = !!EVENTS[key];

                    return (
                        <button
                            key={day}
                            onClick={() => handleOpenEvent(day)}
                            className={`relative h-9 rounded text-sm transition ${
                                hasEvent
                                    ? "bg-emerald-500/30 hover:bg-emerald-500/50"
                                    : "hover:bg-white/10"
                            }`}
                        >
                            <span className="relative inline-flex items-center justify-center">
                                <span className="z-2">{day}</span>

                                {isToday(day) && (
                                    <span className="pointer-events-none absolute size-8 rounded-full bg-purple-600" />
                                )}
                            </span>
                            {hasEvent && (
                                <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-emerald-400" />
                            )}
                        </button>
                    );
                })}
            </motion.div>
        </div>
    );
}

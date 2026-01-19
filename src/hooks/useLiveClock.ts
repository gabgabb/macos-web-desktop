"use client";

import { useEffect, useMemo, useState } from "react";

export function useLiveClock(options?: { tickMs?: number; locale?: string }) {
    const tickMs = options?.tickMs ?? 1000;
    const locale = options?.locale ?? "en-US";

    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        const id = window.setInterval(() => setNow(new Date()), tickMs);
        return () => window.clearInterval(id);
    }, [tickMs]);

    const hhmm = useMemo(() => {
        return new Intl.DateTimeFormat(locale, {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        }).format(now);
    }, [now, locale]);

    const dateLong = useMemo(() => {
        return new Intl.DateTimeFormat(locale, {
            weekday: "long",
            day: "numeric",
            month: "long",
        }).format(now);
    }, [now, locale]);

    const menuBarTime = useMemo(() => {
        const weekday = new Intl.DateTimeFormat(locale, {
            weekday: "short",
        }).format(now);

        const month = new Intl.DateTimeFormat(locale, {
            month: "short",
        }).format(now);

        const day = new Intl.DateTimeFormat(locale, {
            day: "2-digit",
        }).format(now);

        const hourMin = new Intl.DateTimeFormat(locale, {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        }).format(now);

        return `${weekday} ${month} ${day} ${hourMin}`;
    }, [now, locale]);

    return {
        now,
        hhmm,
        dateLong,
        menuBarTime,
    };
}

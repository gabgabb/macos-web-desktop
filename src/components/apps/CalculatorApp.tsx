"use client";

import { useState } from "react";

export function CalculatorApp() {
    const [value, setValue] = useState("0");

    function input(v: string) {
        setValue((prev) => (prev === "0" ? v : prev + v));
    }

    function compute() {
        try {
            setValue(String(eval(value)));
        } catch {
            setValue("Error");
        }
    }

    return (
        <div className="z-1 h-full bg-(--sidebar) text-white">
            <div className="z-2 mb-2 border-b border-(--border-control)/50 p-2 text-right text-3xl text-(--text-primary)">
                {value}
            </div>

            <div className="grid grid-cols-4 gap-2 px-2">
                {"789/456*123-0.=+".split("").map((c) => (
                    <button
                        key={c}
                        className="rounded border border-(--border-control)/50 bg-(--window) p-2 text-(--text-primary) hover:bg-(--bg-row-even)"
                        onClick={() => (c === "=" ? compute() : input(c))}
                    >
                        {c}
                    </button>
                ))}
                <button
                    className="rounded border border-(--border-control)/50 bg-(--window) p-2 text-(--text-primary) hover:bg-(--bg-row-even)"
                    onClick={() => setValue("0")}
                >
                    C
                </button>
            </div>
        </div>
    );
}

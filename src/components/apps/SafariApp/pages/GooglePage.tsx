"use client";

import { SafariController } from "@/src/core/apps/types";
import { useState } from "react";

export function GooglePage({ safari }: { safari: SafariController }) {
    const [query, setQuery] = useState("");

    return (
        <div className="bg-background flex h-full flex-col items-center justify-center text-black">
            <h1 className="mb-8 text-6xl font-bold">
                <span className="text-blue-500">G</span>
                <span className="text-red-500">o</span>
                <span className="text-yellow-500">o</span>
                <span className="text-blue-500">g</span>
                <span className="text-green-500">l</span>
                <span className="text-red-500">e</span>
            </h1>

            <input
                className="w-full max-w-xl rounded-full border border-(--border-control) px-6 py-3 text-(--text-primary) shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Google"
                onKeyDown={(e) => {
                    if (e.key === "Enter" && query.trim()) {
                        safari.push({
                            kind: "page",
                            url: `https://google.com/search?q=${encodeURIComponent(query)}`,
                        });
                    }
                }}
            />
        </div>
    );
}

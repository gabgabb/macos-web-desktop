"use client";

import { SafariController } from "@/src/core/apps/types";
import Image from "next/image";
import { useRef, useState } from "react";

export function SafariHome({ safari }: { safari: SafariController }) {
    const [localQuery, setLocalQuery] = useState<string>("");
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement | null>(null);

    return (
        <div
            onClick={() => setShowSuggestions(false)}
            className="relative flex h-full w-full items-center justify-center overflow-hidden text-(--text-primary)"
        >
            <Image
                src="/bg-safari.webp"
                alt="Safari background"
                fill
                priority
                sizes="100vw"
                className="object-cover"
            />
            <div className="absolute inset-0" />

            <div
                onClick={(e) => e.stopPropagation()}
                className="relative z-10 w-full max-w-2xl rounded-2xl border border-white/10 bg-white/10 px-6 py-6 backdrop-blur-md"
            >
                <div ref={containerRef} className="relative mb-6 w-full">
                    <input
                        placeholder="Search with Google"
                        value={localQuery}
                        onChange={(e) => setLocalQuery(e.target.value)}
                        className="mb-2 w-full rounded-full border border-(--border-control) bg-white/90 px-5 py-3 text-sm text-black transition-all outline-none focus:shadow-lg focus:ring-2 focus:ring-blue-400"
                        onFocus={() => setShowSuggestions(true)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && localQuery.trim()) {
                                safari.navigateInput(localQuery);
                                setShowSuggestions(false);
                            }
                        }}
                    />
                    {localQuery && showSuggestions && (
                        <div className="absolute top-full right-0 left-0 z-50 rounded-2xl bg-white p-2 text-black shadow-xl">
                            <p
                                className="cursor-pointer rounded-md px-3 py-2 hover:bg-gray-200"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    safari.navigateInput(localQuery);
                                    setShowSuggestions(false);
                                }}
                            >
                                Search Google for "{localQuery}"
                            </p>

                            <p
                                className="cursor-pointer rounded-md px-3 py-2 hover:bg-gray-200"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    safari.navigateInput(
                                        `https://${localQuery}.com`,
                                    );
                                    setShowSuggestions(false);
                                }}
                            >
                                Go to https://{localQuery}.com
                            </p>
                        </div>
                    )}
                </div>
                <h2 className="mb-3 text-sm font-semibold text-white/80">
                    Favorites
                </h2>

                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() =>
                            safari.navigateInput("https://chat.openai.com")
                        }
                        className="flex flex-col items-center gap-2 rounded-xl p-2 transition-all hover:scale-105 hover:bg-white/20 active:scale-95"
                    >
                        <Image
                            src="/icones/chatgpt.webp"
                            alt="ChatGPT"
                            width={64}
                            height={64}
                            className="size-16 rounded-xl"
                        />
                        <span className="text-xs text-white">ChatGPT</span>
                    </button>

                    <button
                        onClick={() =>
                            safari.navigateInput("https://google.com")
                        }
                        className="flex flex-col items-center gap-2 rounded-xl p-2 transition-all hover:scale-105 hover:bg-white/20 active:scale-95"
                    >
                        <Image
                            src="/icones/google.webp"
                            alt="Google"
                            width={64}
                            height={64}
                            className="size-16 rounded-xl"
                        />
                        <span className="text-xs text-white">Google</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

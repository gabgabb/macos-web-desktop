"use client";

import { MoveLeft, MoveRight, RotateCw } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

const PAGES: Record<string, { title: string; body: string }> = {};

export function SafariApp() {
    const [url, setUrl] = useState("");
    const page = useMemo(() => PAGES[url] ?? null, [url]);

    return (
        <div className="z-15 flex h-full flex-col overflow-y-auto overscroll-contain bg-white/10 text-white">
            <div className="flex items-center gap-2 border-b border-white/10 bg-white/10 px-3 py-2">
                <button className="rounded-lg px-2 py-1 hover:bg-white/10">
                    <MoveLeft className="h-4 w-4" />
                </button>
                <button className="rounded-lg px-2 py-1 hover:bg-white/10">
                    <MoveRight className="h-4 w-4" />
                </button>
                <button
                    className="rounded-lg px-2 py-1 hover:bg-white/10"
                    onClick={() => setUrl("")}
                >
                    <RotateCw className="h-4 w-4" />
                </button>

                <input
                    value={url}
                    id="safari-url-bar"
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            const cleaned = url.trim();
                            setUrl(cleaned.length ? cleaned : "");
                        }
                    }}
                    className="ml-2 w-full rounded-xl border border-white/10 bg-white/15 px-3 py-2 text-sm outline-none placeholder:text-white/80"
                    placeholder="Search or enter website name"
                />
            </div>

            <div className="relative flex-1 overflow-hidden">
                <Image
                    src="/bg-safari.webp"
                    alt="Safari content background"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
                />

                <div className="absolute inset-0 bg-black/30" />

                <div className="z-1 mx-0 flex h-full items-center justify-center overflow-auto px-6">
                    <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-md">
                        <h2 className="text-lg font-semibold">Favorites</h2>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
                            <button className="mt-3 flex flex-col items-center justify-center gap-1">
                                <Image
                                    src={"/icones/chatgpt.webp"}
                                    alt={"ChatGPT"}
                                    width={64}
                                    height={64}
                                    priority
                                    className="w-16 justify-center rounded-xl"
                                />
                                <span className="text-center text-xs font-light">
                                    ChatGPT
                                </span>
                            </button>
                            <button className="mt-3 flex flex-col items-center justify-center gap-1">
                                <Image
                                    src={"/icones/google.webp"}
                                    alt={"Google"}
                                    width={64}
                                    height={64}
                                    priority
                                    className="w-16 justify-center rounded-xl"
                                />
                                <span className="text-center text-xs font-light">
                                    Google
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

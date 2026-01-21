"use client";

import { MoveLeft, MoveRight, RotateCw } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

const PAGES: Record<string, { title: string; body: string }> = {
    "about:blank": {
        title: "New Tab",
        body: "Welcome to Safari (fake). Type a URL like:\n\n- aurora://home\n- aurora://docs\n- aurora://login",
    },
    "aurora://home": {
        title: "AURORA Intranet",
        body: "✅ Connected to internal network.\n\nNews:\n- Project AURORA status: ACTIVE\n- Security level: 3\n\nHint: try aurora://docs",
    },
    "aurora://docs": {
        title: "Documents",
        body: "📁 Internal documents\n\n- Protocol_01.pdf (restricted)\n- AURORA-Key.txt (encrypted)\n- ethics_report.md\n\nHint: try aurora://login",
    },
    "aurora://login": {
        title: "Login",
        body: "🔒 Please enter the access code.\n\n(Hint: maybe the Terminal can help?)",
    },
};

export function SafariApp() {
    const [url, setUrl] = useState("");
    const page = useMemo(() => PAGES[url] ?? null, [url]);

    return (
        <div className="z-15 flex h-full flex-col bg-white/10 text-white">
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
                    src="/Wallpaper/background-safarii.webp"
                    alt="Safari content background"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
                />

                <div className="absolute inset-0 bg-black/30" />

                <div className="relative z-1 h-full overflow-auto p-4">
                    <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                        <h2 className="text-lg font-semibold">
                            AURORA Intranet
                        </h2>
                        <p className="mt-2 text-sm text-white/80">
                            Hello 👋 this is a fake website.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

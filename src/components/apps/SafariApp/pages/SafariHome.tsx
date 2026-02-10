"use client";

import Image from "next/image";

export function SafariHome({
    onSearch,
    navigate,
}: {
    onSearch: (query: string) => void;
    navigate: (url: string) => void;
}) {
    return (
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden text-(--text-primary)">
            <Image
                src="/bg-safari.webp"
                alt="Safari background"
                fill
                priority
                sizes="100vw"
                className="object-cover"
            />
            <div className="absolute inset-0 bg-black/30" />

            <div className="relative z-10 w-full max-w-2xl rounded-2xl border border-white/10 bg-white/10 px-6 py-6 backdrop-blur-md">
                <input
                    type="text"
                    placeholder="Search with Google"
                    className="mb-6 w-full rounded-full border border-white/10 bg-white px-5 py-3 text-sm text-black outline-none"
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            const value = (
                                e.target as HTMLInputElement
                            ).value.trim();
                            if (value) onSearch(value);
                        }
                    }}
                />

                <h2 className="mb-3 text-sm font-semibold text-white/80">
                    Favorites
                </h2>

                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => navigate("https://chat.openai.com")}
                        className="flex flex-col items-center gap-1 rounded-xl p-2 hover:bg-white/10"
                    >
                        <Image
                            src="/icones/chatgpt.webp"
                            alt="ChatGPT"
                            width={64}
                            height={64}
                            className="rounded-xl"
                        />
                        <span className="text-xs font-light">ChatGPT</span>
                    </button>

                    <button
                        onClick={() => navigate("https://google.com")}
                        className="flex flex-col items-center gap-1 rounded-xl p-2 hover:bg-white/10"
                    >
                        <Image
                            src="/icones/google.webp"
                            alt="Google"
                            width={64}
                            height={64}
                            className="rounded-xl"
                        />
                        <span className="text-xs font-light">Google</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

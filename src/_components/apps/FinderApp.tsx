"use client";

type FinderItem =
    | { id: string; type: "folder"; name: string }
    | { id: string; type: "file"; name: string; ext: "txt" | "png" | "pdf" };

const ITEMS: FinderItem[] = [
    { id: "doc", type: "folder", name: "Documents" },
    { id: "dl", type: "folder", name: "Downloads" },
    { id: "img", type: "file", name: "wallpaper", ext: "png" },
    { id: "readme", type: "file", name: "readme", ext: "txt" },
];

function iconFor(it: FinderItem) {
    if (it.type === "folder") return "📁";
    if (it.ext === "png") return "🖼️";
    if (it.ext === "pdf") return "📄";
    return "📄";
}

export function FinderApp() {
    return (
        <div className="h-full w-full">
            <div className="grid grid-cols-4 gap-4">
                {ITEMS.map((it) => (
                    <button
                        key={it.id}
                        className="rounded-xl p-2 transition hover:bg-white/10"
                    >
                        <div className="text-5xl">{iconFor(it)}</div>
                        <div className="mt-2 truncate text-xs text-white/90">
                            {it.type === "file"
                                ? `${it.name}.${it.ext}`
                                : it.name}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}

"use client";

import { FileStorage } from "@/src/core/fs/fileStorage";
import DOMPurify from "dompurify";
import { useEffect, useState } from "react";

export function TextFileViewer({
    file,
}: {
    file: { name: string; path: string[] };
}) {
    const [content, setContent] = useState("");
    const [mode, setMode] = useState<"render" | "source">("render");

    const ext = file.name.split(".").pop()?.toLowerCase();
    const isHtml = ext === "html";
    const isText = ext === "txt" || ext === "md" || ext === "css";

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                const text = await FileStorage.readText([
                    ...file.path,
                    file.name,
                ]);
                if (!cancelled) {
                    setContent(text);
                }
            } catch {
                if (!cancelled) {
                    setContent("");
                }
            }
        }

        load();

        return () => {
            cancelled = true;
        };
    }, [file.name, file.path.join("/")]);

    if (isHtml) {
        const clean = DOMPurify.sanitize(content);

        return (
            <div className="flex h-full w-full flex-col gap-4 overflow-auto p-3">
                <button
                    onClick={() =>
                        setMode((m) => (m === "render" ? "source" : "render"))
                    }
                    className="rounded-md bg-black/20 px-3 py-1 text-sm"
                >
                    {mode === "render" ? "View source" : "Render HTML"}
                </button>
                {mode === "source" ? (
                    <div
                        className="prose h-full w-full resize-none overflow-auto rounded-xl border-white/10 bg-black/20 p-4 font-mono text-sm"
                        dangerouslySetInnerHTML={{ __html: clean }}
                    />
                ) : (
                    <textarea
                        value={content}
                        readOnly
                        className="prose h-full w-full resize-none overflow-auto rounded-xl border-white/10 bg-black/20 p-4 font-mono text-sm outline-none"
                    />
                )}
            </div>
        );
    }

    if (isText) {
        return (
            <div className="h-full w-full overflow-auto p-4">
                <textarea
                    value={content}
                    readOnly
                    className="h-full w-full resize-none rounded-xl border border-white/10 bg-black/20 p-3 font-mono outline-none"
                />
            </div>
        );
    }

    return (
        <div className="flex h-full items-center justify-center text-white/50">
            Unsupported file type
        </div>
    );
}

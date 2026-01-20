"use client";

import { useDesktopStore } from "@/src/store/desktop-store";

export function NotesApp() {
    const content = useDesktopStore((s) => s.notes.content);
    const setContent = useDesktopStore((s) => s.setNotes);

    return (
        <div className="h-full w-full">
            <textarea
                className="h-full w-full resize-none rounded-xl border border-white/10 bg-black/20 p-3 outline-none"
                placeholder="Write something..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
        </div>
    );
}

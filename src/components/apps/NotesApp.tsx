"use client";

import { useDesktopStore } from "@/src/store/desktop-store";

export function NotesApp() {
    const content = useDesktopStore((s) => s.notes.content);
    const setContent = useDesktopStore((s) => s.setNotes);

    return (
        <div className="h-full w-full">
            <textarea
                id={"notes"}
                className="bg-background h-full w-full resize-none rounded-xl border border-(--border-control)/20 p-3 text-(--text-primary) shadow-(--shadow-window) outline-none"
                placeholder="Write something..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
        </div>
    );
}

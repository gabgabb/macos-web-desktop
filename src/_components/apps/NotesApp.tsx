"use client";

export function NotesApp() {
    return (
        <div className="h-full w-full">
            <textarea
                className="h-full w-full resize-none rounded-xl border border-white/10 bg-black/20 p-3 outline-none"
                placeholder="Write something..."
            />
        </div>
    );
}

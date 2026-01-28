export function TypingIndicator({ author }: { author: string }) {
    return (
        <div className="flex items-center gap-2 text-sm">
            <b>{author}:</b>
            <span className="flex items-center gap-1 rounded-full bg-gray-300 px-2 py-2">
                <span className="size-1.5 animate-bounce rounded-full bg-gray-400" />
                <span className="size-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:0.15s]" />
                <span className="size-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:0.25s]" />
            </span>
        </div>
    );
}

export function UnreadBadge({ count }: { count: number }) {
    if (count <= 0) return null;

    return (
        <span className="ml-auto flex min-w-4.5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {count}
        </span>
    );
}

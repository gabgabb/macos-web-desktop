import { Conversation, USER_COLORS, USERS } from "@/src/core/chatData";
import clsx from "clsx";
import Image from "next/image";

export function markConversationAsRead(c: Conversation) {
    return {
        ...c,
        unreadCount: 0,
        messages: c.messages.map((m) => (m.read ? m : { ...m, read: true })),
    };
}

export function ReactionToMessage({
    emoji,
    number,
}: {
    emoji: string;
    number: number;
}) {
    return (
        <span className="cursor-pointer rounded-md border border-gray-300 bg-gray-400/10 p-1 transition-colors hover:bg-gray-400/20">
            {emoji} {number > 0 && `${number}`}
        </span>
    );
}

export function DaySeparator({ date }: { date?: string }) {
    if (!date) return null;

    return (
        <div className="my-4 flex items-center gap-3">
            <div className="flex-1 border-t border-gray-300/40" />
            <span className="text-xs text-gray-500">
                {new Date(date).toLocaleDateString(undefined, {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                })}
            </span>
            <div className="flex-1 border-t border-gray-300/40" />
        </div>
    );
}

export function TypingRow({
    authorId,
    showAvatar = true,
}: {
    authorId: string;
    showAvatar?: boolean;
}) {
    const user = USERS[authorId] ?? USERS["unknown"];

    return (
        <div className="flex gap-3">
            <div className="w-10 shrink-0">
                {showAvatar && (
                    <Image
                        unoptimized
                        src={user?.avatar}
                        alt={user?.name}
                        width={40}
                        height={40}
                        className="size-10 rounded-md"
                    />
                )}
            </div>

            <div className="flex flex-col gap-1">
                <span
                    className={clsx(
                        "text-sm font-semibold",
                        getUserColor(authorId),
                    )}
                >
                    {user.name}
                </span>

                <div className="flex w-fit items-center gap-1 rounded-full bg-gray-200 px-2 py-2">
                    <span className="size-1.5 animate-bounce rounded-full bg-gray-400" />
                    <span className="size-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:0.15s]" />
                    <span className="size-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:0.3s]" />
                </div>
            </div>
        </div>
    );
}

export function renderWithMentions(text: string) {
    return text.split(/(@\w+)/g).map((part, i) => {
        if (part.startsWith("@")) {
            return (
                <span
                    key={i}
                    className="rounded bg-blue-500/10 px-1.5 py-0.5 text-blue-600"
                >
                    {part}
                </span>
            );
        }
        return <span key={i}>{part}</span>;
    });
}

export function getUserColor(name: string) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return USER_COLORS[Math.abs(hash) % USER_COLORS.length];
}

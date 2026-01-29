import { Conversation } from "@/src/core/chatData";
import { LockIcon } from "lucide-react";

export function ConversationItem({
    convo,
    handleSelectConversation,
    activeConversationId,
}: {
    convo: Conversation;
    handleSelectConversation: (id: string) => void;
    activeConversationId: string | null;
}) {
    return (
        <li
            onClick={() => handleSelectConversation(convo.id)}
            className={`flex cursor-pointer items-center gap-2 rounded px-1 py-1 hover:bg-white/10 ${activeConversationId === convo.id && "bg-white/20"} ${!convo.unlocked && "cursor-not-allowed! opacity-40"} `}
        >
            <span className="flex items-center gap-1">
                {convo.type === "channel" ? (
                    convo.unlocked ? (
                        "# "
                    ) : (
                        <LockIcon
                            className="mt-0.5 size-3"
                            color="currentColor"
                        />
                    )
                ) : (
                    "@"
                )}
                {convo.name}
            </span>

            <UnreadBadge count={convo.unreadCount} />
        </li>
    );
}

function UnreadBadge({ count }: { count: number }) {
    if (count <= 0) return null;

    return (
        <span className="pl-0.1 ml-auto flex min-w-4.5 items-center justify-center rounded-full bg-red-500 py-0.5 text-[10px] font-bold text-white">
            {count}
        </span>
    );
}

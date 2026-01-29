import {
    getUserColor,
    ReactionToMessage,
    renderWithMentions,
} from "@/src/_components/apps/SlackApp/logic/MessageFunctions";
import { Message, USERS } from "@/src/core/chatData";
import clsx from "clsx";
import Image from "next/image";

export function MessageRow({
    msg,
    showAvatar,
}: {
    msg: Message;
    showAvatar: boolean;
}) {
    const user = USERS[msg.authorId];
    return (
        <div className="flex gap-3 rounded-md">
            <div className="w-10 shrink-0">
                {showAvatar && (
                    <Image
                        unoptimized
                        src={user.avatar}
                        alt={user.name}
                        width={40}
                        height={40}
                        className="size-10 rounded-md"
                    />
                )}
            </div>

            <div className="flex flex-col gap-1">
                {showAvatar && (
                    <div className="flex items-baseline gap-2">
                        <span
                            className={clsx(
                                "font-semibold",
                                getUserColor(msg.authorId),
                            )}
                        >
                            {user.name}
                        </span>
                        <span className="text-xs text-gray-400">
                            {msg.timestamp}
                        </span>
                    </div>
                )}

                <p className="line-clamp-5 w-80 text-sm leading-relaxed">
                    {renderWithMentions(msg.content)}
                </p>

                {msg.reactions && msg.reactions.length > 0 && (
                    <div className="mt-1 flex gap-3 text-xs text-gray-400">
                        {msg.reactions.map((r, i) => (
                            <ReactionToMessage
                                key={i}
                                emoji={r.emoji}
                                number={r.count}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

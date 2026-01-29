import { MessageRow } from "@/src/_components/apps/SlackApp/components/MessageRow";
import {
    DaySeparator,
    TypingRow,
} from "@/src/_components/apps/SlackApp/logic/MessageFunctions";
import { Conversation } from "@/src/core/chatData";
import { useDesktopStore } from "@/src/store/desktop-store";

export function MessageList({ conversation }: { conversation: Conversation }) {
    const typing = useDesktopStore((s) => s.slack?.typing);

    return (
        <div className="flex grow flex-col overflow-y-auto px-6 py-2 text-sm text-neutral-900">
            {conversation.messages.map((msg, index) => {
                const prev = conversation.messages[index - 1];
                const showDaySeparator = !prev || prev.date !== msg.date;
                const isSameAuthor = prev && prev.authorId === msg.authorId;
                const isSameDay = prev && prev.date === msg.date;

                const marginTop =
                    !prev || !isSameDay
                        ? "mt-4"
                        : isSameAuthor
                          ? "mt-0.5"
                          : "mt-3";

                return (
                    <div key={msg.id}>
                        {showDaySeparator && <DaySeparator date={msg.date} />}
                        <div className={marginTop}>
                            <MessageRow
                                msg={msg}
                                showAvatar={!isSameAuthor || !isSameDay}
                            />
                        </div>
                    </div>
                );
            })}

            {typing && typing.conversationId === conversation.id && (
                <TypingRow authorId={typing.authorId} showAvatar />
            )}
        </div>
    );
}

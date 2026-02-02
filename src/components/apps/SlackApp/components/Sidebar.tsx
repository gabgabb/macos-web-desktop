import { ConversationItem } from "@/src/components/apps/SlackApp/logic/SidebarFunctions";
import { Conversation } from "@/src/core/apps/chatData";

export function Sidebar({
    conversations,
    handleSelectConversation,
    activeConversationId,
}: {
    conversations: Conversation[];
    handleSelectConversation: (id: string) => void;
    activeConversationId: string | null;
}) {
    return (
        <aside className="z-20 flex w-64 flex-col gap-2 rounded-r-2xl bg-linear-to-b from-purple-900 to-pink-900 p-3 shadow-2xl">
            <div className="flex flex-col gap-2">
                <div className="font-semibold">Channels</div>
                <ul className="flex flex-col gap-1 text-sm">
                    {conversations
                        .filter((c) => c.type === "channel")
                        .map((c) => (
                            <ConversationItem
                                key={c.id}
                                convo={c}
                                handleSelectConversation={
                                    handleSelectConversation
                                }
                                activeConversationId={activeConversationId}
                            />
                        ))}
                </ul>

                <div className="mt-4 font-semibold">Direct messages</div>
                <ul className="flex flex-col gap-1 text-sm">
                    {conversations
                        .filter((c) => c.type === "dm")
                        .map((c) => (
                            <ConversationItem
                                key={c.id}
                                convo={c}
                                handleSelectConversation={
                                    handleSelectConversation
                                }
                                activeConversationId={activeConversationId}
                            />
                        ))}
                </ul>
            </div>
        </aside>
    );
}

import { ChatHeader } from "@/src/components/apps/SlackApp/components/ChatHeader";
import { InputSlack } from "@/src/components/apps/SlackApp/components/InputSlack";
import { MessageList } from "@/src/components/apps/SlackApp/components/MessageList";
import { Sidebar } from "@/src/components/apps/SlackApp/components/Sidebar";
import { useActiveConversation } from "@/src/components/apps/SlackApp/hooks/useActiveConversation";
import { useChatEvents } from "@/src/components/apps/SlackApp/hooks/useChatEvents";
import { useSlackIntro } from "@/src/components/apps/SlackApp/hooks/useSlackIntro";

export function SlackApp() {
    const { handleChatEvent } = useChatEvents();
    useSlackIntro(handleChatEvent);

    const {
        conversations,
        activeConversation,
        activeConversationId,
        selectConversation,
    } = useActiveConversation();

    return (
        <div className="flex h-full w-full bg-gray-100">
            <Sidebar
                conversations={conversations}
                handleSelectConversation={selectConversation}
                activeConversationId={activeConversationId}
            />

            <main className="flex h-full w-full flex-col">
                <ChatHeader activeConversation={activeConversation} />
                <MessageList conversation={activeConversation} />
                <InputSlack activeConversation={activeConversation} />
            </main>
        </div>
    );
}

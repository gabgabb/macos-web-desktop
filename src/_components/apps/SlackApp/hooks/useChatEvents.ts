import { addMessageToConversation } from "@/src/_components/apps/SlackApp/logic/MessageFunctions";
import { ChatEvent } from "@/src/core/chatData";
import { useDesktopStore } from "@/src/store/desktop-store";

export function useChatEvents() {
    const startTyping = useDesktopStore((s) => s.startTyping);
    const stopTyping = useDesktopStore((s) => s.stopTyping);
    const setConversations = useDesktopStore((s) => s.setSlackConversations);

    function handleChatEvent(event: ChatEvent) {
        switch (event.type) {
            case "typing:start":
                startTyping(event.conversationId, event.authorId);
                break;

            case "typing:stop":
                stopTyping();
                break;

            case "message:add":
                setConversations((prev) =>
                    addMessageToConversation(
                        prev,
                        event.conversationId,
                        event.message,
                    ),
                );
                break;
        }
    }

    return { handleChatEvent };
}

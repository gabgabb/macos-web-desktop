import { markConversationAsRead } from "@/src/components/apps/SlackApp/logic/MessageFunctions";
import { useDesktopStore } from "@/src/store/desktop-store";
import { useEffect, useRef, useState } from "react";

export function useActiveConversation() {
    const conversations = useDesktopStore((s) => s.slack?.conversations) ?? [];
    const setConversations = useDesktopStore((s) => s.setSlackConversations);

    const [activeConversationId, setActiveConversationId] = useState("general");

    const activeConversationIdRef = useRef(activeConversationId);

    const activeConversation =
        conversations.find((c) => c.id === activeConversationId) ??
        conversations[0];

    function selectConversation(id: string) {
        setActiveConversationId(id);

        setConversations((prev) =>
            prev.map((c) => (c.id === id ? markConversationAsRead(c) : c)),
        );
    }

    useEffect(() => {
        activeConversationIdRef.current = activeConversationId;

        if (activeConversation.unreadCount > 0) {
            setConversations((prev) =>
                prev.map((c) =>
                    c.id === activeConversation.id
                        ? markConversationAsRead(c)
                        : c,
                ),
            );
        }
    }, [activeConversationId]);

    return {
        conversations,
        activeConversation,
        activeConversationId,
        selectConversation,
    };
}

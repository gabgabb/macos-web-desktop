"use client";

import {
    ConversationItem,
    markConversationAsRead,
} from "@/src/_components/apps/SlackApp/SlackFunctions";
import { TypingIndicator } from "@/src/_components/apps/SlackApp/TypingIndicator";
import { INTRO_SEQUENCE } from "@/src/core/chatData";
import { useDesktopStore } from "@/src/store/desktop-store";
import { useEffect, useRef, useState } from "react";
import { Slide, toast, ToastContainer } from "react-toastify";

export function SlackApp() {
    const slackIntroPlayed = useDesktopStore(
        (s) => s.progress?.slackIntroPlayed,
    );
    const markSlackIntroPlayed = useDesktopStore((s) => s.markSlackIntroPlayed);
    const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

    const [isTyping, setIsTyping] = useState<boolean>(false);
    const introPlayingRef = useRef(false);

    const conversations = useDesktopStore((s) => s.slack?.conversations) ?? [];
    const setConversations = useDesktopStore((s) => s.setSlackConversations);
    const [activeConversationId, setActiveConversationId] = useState("general");
    const activeConversationIdRef = useRef(activeConversationId);

    const activeConversation =
        conversations.find((c) => c.id === activeConversationId) ??
        conversations[0];

    function handleSelectConversation(id: string) {
        const convo = conversations.find((c) => c.id === id);

        if (!convo?.unlocked) {
            toast.error("This channel is locked.", { toastId: "id-locked" });
            return;
        }

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

    useEffect(() => {
        if (slackIntroPlayed || introPlayingRef.current) return;

        introPlayingRef.current = true;

        async function playIntro() {
            for (const step of INTRO_SEQUENCE) {
                setIsTyping(true);
                await delay(step.typing);
                setIsTyping(false);

                setConversations((prev) =>
                    prev.map((c) => {
                        if (c.id !== "dm-unknown") return c;

                        const isActive =
                            activeConversationIdRef.current === "dm-unknown";

                        return {
                            ...c,
                            unreadCount: isActive ? 0 : c.unreadCount + 1,
                            messages: [
                                ...c.messages,
                                {
                                    id: crypto.randomUUID(),
                                    author: step.author,
                                    content: step.content,
                                    timestamp: "now",
                                    read: isActive,
                                },
                            ],
                        };
                    }),
                );

                await delay(step.delay);
            }

            markSlackIntroPlayed();
        }

        playIntro();
    }, [slackIntroPlayed, markSlackIntroPlayed]);

    return (
        <div className="flex h-full w-full bg-gray-100">
            <aside className="z-20 flex w-48 flex-col gap-2 rounded-r-2xl border-r border-white/10 bg-linear-to-b from-purple-900 to-pink-900 p-3 text-white/90 shadow-2xl">
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

            <main className="z-5 flex-1 bg-gray-100 text-neutral-800">
                <div className="flex flex-col gap-2 p-3 text-sm">
                    {activeConversation?.messages.map((msg) => (
                        <div key={msg.id} className={`flex gap-2`}>
                            <b>{msg.author}:</b>
                            <span>{msg.content}</span>
                        </div>
                    ))}
                    {isTyping && activeConversation.id === "dm-unknown" && (
                        <TypingIndicator author="Unknown" />
                    )}
                </div>
            </main>
            <ToastContainer
                theme="colored"
                position="bottom-left"
                autoClose={3000}
                transition={Slide}
                pauseOnHover={false}
                closeOnClick
                pauseOnFocusLoss={false}
            />
        </div>
    );
}

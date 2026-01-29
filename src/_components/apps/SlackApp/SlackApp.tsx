"use client";

import { ChatHeader } from "@/src/_components/apps/SlackApp/ChatHeader";
import { InputSlack } from "@/src/_components/apps/SlackApp/InputSlack";
import {
    DaySeparator,
    markConversationAsRead,
    TypingRow,
} from "@/src/_components/apps/SlackApp/MessageFunctions";
import { MessageRow } from "@/src/_components/apps/SlackApp/MessageRow";
import { Sidebar } from "@/src/_components/apps/SlackApp/Sidebar";
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
    const typing = useDesktopStore((s) => s.slack?.typing);

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

    const startTyping = useDesktopStore((s) => s.startTyping);
    const stopTyping = useDesktopStore((s) => s.stopTyping);

    useEffect(() => {
        if (slackIntroPlayed || introPlayingRef.current) return;

        introPlayingRef.current = true;

        async function playIntro() {
            for (const step of INTRO_SEQUENCE) {
                startTyping("dm-unknown", step.authorId);

                await delay(step.typing);

                stopTyping();

                setConversations((prev) =>
                    prev.map((c) =>
                        c.id !== "dm-unknown"
                            ? c
                            : {
                                  ...c,
                                  unreadCount:
                                      activeConversationIdRef.current ===
                                      "dm-unknown"
                                          ? 0
                                          : c.unreadCount + 1,
                                  messages: [
                                      ...c.messages,
                                      {
                                          id: crypto.randomUUID(),
                                          authorId: step.authorId,
                                          content: step.content,
                                          date: new Date()
                                              .toISOString()
                                              .slice(0, 10),
                                          timestamp: "now",
                                      },
                                  ],
                              },
                    ),
                );

                await delay(step.delay);
            }

            markSlackIntroPlayed();
        }

        playIntro();
    }, []);

    return (
        <div className="flex h-full w-full bg-gray-100">
            <Sidebar
                conversations={conversations}
                handleSelectConversation={handleSelectConversation}
                activeConversationId={activeConversationId}
            />
            <main className="z-5 flex h-full w-full flex-col bg-gray-100 text-neutral-800">
                <ChatHeader activeConversation={activeConversation} />
                <div className="flex grow flex-col overflow-y-auto px-6 py-2 text-sm">
                    {activeConversation.messages.map((msg, index) => {
                        const prev = activeConversation.messages[index - 1];
                        const showDaySeparator =
                            !prev || prev.date !== msg.date;
                        const isSameAuthor =
                            prev && prev.authorId === msg.authorId;
                        const isSameDay = prev && prev.date === msg.date;

                        const marginTop =
                            !prev || !isSameDay
                                ? "mt-4"
                                : isSameAuthor
                                  ? "mt-0.5"
                                  : "mt-3";

                        return (
                            <div key={msg.id} className="w-full">
                                {showDaySeparator && (
                                    <DaySeparator date={msg.date} />
                                )}

                                <div className={marginTop}>
                                    <MessageRow
                                        msg={msg}
                                        showAvatar={!isSameAuthor || !isSameDay}
                                    />
                                </div>
                            </div>
                        );
                    })}
                    {typing &&
                        typing.conversationId === activeConversation.id && (
                            <TypingRow authorId={typing.authorId} showAvatar />
                        )}
                </div>
                <InputSlack activeConversation={activeConversation} />
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

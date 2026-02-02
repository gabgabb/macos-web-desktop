import { ChatEvent } from "@/src/core/apps/chatData";

export async function playChatSequence({
    steps,
    conversationId,
    dispatch,
    delay,
}: {
    steps: {
        authorId: string;
        content: string;
        typing: number;
        delay: number;
    }[];
    conversationId: string;
    dispatch: (event: ChatEvent) => void;
    delay: (ms: number) => Promise<void>;
}) {
    for (const step of steps) {
        dispatch({
            type: "typing:start",
            conversationId,
            authorId: step.authorId,
        });

        await delay(step.typing);

        dispatch({
            type: "typing:stop",
            conversationId,
            authorId: step.authorId,
        });

        dispatch({
            type: "message:add",
            conversationId,
            message: {
                id: crypto.randomUUID(),
                authorId: step.authorId,
                content: step.content,
                date: new Date().toISOString().slice(0, 10),
                timestamp: "now",
            },
        });

        await delay(step.delay);
    }
}

import { playChatSequence } from "@/src/_components/apps/SlackApp/hooks/playChatSequence";
import { ChatEvent, INTRO_SEQUENCE } from "@/src/core/apps/chatData";
import { useDesktopStore } from "@/src/store/desktop-store";
import { useEffect, useRef } from "react";

export function useSlackIntro(dispatch: (event: ChatEvent) => void) {
    const slackIntroPlayed = useDesktopStore(
        (s) => s.progress?.slackIntroPlayed,
    );
    const markSlackIntroPlayed = useDesktopStore((s) => s.markSlackIntroPlayed);

    const delay = (ms: number): Promise<void> =>
        new Promise((resolve) => setTimeout(resolve, ms));

    const introStartedRef = useRef(false);

    useEffect(() => {
        if (slackIntroPlayed) return;
        if (introStartedRef.current) return;

        introStartedRef.current = true;

        playChatSequence({
            steps: INTRO_SEQUENCE,
            conversationId: "dm-unknown",
            dispatch,
            delay,
        });

        markSlackIntroPlayed();
    }, [slackIntroPlayed, dispatch]);
}

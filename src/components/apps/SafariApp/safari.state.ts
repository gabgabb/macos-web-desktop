import { useState } from "react";

export type SafariLocation =
    | { kind: "home" }
    | { kind: "search"; query: string }
    | { kind: "page"; url: string }
    | { kind: "error" };

function parseInput(input: string): SafariLocation {
    const value = input.trim();

    if (!value) return { kind: "home" };

    if (value.startsWith("http://") || value.startsWith("https://")) {
        return { kind: "page", url: value };
    }

    if (value.includes(".")) {
        return { kind: "page", url: `https://${value}` };
    }

    return { kind: "search", query: value };
}

export function useSafariState() {
    const [history, setHistory] = useState<SafariLocation[]>([
        { kind: "home" },
    ]);
    const [index, setIndex] = useState(0);

    const location = history[index];

    const navigateInput = (input: string) => {
        const loc = parseInput(input);
        push(loc);
    };

    const push = (loc: SafariLocation) => {
        const next = history.slice(0, index + 1);
        next.push(loc);
        setHistory(next);
        setIndex(next.length - 1);
    };

    return {
        location,
        navigateInput,
        push,
        back: () => index > 0 && setIndex(index - 1),
        forward: () => index < history.length - 1 && setIndex(index + 1),
        home: () => push({ kind: "home" }),
        reload: () => setIndex(index),
        canGoBack: index > 0,
        canGoForward: index < history.length - 1,
    };
}

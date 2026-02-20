import { useEffect, useState } from "react";

export type SafariLocation =
    | { kind: "home" }
    | { kind: "search"; query: string }
    | { kind: "page"; url: string }
    | { kind: "error" };

function parseInput(input: string): SafariLocation {
    const value = input.trim();

    if (!value) return { kind: "home" };

    if (value.startsWith("http://") || value.startsWith("https://")) {
        try {
            const url = new URL(value);
            url.protocol = "https:";

            return { kind: "page", url: url.toString() };
        } catch {
            return { kind: "error" };
        }
    }

    const domainPattern = /^([a-z0-9-]+\.)+[a-z]{2,}$/i;

    if (domainPattern.test(value)) {
        return { kind: "page", url: `https://${value}` };
    }

    return {
        kind: "page",
        url: `https://google.com/search?q=${encodeURIComponent(value)}`,
    };
}

function locationToInput(loc: SafariLocation): string {
    if (loc.kind === "page") return loc.url;
    if (loc.kind === "search") return loc.query;
    return "";
}

export function useSafariState() {
    const [inputValue, setInputValue] = useState("");
    const [clearanceLevel, setClearanceLevel] = useState(0);

    const [history, setHistory] = useState<SafariLocation[]>([
        { kind: "home" },
    ]);
    const [index, setIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const location = history[index];

    const hasAccess = (required?: number) =>
        !required || clearanceLevel >= required;

    useEffect(() => {
        setInputValue(locationToInput(location));
    }, [location]);

    const push = (loc: SafariLocation) => {
        setIsLoading(true);

        setTimeout(() => {
            setHistory((prev) => [...prev.slice(0, index + 1), loc]);
            setIndex((prev) => prev + 1);
            setIsLoading(false);
        }, 400);
    };

    const navigateInput = (input: string) => {
        const loc = parseInput(input);
        push(loc);
    };

    return {
        location,
        hasAccess,
        clearanceLevel,
        setClearanceLevel,
        navigateInput,
        inputValue,
        setInputValue,
        currentInput: locationToInput(location),
        push,
        back: () => index > 0 && setIndex(index - 1),
        forward: () => index < history.length - 1 && setIndex(index + 1),
        home: () => push({ kind: "home" }),
        reload: () => push(location),
        canGoBack: index > 0,
        canGoForward: index < history.length - 1,
        isLoading,
    };
}

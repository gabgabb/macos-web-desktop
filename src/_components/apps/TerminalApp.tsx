"use client";

import { useDesktopStore } from "@/src/store/desktop-store";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

type Line = {
    id: string;
    type: "out" | "err" | "info";
    text: string;
};

function rid() {
    return Math.random().toString(16).slice(2);
}

export function TerminalApp() {
    const openApp = useDesktopStore((s) => s.openApp);
    const contentTerminal = useDesktopStore((s) => s.terminal.content);
    const setTerminal = useDesktopStore((s) => s.setTerminal);

    const router = useRouter();

    const [input, setInput] = useState("");
    const [lines, setLines] = useState<Line[]>(() => {
        if (!contentTerminal.trim()) {
            return [
                {
                    id: rid(),
                    type: "info",
                    text: "Type `help` to see commands.",
                },
                { id: rid(), type: "out", text: "" },
            ];
        }

        return contentTerminal.split("\n").map((text) => ({
            id: rid(),
            type: "out",
            text,
        }));
    });

    const scrollRef = useRef<HTMLDivElement | null>(null);
    const prompt = useMemo(() => "user@macos-web-desktop %", []);

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
    }, [lines]);

    useEffect(() => {
        const full = lines.map((l) => l.text).join("\n");
        setTerminal(full);
    }, [lines, setTerminal]);

    function push(type: Line["type"], text: string) {
        setLines((prev) => [...prev, { id: rid(), type, text }]);
    }

    async function runCommand(raw: string) {
        const cmd = raw.trim();
        if (!cmd) return;

        push("out", `${prompt} ${cmd}`);

        const [head, ...rest] = cmd.split(" ");
        const args = rest.join(" ").trim();

        switch (head) {
            case "help": {
                push("info", "Available commands:");
                push("out", "  help                 Show this help");
                push("out", "  clear                Clear the terminal");
                push("out", "  date                 Print current date");
                push("out", "  whoami               Print current user");
                push("out", "  echo <text>           Print text");
                push(
                    "out",
                    "  open <app>            Open an app: finder | notes | settings | terminal",
                );
                push("out", "  lock                 Lock the session");
                push("out", "  unlock <password>     Unlock (server check)");
                return;
            }

            case "clear": {
                setInput("");
                setLines([
                    {
                        id: rid(),
                        type: "info",
                        text: "Type `help` to see commands.",
                    },
                ]);
                return;
            }

            case "date": {
                push("out", new Date().toString());
                return;
            }

            case "whoami": {
                push("out", "User");
                return;
            }

            case "echo": {
                push("out", args);
                return;
            }

            case "open": {
                if (!args) {
                    push("err", "Usage: open <app>");
                    return;
                }
                const app = args.toLowerCase();
                if (!["finder", "notes", "about", "terminal"].includes(app)) {
                    push("err", `Unknown app: ${args}`);
                    return;
                }
                openApp(app as any);
                push("out", `Opening ${app}...`);
                return;
            }

            case "lock": {
                await fetch("/api/lock", { method: "POST" });
                router.replace("/lock");
                return;
            }

            default: {
                push(
                    "err",
                    `Command not found: ${head}` +
                        "\n" +
                        "Try the command `help`",
                );
                return;
            }
        }
    }

    return (
        <div className="flex h-full flex-col rounded-2xl bg-black/55 p-3 font-mono text-[13px] text-white">
            <div
                ref={scrollRef}
                className="flex-1 overflow-auto pr-2 whitespace-pre-wrap"
            >
                {lines.map((l) => (
                    <div
                        key={l.id}
                        className={
                            l.type === "err"
                                ? "text-red-400"
                                : l.type === "info"
                                  ? "text-white/70"
                                  : "text-white"
                        }
                    >
                        {l.text}
                    </div>
                ))}
                <div className="flex w-fit shrink-0 gap-2 text-white/80">
                    <div className="min-w-fit">{prompt}</div>
                    <input
                        autoFocus
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                const cmd = input;
                                setInput("");
                                runCommand(cmd);
                            }
                        }}
                        className="w-full bg-transparent outline-none placeholder:text-white/30"
                        placeholder="Type a command..."
                    />
                </div>
            </div>
        </div>
    );
}

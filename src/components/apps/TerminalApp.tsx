"use client";

import { TerminalLine } from "@/src/core/apps/types";
import { FS } from "@/src/core/fs/fs.service";
import { useDesktopStore } from "@/src/store/desktop-store";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

function rid() {
    return Math.random().toString(16).slice(2);
}

const WELCOME_LINE: TerminalLine = {
    id: "welcome",
    type: "info",
    text: "Type `help` to see commands.",
};

export function TerminalApp() {
    const openApp = useDesktopStore((s) => s.openApp);
    const savedLines = useDesktopStore((s) => s.terminal.lines);
    const setTerminal = useDesktopStore((s) => s.setTerminal);
    const refreshFs = useDesktopStore((s) => s.refreshFs);
    const lock = useDesktopStore((s) => s.lock);

    const router = useRouter();

    const [input, setInput] = useState<string>("");
    const [lines, setLines] = useState<TerminalLine[]>(
        savedLines.length ? savedLines : [WELCOME_LINE],
    );

    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    const scrollRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const prompt = useMemo(() => "user@macos-web-desktop %", []);

    useEffect(() => {
        scrollRef.current?.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [lines]);

    useEffect(() => {
        setTerminal(lines);
    }, [lines, setTerminal]);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    function push(type: TerminalLine["type"], text: string) {
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
                push("out", "  pwd                  Print current directory");
                push(
                    "out",
                    "  ls                   List files in current directory",
                );
                push("out", "  cd <dir>             Change directory");
                push("out", "  whoami               Print current user");
                push("out", "  echo <text>          Print text");
                push(
                    "out",
                    "  open <app>           Open an app: finder | notes | settings | terminal",
                );
                push("out", "  lock                 Lock the session");
                return;
            }

            case "clear": {
                setLines([WELCOME_LINE]);
                return;
            }

            case "date": {
                push("out", new Date().toString());
                return;
            }

            case "pwd":
                push("out", FS.pwd());
                return;

            case "ls":
                try {
                    push("out", FS.ls(args).join("  "));
                } catch {
                    push("err", "ls: not a directory");
                }
                return;

            case "cd":
                try {
                    FS.cd(args || "/home/user");
                    refreshFs();
                } catch {
                    push("err", `cd: no such directory: ${args}`);
                }
                return;

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
                if (
                    ![
                        "finder",
                        "notes",
                        "settings",
                        "terminal",
                        "calculator",
                        "calendar",
                        "slack",
                        "doom",
                    ].includes(app)
                ) {
                    push("err", `Unknown app: ${args}`);
                    return;
                }

                openApp(app as any);
                push("out", `Opening ${app}...`);
                return;
            }

            case "lock": {
                lock();
                fetch("/api/lock", { method: "POST" }).catch(() => {});
                router.replace("/lock");
                return;
            }

            default: {
                push(
                    "err",
                    `Command not found: ${head}\nTry the command \`help\``,
                );
                return;
            }
        }
    }

    return (
        <div
            className="flex h-full flex-col rounded-2xl bg-black/55 p-3 font-mono text-[13px] text-white"
            onClick={() => inputRef.current?.focus()}
        >
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
                        ref={inputRef}
                        id={"terminal-input"}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                const cmd = input;
                                if (!cmd) return;
                                setHistory((h) => [...h, cmd]);
                                setHistoryIndex(-1);
                                setInput("");
                                runCommand(cmd);
                            }
                            if (e.key === "ArrowUp") {
                                e.preventDefault();
                                setHistoryIndex((prev) => {
                                    const nextIndex = Math.min(
                                        prev + 1,
                                        history.length - 1,
                                    );
                                    const cmd =
                                        history[history.length - 1 - nextIndex];
                                    if (cmd) setInput(cmd);
                                    return nextIndex;
                                });
                            }

                            if (e.key === "ArrowDown") {
                                e.preventDefault();

                                setHistoryIndex((prev) => {
                                    const nextIndex = Math.max(prev - 1, -1);
                                    const cmd =
                                        nextIndex === -1
                                            ? ""
                                            : history[
                                                  history.length - 1 - nextIndex
                                              ];
                                    setInput(cmd ?? "");
                                    return nextIndex;
                                });
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

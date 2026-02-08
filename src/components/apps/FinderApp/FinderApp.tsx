"use client";

import { GridView } from "@/src/components/apps/FinderApp/GridView";
import { ListView } from "@/src/components/apps/FinderApp/ListView";
import { FS } from "@/src/core/fs/fs.service";
import type { FsNode } from "@/src/core/fs/types";
import { useDesktopStore } from "@/src/store/desktop-store";
import { AnimatePresence, motion } from "framer-motion";
import {
    AppWindowMac,
    ChevronLeftIcon,
    ChevronRightIcon,
    Clock9,
    Dock,
    Download,
    File,
    FolderClosed,
    LayoutGrid,
    ListIcon,
    SearchIcon,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const SIDEBAR_PATHS = {
    recents: [],
    applications: ["apps"],
    desktop: ["home", "user"],
    documents: ["home", "user", "Documents"],
    downloads: ["home", "user", "Downloads"],
    shared: ["home", "user", "Shared"],
} as const;

type SidebarKey = keyof typeof SIDEBAR_PATHS;

export function iconFor(node: FsNode, name: string) {
    if (node.type === "dir")
        return (
            <Image
                src={"/icones/folder.webp"}
                alt={"Folder"}
                width={60}
                height={60}
                priority
            />
        );

    if (name.endsWith(".png"))
        return (
            <Image
                src="/icones/image.webp"
                alt="Image"
                width={60}
                height={60}
                priority
            />
        );
    if (name.endsWith(".pdf"))
        return (
            <Image
                src="/icones/pdf.webp"
                alt="PDF"
                width={60}
                height={60}
                priority
            />
        );
    if (name.endsWith(".txt"))
        return (
            <Image
                src="/icones/page.webp"
                alt="Text"
                width={60}
                height={60}
                priority
            />
        );
    if (name.endsWith(".zip"))
        return (
            <Image
                src={"/icones/zip.webp"}
                alt={"Zip"}
                width={60}
                height={60}
                priority
            />
        );

    if (node.type === "app") {
        if (typeof node.icon === "string") {
            return (
                <Image
                    src={node.icon}
                    alt={node.id}
                    width={40}
                    height={40}
                    priority
                />
            );
        } else {
            return node.icon;
        }
    }

    return (
        <Image
            src="/icones/page.webp"
            alt="File"
            width={60}
            height={60}
            priority
        />
    );
}

export function FinderApp() {
    const cwd = useDesktopStore((s) => s.cwd);
    const refreshFs = useDesktopStore((s) => s.refreshFs);
    const isHistoryNavigation = useRef(false);
    const prevCwdRef = useRef<string[] | null>(null);

    const [history, setHistory] = useState<string[][]>([cwd]);
    const [historyIndex, setHistoryIndex] = useState<number>(0);
    const [searchOpen, setSearchOpen] = useState<boolean>(false);

    const [query, setQuery] = useState<string>("");
    const [selected, setSelected] = useState<string | null>(null);

    type ViewMode = "grid" | "list";
    const [viewMode, setViewMode] = useState<ViewMode>("grid");

    const node = FS.getNode(cwd);

    if (!node || node.type !== "dir") {
        return <div className="p-4 text-white/70">Directory not found</div>;
    }

    const filteredEntries =
        query === ""
            ? Object.entries(node.children).map(([name, node]) => ({
                  name,
                  node,
                  path: [...cwd, name],
              }))
            : FS.search(query);

    function navigate(next: string[]) {
        setHistory((h) => [...h.slice(0, historyIndex + 1), next]);
        setHistoryIndex((i) => i + 1);

        FS.cd("/" + next.join("/"));
        refreshFs();
    }

    function navigateTo(key: SidebarKey) {
        navigate([...SIDEBAR_PATHS[key]]);
        if (query !== "") {
            exitSearchAndNavigate();
        }
    }

    function goBack() {
        if (historyIndex <= 0) return;
        const next = history[historyIndex - 1];
        isHistoryNavigation.current = true;
        setHistoryIndex((i) => i - 1);
        FS.cd("/" + next.join("/"));
        refreshFs();
    }

    function goForward() {
        if (historyIndex >= history.length - 1) return;
        const next = history[historyIndex + 1];
        isHistoryNavigation.current = true;
        setHistoryIndex((i) => i + 1);
        FS.cd("/" + next.join("/"));
        refreshFs();
    }

    function titleFromPath(path: string[]) {
        if (path.length === 0) return "Recents";
        return path[path.length - 1];
    }

    function exitSearchAndNavigate() {
        setQuery("");
        setSearchOpen(false);
        setSelected(null);
    }

    useEffect(() => {
        const prev = prevCwdRef.current;

        if (!prev) {
            prevCwdRef.current = cwd;
            return;
        }

        if (prev.join("/") === cwd.join("/")) return;

        if (isHistoryNavigation.current) {
            isHistoryNavigation.current = false;
            prevCwdRef.current = cwd;
            return;
        }

        setHistory((h) => [...h.slice(0, historyIndex + 1), cwd]);
        setHistoryIndex((i) => i + 1);
        prevCwdRef.current = cwd;
    }, [cwd]);

    return (
        <div className="flex h-full w-full bg-(--sidebar)">
            <aside className="z-10 flex w-48 flex-col gap-4 rounded-r-2xl border-r border-(--border-control) bg-(--window) p-5 shadow-xl">
                <ul className="flex flex-col text-sm font-semibold text-(--text-strong)">
                    <li
                        className="flex cursor-pointer items-center gap-2 rounded-xl p-2 transition-all hover:bg-(--bg-hover)"
                        data-testid="recents"
                        onClick={() => navigateTo("recents")}
                    >
                        <Clock9 className="size-5" /> <span>Recents</span>
                    </li>
                    <li
                        className="flex cursor-pointer items-center gap-2 rounded-xl p-2 transition-all hover:bg-(--bg-hover)"
                        data-testid="recents"
                        onClick={() => navigateTo("shared")}
                    >
                        <FolderClosed className="size-5" /> <span>Shared</span>
                    </li>
                </ul>
                <ul className="text-sm font-semibold text-(--text-strong)">
                    <span className="text-sm font-semibold text-gray-400">
                        Favorites
                    </span>
                    <div className="flex flex-col">
                        <li
                            className="flex cursor-pointer items-center gap-2 rounded-xl p-2 transition-all hover:bg-(--bg-hover)"
                            data-testid="applications"
                            onClick={() => navigateTo("applications")}
                        >
                            <AppWindowMac className="size-5" />{" "}
                            <span>Applications</span>
                        </li>
                        <li
                            className="flex cursor-pointer items-center gap-2 rounded-xl p-2 transition-all hover:bg-(--bg-hover)"
                            data-testid="recents"
                            onClick={() => navigateTo("desktop")}
                        >
                            <Dock className="size-5" /> <span>Desktop</span>
                        </li>
                        <li
                            className="flex cursor-pointer items-center gap-2 rounded-xl p-2 transition-all hover:bg-(--bg-hover)"
                            data-testid="recents"
                            onClick={() => navigateTo("documents")}
                        >
                            <File className="size-5" /> <span>Documents</span>
                        </li>
                        <li
                            className="flex cursor-pointer items-center gap-2 rounded-xl p-2 transition-all hover:bg-(--bg-hover)"
                            data-testid="recents"
                            onClick={() => navigateTo("downloads")}
                        >
                            <Download className="size-5" />{" "}
                            <span>Downloads</span>
                        </li>
                    </div>
                </ul>
            </aside>

            <main
                className="flex h-full w-full flex-col bg-(--sidebar) text-(--text-strong)"
                onClick={() => setSelected(null)}
            >
                <div className="mt-2 ml-2 flex items-center justify-between gap-4 p-2">
                    <div className="flex items-center gap-2" data-testid="path">
                        <div className="bg-background flex items-center rounded-full shadow-md">
                            <button
                                onClick={goBack}
                                disabled={historyIndex === 0}
                                aria-label="Go back"
                                className={`flex size-10 items-center justify-center rounded-l-full transition ${
                                    historyIndex === 0 &&
                                    "cursor-default opacity-40"
                                } `}
                            >
                                <div
                                    className={`flex size-7 items-center justify-center rounded-full ${historyIndex === 0 ? "opacity-40" : "hover:bg-(--bg-hover)"}`}
                                >
                                    <ChevronLeftIcon className="size-5" />
                                </div>
                            </button>

                            <div className="h-6 w-px bg-(--border-control)" />

                            <button
                                onClick={goForward}
                                disabled={historyIndex >= history.length - 1}
                                aria-label="Go forward"
                                className={`flex size-10 items-center justify-center rounded-r-full transition ${
                                    historyIndex >= history.length - 1 &&
                                    "cursor-default opacity-40"
                                } `}
                            >
                                <div
                                    className={`flex size-7 items-center justify-center rounded-full ${historyIndex >= history.length - 1 ? "opacity-40" : "hover:bg-(--bg-hover)"}`}
                                >
                                    <ChevronRightIcon className="size-5" />
                                </div>
                            </button>
                        </div>

                        <div className="text-sm font-bold">
                            {query ? `Searching...` : titleFromPath(cwd)}
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-background flex items-center gap-1 rounded-3xl shadow-md">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`ml-2 flex h-8 w-8 items-center justify-center rounded-full transition ${
                                    viewMode === "grid"
                                        ? "bg-[rgb(var(--accent))] text-neutral-900"
                                        : "text-neutral-500 hover:bg-(--bg-hover)"
                                } `}
                                aria-label="Grid view"
                            >
                                <LayoutGrid className="size-4" />
                            </button>
                            <hr
                                className={
                                    "h-10 w-0.5 border-t-0 bg-(--border-control)"
                                }
                            />
                            <button
                                onClick={() => setViewMode("list")}
                                className={`mr-2 flex h-8 w-8 items-center justify-center rounded-full transition ${
                                    viewMode === "list"
                                        ? "bg-[rgb(var(--accent))] text-neutral-900"
                                        : "text-neutral-500 hover:bg-(--bg-hover)"
                                } `}
                                aria-label="List view"
                            >
                                <ListIcon className="size-4" />
                            </button>
                        </div>
                        <div
                            className="bg-background flex items-center rounded-3xl px-2 shadow-md"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <AnimatePresence initial={false}>
                                {searchOpen && (
                                    <motion.input
                                        key="search"
                                        autoFocus
                                        id="search-input"
                                        maxLength={20}
                                        value={query}
                                        onChange={(e) =>
                                            setQuery(e.target.value)
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === "Escape") {
                                                setSearchOpen(false);
                                                setQuery("");
                                            }
                                        }}
                                        onBlur={() => {
                                            if (query === "")
                                                setSearchOpen(false);
                                        }}
                                        placeholder="Search"
                                        initial={{ width: 0, opacity: 0 }}
                                        animate={{ width: 160, opacity: 1 }}
                                        exit={{ width: 0, opacity: 0 }}
                                        className="bg-background h-10 rounded-full pl-1 text-sm outline-none"
                                    />
                                )}
                            </AnimatePresence>

                            <button
                                onClick={() => setSearchOpen((v) => !v)}
                                className="relative z-10 flex h-10 w-8 items-center justify-center rounded-full text-neutral-500 hover:text-neutral-800"
                            >
                                <SearchIcon className="size-4" />
                            </button>
                        </div>
                    </div>
                </div>
                <>
                    {viewMode === "grid" ? (
                        <GridView
                            entries={filteredEntries}
                            selected={selected}
                            setSelected={setSelected}
                            cwd={cwd}
                            exitSearchAndNavigate={exitSearchAndNavigate}
                        />
                    ) : (
                        <ListView
                            entries={filteredEntries}
                            selected={selected}
                            setSelected={setSelected}
                            cwd={cwd}
                            exitSearchAndNavigate={exitSearchAndNavigate}
                        />
                    )}
                </>
            </main>
        </div>
    );
}

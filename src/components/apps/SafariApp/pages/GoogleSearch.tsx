import { SafariController } from "@/src/core/apps/types";
import { buildResults } from "@/src/hooks/useGenerateGoogleResults";
import { useMemo, useState } from "react";

export function GoogleSearch({
    query,
    navigate,
    safari,
}: {
    query: string;
    navigate: (url: string) => void;
    safari: SafariController;
}) {
    const [localQuery, setLocalQuery] = useState<string>("");

    const results = useMemo(() => {
        return buildResults(query);
    }, [query]);

    const searchMeta = useMemo(() => {
        return {
            total: Math.floor(Math.random() * 9000000 + 100000),
            time: (Math.random() * 0.5 + 0.1).toFixed(2),
        };
    }, [query]);

    return (
        <div className="bg-background h-full w-full">
            <div className="flex h-full flex-col bg-(--sidebar)">
                <div className="shrink-0 border-b border-(--border-control)/80 px-8 py-6">
                    <div className="flex items-center gap-6">
                        <h1
                            className="text-4xl font-bold text-(--text-primary) transition-colors hover:cursor-pointer hover:text-blue-400"
                            onClick={() =>
                                safari.navigateInput("https://google.com")
                            }
                        >
                            Google
                        </h1>

                        <input
                            placeholder="Search with Google"
                            value={localQuery}
                            onChange={(e) => setLocalQuery(e.target.value)}
                            className="bg-background/80 flex-1 rounded-full border border-(--border-control) px-5 py-3 text-sm text-(--text-primary) outline-none"
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && localQuery.trim()) {
                                    safari.navigateInput(localQuery);
                                }
                            }}
                        />
                    </div>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto">
                    <div className="mx-auto w-full max-w-3xl space-y-4 px-8 py-6">
                        <p className="text-xs text-(--text-primary)/50">
                            About {searchMeta.total} results ({searchMeta.time}{" "}
                            seconds)
                        </p>

                        <ul className="space-y-4">
                            {results.map((r, i) => (
                                <li key={i}>
                                    <p
                                        className="w-fit cursor-pointer text-blue-400 underline"
                                        onClick={() => navigate(r.url)}
                                    >
                                        {r.title}
                                    </p>
                                    <p className="text-xs text-green-600">
                                        {r.url}
                                    </p>
                                    <p className="text-sm text-(--text-primary)/70">
                                        {r.description}
                                    </p>
                                </li>
                            ))}
                        </ul>

                        <div className="mb-4 flex gap-4 pb-10 text-blue-400">
                            <span className="cursor-pointer">1</span>
                            <span className="cursor-pointer">2</span>
                            <span className="cursor-pointer">3</span>
                            <span className="cursor-pointer">Next</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { Home, MoveLeft, MoveRight, RotateCw } from "lucide-react";

export function SafariToolbar({ safari }: any) {
    return (
        <div className="flex items-center gap-2 border-b border-(--border-control) bg-(--window) px-3 py-2 text-(--text-strong)">
            <button
                disabled={!safari.canGoBack}
                onClick={safari.back}
                className="rounded-lg px-2 py-1 hover:bg-(--bg-hover) disabled:opacity-30"
            >
                <MoveLeft className="h-4 w-4" />
            </button>
            <button
                disabled={!safari.canGoForward}
                onClick={safari.forward}
                className="rounded-lg px-2 py-1 hover:bg-(--bg-hover) disabled:opacity-30"
            >
                <MoveRight className="h-4 w-4" />
            </button>
            <button
                onClick={safari.reload}
                className="rounded-lg px-2 py-1 hover:bg-(--bg-hover)"
            >
                <RotateCw className="h-4 w-4" />
            </button>
            <button
                onClick={safari.home}
                className="rounded-lg px-2 py-1 hover:bg-(--bg-hover)"
            >
                <Home className="h-4 w-4" />
            </button>
            <input
                placeholder="Search or enter website name"
                className="ml-2 w-full rounded-xl border border-(--border-control) bg-(--window) px-3 py-2 text-sm outline-none"
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        safari.navigateInput(
                            (e.target as HTMLInputElement).value,
                        );
                    }
                }}
            />
        </div>
    );
}

import { ClearanceBadge } from "@/src/components/UI/ClearanceBadge";
import { SafariController } from "@/src/core/apps/types";
import { Home, MoveLeft, MoveRight, RotateCw } from "lucide-react";
import { useState } from "react";

export function SafariToolbar({ safari }: { safari: SafariController }) {
    const [isReloading, setIsReloading] = useState<boolean>(false);

    const onClickReload = () => {
        setIsReloading(true);

        setTimeout(() => {
            setIsReloading(false);
        }, 1000);
    };

    return (
        <div className="flex items-center gap-2 border-b border-(--border-control) bg-(--window) px-3 py-2 text-(--text-strong)">
            <button
                disabled={!safari.canGoBack}
                onClick={safari.back}
                className={`rounded-lg px-2 py-1 transition-colors ${!safari.canGoBack ? "opacity-30" : "hover:bg-(--button-secondary-hover) active:scale-95"}`}
            >
                <MoveLeft className="h-4 w-4" />
            </button>
            <button
                disabled={!safari.canGoForward}
                onClick={safari.forward}
                className={`rounded-lg px-2 py-1 transition-colors ${!safari.canGoForward ? "opacity-30" : "hover:bg-(--button-secondary-hover) active:scale-95"}`}
            >
                <MoveRight className="h-4 w-4" />
            </button>
            <button
                onClick={() => {
                    safari.reload();
                    onClickReload();
                }}
                className="rounded-lg px-2 py-1 transition-colors hover:bg-(--button-secondary-hover) active:scale-95"
            >
                <RotateCw
                    className={`h-4 w-4 ${isReloading ? "animate-spin" : ""}`}
                />
            </button>
            <button
                onClick={safari.home}
                className="rounded-lg px-2 py-1 transition-colors hover:bg-(--button-secondary-hover) active:scale-95"
            >
                <Home className="h-4 w-4" />
            </button>
            <input
                value={safari.inputValue}
                onChange={(e) => safari.setInputValue?.(e.target.value)}
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
            <ClearanceBadge />
        </div>
    );
}

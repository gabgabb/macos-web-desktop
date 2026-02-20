import { SafariController } from "@/src/core/apps/types";
import { useDesktopStore } from "@/src/store/desktop-store";
import { useEffect } from "react";

export function Log01Page({ safari }: { safari: SafariController }) {
    const level = useDesktopStore((s) => s.progress.clearanceLevel);
    const setClearanceLevel = useDesktopStore((s) => s.setClearanceLevel);

    useEffect(() => {
        if (level < 1) {
            setClearanceLevel(1);
        }
    }, [level, setClearanceLevel]);

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-semibold">Lab Log 01</h1>

            <p>Signal anomaly detected in experimental batch.</p>

            {level < 1 && (
                <p className="text-yellow-400">
                    Clearance upgraded to Level 1.
                </p>
            )}

            <button
                className="text-blue-400 underline"
                onClick={() =>
                    safari.push({
                        kind: "page",
                        url: "https://aurora.internal",
                    })
                }
            >
                Access Project AURORA
            </button>
        </div>
    );
}

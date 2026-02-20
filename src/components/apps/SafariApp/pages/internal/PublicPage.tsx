import { SafariController } from "@/src/core/apps/types";

export function PublicPage({ safari }: { safari: SafariController }) {
    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-semibold">Internal Research Portal</h1>

            <p>Clearance level: {safari.clearanceLevel}</p>

            <button
                className="text-blue-400 underline"
                onClick={() =>
                    safari.push({
                        kind: "page",
                        url: "https://log01.internal",
                    })
                }
            >
                Open Lab Log 01
            </button>
        </div>
    );
}

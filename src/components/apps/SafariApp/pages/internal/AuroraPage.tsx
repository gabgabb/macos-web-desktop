import { SafariController } from "@/src/core/apps/types";
import { useEffect } from "react";

export function AuroraPage({ safari }: { safari: SafariController }) {
    useEffect(() => {
        if (safari.clearanceLevel < 2) {
            safari.setClearanceLevel(2);
        }
    }, []);

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-semibold text-red-400">
                PROJECT AURORA
            </h1>

            <p>Phase II initiated without ethical approval.</p>

            <p className="text-red-400">Clearance upgraded to Level 2.</p>
        </div>
    );
}

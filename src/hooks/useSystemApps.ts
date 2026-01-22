import { AppDefinition } from "@/src/core/types";
import { useEffect, useState } from "react";

export function useSystemApps() {
    const [apps, setApps] = useState<AppDefinition[]>([]);

    useEffect(() => {
        fetch("/api/system/apps")
            .then((r) => r.json())
            .then(setApps);
    }, []);

    return apps;
}

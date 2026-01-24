"use client";

import { useEffect, useState } from "react";

type NetworkInfo = {
    online: boolean;
    type?: string;
    downlink?: number;
    rtt?: number;
};

export function useNetworkStatus(): NetworkInfo {
    const [state, setState] = useState<NetworkInfo>({
        online: typeof navigator !== "undefined" ? navigator.onLine : true,
    });

    useEffect(() => {
        function update() {
            const conn = (navigator as any).connection;

            setState({
                online: navigator.onLine,
                type: conn?.effectiveType,
                downlink: conn?.downlink,
                rtt: conn?.rtt,
            });
        }

        update();
        window.addEventListener("online", update);
        window.addEventListener("offline", update);
        (navigator as any).connection?.addEventListener("change", update);

        return () => {
            window.removeEventListener("online", update);
            window.removeEventListener("offline", update);
            (navigator as any).connection?.removeEventListener(
                "change",
                update,
            );
        };
    }, []);

    return state;
}

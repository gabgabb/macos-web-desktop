"use client";

import { useNetworkStatus } from "@/src/hooks/useNetworkStatus";
import { WifiIcon, WifiOffIcon } from "lucide-react";

export function WifiPanel({ onClose }: { onClose: () => void }) {
    const net = useNetworkStatus();

    return (
        <>
            <div className="fixed inset-0 z-40" onMouseDown={onClose} />

            <div className="fixed top-10 right-8 z-50 mt-2 w-64 rounded-xl border border-black/10 bg-white/10 p-4 shadow-2xl backdrop-blur-md">
                <div className="mb-2 flex items-center gap-2 font-semibold">
                    {net.online ? <WifiIcon /> : <WifiOffIcon />}
                    Network
                </div>

                <div className="space-y-1 opacity-90">
                    <div>Status: {net.online ? "Connected" : "Offline"}</div>
                    {net.type && <div>Type: {net.type.toUpperCase()}</div>}
                    {net.downlink && <div>Downlink: {net.downlink} Mbps</div>}
                    {net.rtt && <div>Latency: {net.rtt} ms</div>}
                </div>
            </div>
        </>
    );
}

"use client";

import { useNetworkStatus } from "@/src/hooks/useNetworkStatus";
import { motion } from "framer-motion";
import { WifiIcon, WifiOffIcon } from "lucide-react";

export function WifiPanel({ onCloseAction }: { onCloseAction: () => void }) {
    const net = useNetworkStatus();

    return (
        <>
            <div className="fixed inset-0 z-40" onMouseDown={onCloseAction} />

            <motion.div
                initial={{ opacity: 0, scale: 0.96, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -10 }}
                transition={{ duration: 0.15 }}
                className="fixed top-10 right-8 z-50 mt-2 w-64 rounded-xl border border-(--dock-border) bg-(--dock-bg) p-4 text-(--text-primary) shadow-2xl backdrop-blur-md"
            >
                <div className="text-md mb-2 flex items-center gap-2 font-semibold">
                    {net.online ? <WifiIcon /> : <WifiOffIcon />}
                    Network
                </div>

                <div className="space-y-1 opacity-90">
                    <div>Status: {net.online ? "Connected" : "Offline"}</div>
                    {net.type && <div>Type: {net.type.toUpperCase()}</div>}
                    {net.downlink && <div>Downlink: {net.downlink} Mbps</div>}
                    {net.rtt && <div>Latency: {net.rtt} ms</div>}
                </div>
            </motion.div>
        </>
    );
}

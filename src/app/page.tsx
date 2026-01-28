"use client";

import { Desktop } from "@/src/_components/Desktop/Desktop";
import { Wallpaper } from "@/src/_components/Wallpaper";
import { useSessionGuard } from "@/src/hooks/useSessionGuard";
import { useDesktopStore } from "@/src/store/desktop-store";
import { motion } from "framer-motion";

export default function Home() {
    const hydrated = useSessionGuard("unlocked");
    const wallpaper = useDesktopStore((s) => s.settings.wallpaper);

    return (
        <>
            {hydrated && <Desktop />}
            {hydrated && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.1 }}
                >
                    <Wallpaper url={wallpaper} />
                </motion.div>
            )}
        </>
    );
}

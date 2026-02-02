"use client";

import { LockScreen } from "@/src/components/LockScreen";
import { Wallpaper } from "@/src/components/Wallpaper";
import { useSessionGuard } from "@/src/hooks/useSessionGuard";
import { useDesktopStore } from "@/src/store/desktop-store";
import { motion } from "framer-motion";

export default function LockPage() {
    const hydrated = useSessionGuard("locked");
    const wallpaper = useDesktopStore((s) => s.settings.wallpaper);

    return (
        <>
            {hydrated && <LockScreen />}
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

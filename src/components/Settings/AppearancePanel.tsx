"use client";

import { AccentColor } from "@/src/components/apps/SettingsApp/AccentColor";
import { Theme } from "@/src/components/apps/SettingsApp/Theme";
import { motion } from "framer-motion";

export function AppearancePanel({
    onCloseAction,
}: {
    onCloseAction: () => void;
}) {
    return (
        <>
            <div className="fixed inset-0 z-40" onMouseDown={onCloseAction} />

            <motion.div
                initial={{ opacity: 0, scale: 0.96, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -10 }}
                transition={{ duration: 0.15 }}
                className="fixed top-10 right-8 z-50 mt-2 w-fit rounded-xl border border-(--dock-border) bg-(--dock-bg) p-4 shadow-2xl backdrop-blur-md"
            >
                <div className="flex flex-col items-center justify-center gap-2">
                    <div className="text-md flex flex-col justify-center gap-2.5 font-semibold text-(--text-primary)">
                        <span className="font-semibold text-(--text-strong)">
                            Theme
                        </span>
                        <Theme />
                    </div>
                    <div className="text-md flex flex-col justify-center gap-2.5 font-semibold text-(--text-primary)">
                        <div className="font-semibold text-(--text-primary)">
                            Accent color
                        </div>
                        <AccentColor />
                    </div>
                </div>
            </motion.div>
        </>
    );
}

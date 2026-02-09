import { withViewTransition } from "@/src/helpers/withViewTransition.helpers";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

const themes = ["light", "dark", "system"] as const;
type ThemeValue = (typeof themes)[number];

export function Theme() {
    const { theme, setTheme } = useTheme();

    const [mounted, setMounted] = useState(false);
    const [previewIndex, setPreviewIndex] = useState(0);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted || !theme) return;

        const realIndex = themes.indexOf(theme as ThemeValue);
        setPreviewIndex(realIndex);
    }, [theme, mounted]);

    if (!mounted) return null;

    return (
        <div
            className="bg-background relative inline-flex gap-1 rounded-xl border border-(--border-control) p-1 shadow-sm"
            style={{
                contain: "layout paint",
                willChange: "transform",
            }}
        >
            <motion.div
                className="pointer-events-none absolute inset-y-1 rounded-lg bg-[rgb(var(--accent))]/65"
                style={{
                    width: `calc((100% - 0.5rem) / 3)`,
                }}
                animate={{ x: `${previewIndex * 100}%` }}
                transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 40,
                }}
            />

            {themes.map((t, index) => (
                <button
                    key={t}
                    onClick={() => {
                        setPreviewIndex(index);
                        withViewTransition(() => setTheme(t));
                    }}
                    aria-pressed={theme === t}
                    className="relative z-10 rounded-lg px-4 py-2 text-sm font-medium text-(--text-secondary) transition-colors duration-200"
                >
                    {t === "light" ? (
                        <div className="flex items-center justify-center gap-1">
                            <Image
                                src="/icones/sun.webp"
                                alt=""
                                width={18}
                                height={18}
                            />
                            <span>Light</span>
                        </div>
                    ) : t === "dark" ? (
                        <div className="flex items-center justify-center gap-1">
                            <Image
                                src="/icones/moon.webp"
                                alt=""
                                width={18}
                                height={18}
                            />
                            <span>Dark</span>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center gap-1">
                            <Image
                                src="/icones/pc.webp"
                                alt=""
                                width={18}
                                height={18}
                            />
                            <span>System</span>
                        </div>
                    )}
                </button>
            ))}
        </div>
    );
}

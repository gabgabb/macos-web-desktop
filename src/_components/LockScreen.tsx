"use client";

import { useLiveClock } from "@/src/hooks/useLiveClock";
import { useDesktopStore } from "@/src/store/desktop-store";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";

export function LockScreen() {
    const [stage, setStage] = useState<0 | 1>(0);
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [shake, setShake] = useState<boolean>(false);

    const lastTriedRef = useRef<string>("");

    const { hhmm, dateLong } = useLiveClock();

    const hydrated = useDesktopStore((s) => s.hydrated);
    const requiredLen =
        useDesktopStore((s) => s.lockConfig?.passwordLength) ?? 6;
    const refreshSession = useDesktopStore((s) => s.refreshSession);

    if (!hydrated) return null;

    function triggerShake(message?: string) {
        setShake(true);
        if (message) setError(message);

        window.setTimeout(() => {
            setShake(false);
        }, 500);
    }

    async function tryUnlock(pwd: string) {
        if (loading) return;
        if (pwd.length !== requiredLen) return;
        if (lastTriedRef.current === pwd) return;

        lastTriedRef.current = pwd;
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/unlock", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: pwd }),
            });

            if (!res.ok) {
                throw new Error("Wrong password");
            }

            const data = await res.json();

            if (!data?.unlocked) {
                throw new Error("Unlock failed");
            }

            await refreshSession();
            setPassword("");
            setError(null);
            lastTriedRef.current = "";
        } catch {
            triggerShake("Wrong password");
            setPassword("");
            lastTriedRef.current = "";
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            data-testid="lock-screen"
            className="lock-screen absolute inset-0 z-10000 text-white"
            onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
        >
            <div className="absolute inset-0 bg-black/20" />
            <AnimatePresence mode="wait">
                {stage === 0 && (
                    <motion.div
                        key="stage-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="absolute inset-0 flex flex-col items-center justify-start pt-24 text-gray-200"
                        onClick={() => setStage(1)}
                    >
                        <div
                            className="mt-2 text-xl opacity-90 drop-shadow"
                            suppressHydrationWarning
                        >
                            {dateLong}
                        </div>
                        <div
                            className="text-8xl font-semibold tracking-tight drop-shadow-md"
                            suppressHydrationWarning
                        >
                            {hhmm}
                        </div>
                        <div className="mt-10 text-xs opacity-70">
                            Click anywhere to unlock
                        </div>
                    </motion.div>
                )}

                {stage === 1 && (
                    <motion.div
                        key="stage-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="absolute inset-0"
                        onMouseDown={() => {
                            setPassword("");
                            setError(null);
                            setStage(0);
                            lastTriedRef.current = "";
                        }}
                    >
                        <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div
                                onMouseDown={(e) => e.stopPropagation()}
                                initial={{ y: 24, opacity: 0, scale: 0.98 }}
                                animate={{
                                    y: 0,
                                    opacity: 1,
                                    scale: 1,
                                    x: shake
                                        ? [0, -12, 12, -10, 10, -6, 6, 0]
                                        : 0,
                                }}
                                exit={{ y: 24, opacity: 0, scale: 0.98 }}
                                transition={{
                                    y: { duration: 0.22 },
                                    opacity: { duration: 0.22 },
                                    scale: { duration: 0.22 },
                                    x: { duration: 0.45 },
                                }}
                                className="flex flex-col items-center gap-4"
                            >
                                <Image
                                    src="/Cameleon.webp"
                                    alt="User profile"
                                    width={650}
                                    height={256}
                                    priority
                                    className="size-60 -translate-y-10 rounded-full object-cover"
                                />

                                <div className="text-xl font-bold drop-shadow">
                                    User
                                </div>

                                <div className="w-80">
                                    <input
                                        data-testid="lock-input"
                                        id={"lock-input"}
                                        autoFocus
                                        disabled={loading}
                                        type="password"
                                        value={password}
                                        onChange={(e) => {
                                            const next = e.target.value.slice(
                                                0,
                                                requiredLen,
                                            );

                                            setPassword(next);
                                            setError(null);

                                            if (next.length === requiredLen) {
                                                tryUnlock(next);
                                            } else {
                                                lastTriedRef.current = "";
                                            }
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                if (
                                                    password.length !==
                                                    requiredLen
                                                ) {
                                                    triggerShake(
                                                        `Password must be ${requiredLen} characters`,
                                                    );
                                                    return;
                                                }
                                                tryUnlock(password);
                                            }

                                            if (e.key === "Escape") {
                                                setPassword("");
                                                setError(null);
                                                setStage(0);
                                                lastTriedRef.current = "";
                                            }
                                        }}
                                        placeholder="Password"
                                        className="w-full rounded-4xl border border-white/10 bg-white/15 px-4 py-3 outline-none placeholder:text-white/80 focus:ring-2 focus:ring-white/30 disabled:opacity-60"
                                    />
                                    <div className="mx-auto mt-5 w-1/2 rounded-3xl bg-white/10 p-2 text-center font-semibold text-amber-50 drop-shadow">
                                        Password : aurora
                                    </div>

                                    {error && (
                                        <div className="mt-2 text-center text-sm text-red-200/90 drop-shadow">
                                            {error}
                                        </div>
                                    )}
                                </div>

                                {loading && (
                                    <div className="text-xs opacity-80">
                                        Unlocking...
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

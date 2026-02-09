import { APP_ICONS } from "@/src/core/apps/icon-map";
import { AppDefinition } from "@/src/core/apps/types";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

export function DockIconButton({
    app,
    isOpen,
    bouncing,
    onHover,
    hovered,
    onClick,
    datatestid = app.id,
}: {
    app: AppDefinition;
    isOpen: boolean;
    bouncing: boolean;
    hovered: boolean;
    onHover: (v: boolean) => void;
    onClick: () => void;
    datatestid?: string;
}) {
    const icon = APP_ICONS[app.icon];
    return (
        <button
            data-testid={`dock-${datatestid}`}
            onMouseEnter={() => onHover(true)}
            onMouseLeave={() => onHover(false)}
            onClick={onClick}
            className="flex w-19 flex-col items-center justify-end select-none"
            title={app.title}
        >
            <div className="relative flex h-14 w-14 items-center justify-center">
                <motion.div
                    animate={{
                        scale: hovered ? 1.18 : 1,
                        y: hovered ? -6 : 0,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 420,
                        damping: 26,
                        mass: 0.5,
                    }}
                >
                    <motion.div
                        animate={
                            bouncing ? { y: [0, -12, 0, -7, 0] } : { y: 0 }
                        }
                        transition={{ duration: 0.45 }}
                    >
                        {typeof icon === "string" ? (
                            <Image
                                src={icon}
                                alt={app.title}
                                width={56}
                                height={56}
                                loading="eager"
                                className="pointer-events-none drop-shadow-md select-none"
                            />
                        ) : (
                            <div className="size-12">{icon}</div>
                        )}
                    </motion.div>
                </motion.div>
            </div>

            <div
                data-testid={`dock-${datatestid}-active`}
                className="mt-1 flex h-2 items-center justify-center"
            >
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            key="dot"
                            initial={{ opacity: 0, scale: 0.6, y: -2 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.6, y: -2 }}
                            transition={{ duration: 0.15 }}
                            className="bg-foreground/80 h-1.5 w-1.5 rounded-full"
                        />
                    )}
                </AnimatePresence>
            </div>
        </button>
    );
}

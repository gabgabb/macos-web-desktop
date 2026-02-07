export function withViewTransition(fn: () => void) {
    if (
        typeof document !== "undefined" &&
        "startViewTransition" in document &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
        // @ts-ignore
        document.startViewTransition(fn);
    } else {
        fn();
    }
}

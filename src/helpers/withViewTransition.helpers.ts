export function withViewTransition(fn: () => void) {
    if (
        typeof document !== "undefined" &&
        "startViewTransition" in document &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
        document.startViewTransition(fn);
    } else {
        fn();
    }
}

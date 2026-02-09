export async function withViewTransition(
    fn: () => void,
    nextMedia?: { type: "image" | "video"; src: string },
) {
    if (
        typeof document !== "undefined" &&
        "startViewTransition" in document &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
        if (nextMedia?.type === "image") {
            await preloadImage(nextMedia.src);
        }

        document.documentElement.classList.add("theme-switching");

        const transition = document.startViewTransition(() => {
            fn();
        });

        transition.finished.finally(() => {
            document.documentElement.classList.remove("theme-switching");
            window.dispatchEvent(new Event("theme-transition-end"));
        });
    } else {
        fn();
    }
}

function preloadImage(src: string) {
    return new Promise<void>((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve();
    });
}

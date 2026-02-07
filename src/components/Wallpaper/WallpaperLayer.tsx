export function WallpaperLayer({
    media,
    className,
}: {
    media: { type: "image" | "video"; src: string; poster?: string };
    className?: string;
}) {
    if (media.type === "video") {
        return (
            <video
                autoPlay
                loop
                muted
                playsInline
                className={`absolute inset-0 h-full w-full object-cover ${className}`}
                poster={media.poster}
            >
                <source src={media.src} type="video/mp4" />
            </video>
        );
    }

    return (
        <img
            src={media.src}
            alt=""
            draggable={false}
            className={`absolute inset-0 h-full w-full object-cover ${className}`}
        />
    );
}

import { useEffect, useRef } from "react";

export function WallpaperLayer({
    media,
    className,
}: {
    media: { type: "image" | "video"; src: string; poster?: string };
    className?: string;
}) {
    const imgRef = useRef<HTMLImageElement | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        if (media.type === "image" && imgRef.current) {
            if (imgRef.current.src !== media.src) {
                imgRef.current.src = media.src;
            }
        }

        if (media.type === "video" && videoRef.current) {
            if (videoRef.current.src !== media.src) {
                videoRef.current.src = media.src;
                videoRef.current.load();
                videoRef.current.play().catch(() => {});
            }
        }
    }, [media]);

    if (media.type === "video") {
        return (
            <video
                data-testid="wallpaper-video"
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                className={`absolute inset-0 h-full w-full object-cover ${className}`}
                poster={media.poster}
            />
        );
    }

    return (
        <img
            data-testid="wallpaper"
            ref={imgRef}
            alt=""
            draggable={false}
            className={`absolute inset-0 h-full w-full object-cover ${className}`}
        />
    );
}

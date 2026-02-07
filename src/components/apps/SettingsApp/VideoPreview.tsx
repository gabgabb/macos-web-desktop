import { useRef } from "react";

export function VideoPreview({ src, poster }: { src: string; poster: string }) {
    const ref = useRef<HTMLVideoElement>(null);

    const safePlay = (video: HTMLVideoElement) => {
        const p = video.play();
        if (p !== undefined) {
            p.catch(() => {});
        }
    };

    const safePause = (video: HTMLVideoElement) => {
        try {
            video.pause();
        } catch {}
    };

    const onEnter = () => {
        if (!ref.current) return;
        safePlay(ref.current);
    };

    const onLeave = () => {
        if (!ref.current) return;
        safePause(ref.current);
    };

    return (
        <video
            ref={ref}
            muted
            loop
            playsInline
            preload="none"
            poster={poster}
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
            disablePictureInPicture
            className="absolute inset-0 opacity-0 transition-opacity hover:opacity-100"
        >
            <source src={src} type="video/mp4" />
        </video>
    );
}

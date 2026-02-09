import { VideoPreview } from "@/src/components/apps/SettingsApp/VideoPreview";
import { Wallpaper } from "@/src/core/apps/types";
import { withViewTransition } from "@/src/helpers/withViewTransition.helpers";
import Image from "next/image";
import React from "react";

export function WallpaperGrid({
    title,
    wallpapers,
    activeId,
    onSelect,
    ref,
}: {
    title: string;
    wallpapers: Wallpaper[];
    activeId: string;
    onSelect: (w: Wallpaper) => void;
    ref: React.Ref<HTMLDivElement>;
}) {
    if (wallpapers.length === 0) return null;

    return (
        <section ref={ref}>
            <div className="mb-2 text-base font-semibold">{title}</div>

            <div className="flex flex-wrap gap-3">
                {wallpapers.map((w) => {
                    const thumb =
                        w.thumb ??
                        (w.media.type === "image"
                            ? w.media.src
                            : w.media.poster);

                    return (
                        <button
                            key={w.id}
                            onClick={() =>
                                withViewTransition(() => onSelect(w))
                            }
                            className={`relative h-40 w-72 overflow-hidden rounded-2xl ring-3 transition-all duration-200 ${
                                activeId === w.id
                                    ? "ring-[rgb(var(--accent))]"
                                    : "ring-transparent hover:ring-white/40"
                            }`}
                        >
                            {thumb && (
                                <Image
                                    src={thumb}
                                    alt=""
                                    fill
                                    sizes="(max-width: 768px) 100vw, 288px"
                                    className="object-cover"
                                    priority={false}
                                />
                            )}

                            {w.media.type === "video" && (
                                <VideoPreview
                                    src={w.media.src}
                                    poster={w.media.poster}
                                />
                            )}
                        </button>
                    );
                })}
            </div>
        </section>
    );
}

"use client";

import Image from "next/image";
import { useState } from "react";

export function Wallpaper({ url }: { url: string }) {
    const [loaded, setLoaded] = useState(false);

    return (
        <div
            data-testid="wallpaper"
            className="absolute inset-0"
            style={{
                backgroundImage: `url(${url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <Image
                data-testid={url}
                src={url}
                alt="Wallpaper"
                fill
                sizes="100vw"
                className={`object-cover transition-opacity duration-300 ${
                    loaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setLoaded(true)}
            />
        </div>
    );
}

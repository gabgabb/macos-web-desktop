"use client";

import Image from "next/image";
import { useState } from "react";

export function Wallpaper() {
    const [loaded, setLoaded] = useState(false);

    return (
        <div
            className="absolute inset-0"
            style={{
                backgroundImage: "url('/Big-Sur-Color-Day.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <Image
                src="/Big-Sur-Color-Day.jpg"
                alt="Wallpaper"
                fill
                priority
                sizes="100vw"
                className={`object-cover transition-opacity duration-300 ${
                    loaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setLoaded(true)}
            />
        </div>
    );
}

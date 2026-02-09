import type { Metadata, Viewport } from "next";
import React from "react";
import "./globals.css";

export const metadata: Metadata = {
    title: {
        default: "macOS Web",
        template: "%s · macOS Web",
    },
    description:
        "A macOS-like desktop environment built with Next.js, React and Web APIs. Run apps, windows, and even DOOM in your browser.",

    applicationName: "macOS Web",
    generator: "Next.js",
    keywords: [
        "macOS",
        "desktop",
        "web OS",
        "Next.js",
        "React",
        "window manager",
        "DOOM",
        "WebAssembly",
    ],
    authors: [{ name: "Gabriel Filiot" }],
    creator: "Gabriel Filiot",
    openGraph: {
        type: "website",
        title: "macOS Web",
        description:
            "A macOS-like desktop environment built with Next.js. Apps, windows, DOOM, and more.",
        siteName: "macOS Web",
        images: [
            {
                url: "/desktop.webp",
                width: 1200,
                height: 630,
                alt: "macOS Web Desktop Preview",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "macOS Web",
        description:
            "A macOS-like desktop environment built with Next.js and React.",
        images: ["/desktop.webp"],
    },
    formatDetection: {
        telephone: false,
    },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    if (process.env.NODE_ENV === "test") {
        // @ts-ignore
        window.__coverage__ = {};
        document.documentElement.setAttribute("data-e2e", "true");
    }

    return (
        <html lang="en">
            <body className={`antialiased`}>{children}</body>
        </html>
    );
}

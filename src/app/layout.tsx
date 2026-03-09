import type { Metadata, Viewport } from "next";
import React from "react";
import "./globals.css";

const siteUrl = "https://macos.gabriaile.dev";

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: "macOS Web – A macOS-like desktop in your browser",
        template: "%s · macOS Web",
    },
    description:
        "A macOS-like desktop environment built with Next.js and React. Run apps, manage windows, and even play DOOM directly in your browser.",
    applicationName: "macOS Web",
    generator: "Next.js",
    keywords: [
        "macOS Web",
        "web desktop",
        "browser OS",
        "Next.js app",
        "React",
        "window manager",
        "DOOM",
    ],
    authors: [{ name: "Gabriel Filiot", url: "https://gabriaile.dev" }],
    creator: "Gabriel Filiot",
    alternates: {
        canonical: siteUrl,
    },
    openGraph: {
        type: "website",
        url: siteUrl,
        title: "macOS Web – A macOS-like Desktop in Your Browser",
        description:
            "Experience a macOS-inspired desktop environment built with modern web technologies. Apps, windows, animations, and even DOOM.",
        siteName: "macOS Web",
        images: [
            {
                url: `${siteUrl}/desktop.webp`,
                width: 1200,
                height: 630,
                alt: "macOS Web Desktop Preview",
            },
        ],
        locale: "en_US",
    },

    twitter: {
        card: "summary_large_image",
        title: "macOS Web – Run a Desktop in Your Browser",
        description:
            "A macOS-like desktop built with Next.js and React. Windows, apps, and DOOM directly in your browser.",
        creator: "@gaaab_gab1",
        images: ["/desktop.webp"],
    },

    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
        },
    },

    icons: {
        icon: "/favicon.ico",
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
    if (process.env.NODE_ENV === "test" && typeof window !== "undefined") {
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

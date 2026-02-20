"use client";

import { AccessDenied } from "@/src/components/apps/SafariApp/pages/AccessDenied";
import { ErrorPage } from "@/src/components/apps/SafariApp/pages/ErrorPage";
import { GooglePage } from "@/src/components/apps/SafariApp/pages/GooglePage";
import { GoogleSearch } from "@/src/components/apps/SafariApp/pages/GoogleSearch";
import { AuroraPage } from "@/src/components/apps/SafariApp/pages/internal/AuroraPage";
import { Log01Page } from "@/src/components/apps/SafariApp/pages/internal/Log01Page";
import { PublicPage } from "@/src/components/apps/SafariApp/pages/internal/PublicPage";
import { SafariHome } from "@/src/components/apps/SafariApp/pages/SafariHome";
import { SafariController } from "@/src/core/apps/types";
import React from "react";

type InternalRoute = {
    component: any;
    requiresLevel?: number;
};

const internalRoutes: Record<string, InternalRoute> = {
    "public.internal": { component: PublicPage },
    "log01.internal": { component: Log01Page },
    "aurora.internal": { component: AuroraPage, requiresLevel: 2 },
};

export function SafariContent({ safari }: { safari: SafariController }) {
    const { location } = safari;

    let Page: React.ReactNode = <ErrorPage />;

    switch (location.kind) {
        case "home":
            Page = <SafariHome safari={safari} />;
            break;

        case "search":
            Page = (
                <GoogleSearch
                    query={location.query}
                    navigate={(url) => safari.push({ kind: "page", url })}
                    safari={safari}
                />
            );
            break;

        case "page":
            try {
                const url = new URL(location.url);
                const hostname = url.hostname;

                if (hostname.includes("google.com") && url.pathname === "/") {
                    Page = <GooglePage safari={safari} />;
                    break;
                }

                const internalRoute = internalRoutes[hostname];
                if (internalRoute) {
                    if (!safari.hasAccess(internalRoute.requiresLevel)) {
                        Page = <AccessDenied />;
                    } else {
                        const Component = internalRoute.component;
                        Page = <Component safari={safari} />;
                    }
                    break;
                }

                if (
                    hostname.includes("google.com") &&
                    url.pathname === "/search"
                ) {
                    const query = url.searchParams.get("q") ?? "";
                    Page = (
                        <GoogleSearch
                            query={query}
                            navigate={(u) =>
                                safari.push({ kind: "page", url: u })
                            }
                            safari={safari}
                        />
                    );
                    break;
                }
            } catch {
                Page = <ErrorPage />;
            }
            break;
    }

    return (
        <div className="relative h-full w-full">
            {Page}

            {safari.isLoading && (
                <div className="bg-background/70 absolute inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
                    <div className="border-foreground size-10 animate-spin rounded-full border-2 border-t-transparent" />
                </div>
            )}
        </div>
    );
}

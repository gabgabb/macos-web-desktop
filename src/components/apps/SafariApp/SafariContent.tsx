import { ErrorPage } from "@/src/components/apps/SafariApp/pages/ErrorPage";
import { GoogleSearch } from "@/src/components/apps/SafariApp/pages/GoogleSearch";
import { SafariHome } from "@/src/components/apps/SafariApp/pages/SafariHome";
import { StaticPage } from "@/src/components/apps/SafariApp/pages/StaticFile";

export function SafariContent({ safari }: any) {
    const { location } = safari;

    switch (location.kind) {
        case "home":
            return (
                <SafariHome
                    onSearch={(q) => safari.push({ kind: "search", query: q })}
                    navigate={(url) => safari.push({ kind: "page", url })}
                />
            );

        case "search":
            return (
                <GoogleSearch
                    query={location.query}
                    navigate={(url) => safari.push({ kind: "page", url })}
                />
            );

        case "page":
            return <StaticPage url={location.url} />;

        default:
            return <ErrorPage />;
    }
}

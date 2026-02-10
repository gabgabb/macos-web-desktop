import { useSafariState } from "@/src/components/apps/SafariApp/safari.state";
import { SafariContent } from "@/src/components/apps/SafariApp/SafariContent";
import { SafariToolbar } from "@/src/components/apps/SafariApp/SafariToolBar";

export function SafariApp() {
    const safari = useSafariState();

    return (
        <div className="flex h-full flex-col">
            <SafariToolbar safari={safari} />
            <SafariContent safari={safari} />
        </div>
    );
}

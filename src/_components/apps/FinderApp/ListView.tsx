import { iconFor } from "@/src/_components/apps/FinderApp/FinderApp";
import { AppId } from "@/src/core/apps/types";
import { FsNode } from "@/src/core/fs/types";
import { useDesktopStore } from "@/src/store/desktop-store";

export function ListView({
    entries,
    selected,
    setSelected,
    onOpenDir,
}: {
    entries: Array<[string, FsNode]>;
    selected: string | null;
    setSelected: (name: string | null) => void;
    onOpenDir: (name: string) => void;
}) {
    const openApp = useDesktopStore((s) => s.openApp);

    function handleOpen(name: string, node: FsNode) {
        if (node.type === "dir") {
            onOpenDir(name);
        }

        if (node.type === "app") {
            openApp(node.id as AppId);
        }
    }

    return (
        <div className="mt-2 flex flex-col overflow-y-auto border-t border-gray-200">
            {entries.length === 0 && (
                <div className="mt-4 flex items-center justify-center">
                    No items to display.
                </div>
            )}
            {entries.map(([name, child], index) => (
                <button
                    key={name}
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelected(name);
                    }}
                    onDoubleClick={(e) => {
                        e.stopPropagation();
                        handleOpen(name, child);
                    }}
                    className={`${selected === name ? "bg-blue-400/15!" : ""} flex items-center justify-start gap-2 py-2 pl-2 text-center transition hover:bg-gray-200 ${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
                >
                    <div className="w-8">{iconFor(child, name)}</div>
                    <div className="text-md truncate">{name}</div>
                </button>
            ))}
        </div>
    );
}

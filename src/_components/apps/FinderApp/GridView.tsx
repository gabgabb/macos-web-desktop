import { iconFor } from "@/src/_components/apps/FinderApp/FinderApp";
import { AppId } from "@/src/core/apps/types";
import { FsNode } from "@/src/core/fs/types";
import { useDesktopStore } from "@/src/store/desktop-store";

export function GridView({
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
        <div className="mt-2 overflow-y-auto border-t border-gray-200 px-4 pb-1">
            {entries.length === 0 && (
                <div className="mt-4 flex items-center justify-center">
                    No items to display.
                </div>
            )}
            <div className="mt-2 flex w-fit flex-wrap gap-4">
                {entries.map(([name, node]) => (
                    <button
                        key={name}
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelected(name);
                        }}
                        onDoubleClick={(e) => {
                            e.stopPropagation();
                            handleOpen(name, node);
                        }}
                        className={`flex flex-col items-center rounded-xl p-2 text-center transition ${
                            selected === name
                                ? "bg-blue-500/20 ring-1 ring-blue-400"
                                : "hover:bg-gray-200"
                        } `}
                    >
                        <div className="flex h-10 w-10 justify-center">
                            {iconFor(node, name)}
                        </div>
                        <div className="mt-2 w-16 truncate text-xs">{name}</div>
                    </button>
                ))}
            </div>
        </div>
    );
}

import { iconFor } from "@/src/components/apps/FinderApp/FinderApp";
import { openNode } from "@/src/core/fs/openNode";
import { FinderEntry } from "@/src/core/fs/types";

export function GridView({
    entries,
    selected,
    setSelected,
    cwd,
    exitSearchAndNavigate,
}: {
    entries: FinderEntry[];
    selected: string | null;
    setSelected: (name: string | null) => void;
    cwd: string[];
    exitSearchAndNavigate: () => void;
}) {
    return (
        <div
            data-testid="finder-grid"
            className="mt-2 overflow-y-auto border-t border-(--border-control)/70 px-4 pb-1"
        >
            {entries.length === 0 && (
                <div className="mt-4 flex items-center justify-center">
                    No items to display.
                </div>
            )}
            <div className="mt-2 flex w-fit flex-wrap gap-4">
                {entries.map(({ name, node, path }) => (
                    <button
                        data-testid={`finder-item-${name}`}
                        key={name}
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelected(name);
                        }}
                        onDoubleClick={(e) => {
                            e.stopPropagation();
                            openNode(
                                name,
                                node,
                                path.slice(0, -1),
                                exitSearchAndNavigate,
                            );
                        }}
                        className={`group flex flex-col items-center rounded-xl p-2 text-center transition ${
                            selected === name
                                ? "bg-blue-500/20 ring-1 ring-blue-400"
                                : "hover:bg-(--border-soft)"
                        }`}
                    >
                        <div className="flex h-10 w-10 justify-center">
                            {iconFor(node, name)}
                        </div>

                        <div className="mt-2 line-clamp-1 w-18 text-xs break-all group-hover:line-clamp-3 group-focus:line-clamp-2">
                            {name}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}

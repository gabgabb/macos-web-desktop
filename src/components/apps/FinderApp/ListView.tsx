import { iconFor } from "@/src/components/apps/FinderApp/FinderApp";
import { openNode } from "@/src/core/fs/openNode";
import { FinderEntry } from "@/src/core/fs/types";

export function ListView({
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
        <div className="mt-2 flex flex-col overflow-y-auto border-t border-(--border-control)/70">
            {entries.length === 0 && (
                <div className="mt-4 flex items-center justify-center">
                    No items to display.
                </div>
            )}
            {entries.map(({ name, node, path }, index) => (
                <button
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
                    className={`${selected === name ? "bg-blue-400/15!" : ""} flex items-center justify-start gap-2 py-2 pl-2 text-center transition-all hover:bg-(--border-soft) ${index % 2 === 0 ? "bg-(--row-even)" : "bg-(--window)"}`}
                >
                    <div className="w-8">{iconFor(node, name)}</div>
                    <div className="text-md truncate">{name}</div>
                </button>
            ))}
        </div>
    );
}

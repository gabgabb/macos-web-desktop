import { AppId } from "@/src/core/apps/types";
import { useDesktopStore } from "@/src/store/desktop-store";
import { FS } from "./fs.service";
import { FsNode } from "./types";

export function openNode(
    name: string,
    node: FsNode,
    parentPath: string[],
    exitSearchAndNavigate?: () => void,
) {
    const store = useDesktopStore.getState();

    if (node.type === "dir") {
        FS.cd("/" + [...parentPath, name].join("/"));
        store.refreshFs();
        exitSearchAndNavigate?.();
        return;
    }

    if (node.type === "file") {
        store.openApp("preview");

        store.setActiveFile?.({
            name,
            path: parentPath,
        });
    }

    if (node.type === "app") {
        store.openApp(node.id as AppId);
    }
}

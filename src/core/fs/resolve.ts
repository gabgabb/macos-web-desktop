import { FsNode } from "./types";

export function resolvePath(
    root: FsNode,
    cwd: string[],
    path: string,
): { node: FsNode | null; cwd: string[] } {
    const parts =
        path === "/"
            ? []
            : path.startsWith("/")
              ? path.split("/").filter(Boolean)
              : [...cwd, ...path.split("/").filter(Boolean)];

    let node: FsNode = root;
    const resolved: string[] = [];

    for (const part of parts) {
        if (part === ".") continue;
        if (part === "..") {
            resolved.pop();
            continue;
        }

        if (node.type !== "dir" || !(part in node.children)) {
            return { node: null, cwd };
        }

        node = node.children[part];
        resolved.push(part);
    }

    return { node, cwd: resolved };
}

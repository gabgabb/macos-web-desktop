import { FS } from "@/src/core/fs/fs.service";

export const FileStorage = {
    async readText(path: string[]) {
        return FS.readFile(path);
    },

    async writeText(path: string[], content: string) {
        FS.writeFile(path.join("/"), content);
    },

    async listDir(path: string[]) {
        const node = FS.getNode(path);
        if (!node || node.type !== "dir") return [];
        return Object.keys(node.children);
    },

    async stat(path: string[]) {
        const node = FS.getNode(path);
        return node?.type ?? null;
    },
};

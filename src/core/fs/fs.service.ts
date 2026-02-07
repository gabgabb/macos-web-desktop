import { APP_ICONS } from "@/src/core/apps/icon-map";
import { APP_REGISTRY } from "@/src/core/apps/registry";
import { resolvePath } from "./resolve";
import { FsNode } from "./types";

function searchNode(
    node: FsNode,
    path: string[],
    query: string,
    results: Array<{ name: string; node: FsNode; path: string[] }>,
) {
    if (node.type === "dir") {
        for (const [name, child] of Object.entries(node.children)) {
            const nextPath = [...path, name];

            if (name.toLowerCase().includes(query)) {
                results.push({ name, node: child, path: nextPath });
            }

            searchNode(child, nextPath, query, results);
        }
    }
}

const applicationsDir: FsNode = {
    type: "dir",
    children: Object.fromEntries(
        Object.entries(APP_REGISTRY)
            .filter(([, app]) => app.showInDock && app.showOnDesktop)
            .map(([id, app]) => [
                `${app.title}`,
                {
                    type: "app",
                    id: id,
                    title: app.title,
                    icon: APP_ICONS[app.icon],
                },
            ]),
    ),
};

let root: FsNode = {
    type: "dir",
    children: {
        home: {
            type: "dir",
            children: {
                user: {
                    type: "dir",
                    children: {
                        Desktop: {
                            type: "dir",
                            children: {
                                "todo.txt": {
                                    type: "file",
                                    content: "Buy milk",
                                },
                                "notes.txt": {
                                    type: "file",
                                    content: "Meeting at 10",
                                },
                                "screenshot.png": { type: "file", content: "" },
                            },
                        },
                        Documents: {
                            type: "dir",
                            children: {
                                "CV_Gabriel_EN.pdf": {
                                    type: "file",
                                    content: "",
                                },
                                "cover-letter.txt": {
                                    type: "file",
                                    content: "Dear recruiter...",
                                },
                                LeagueOfLegends: {
                                    type: "dir",
                                    children: {
                                        "how_to_make_babies.txt": {
                                            type: "file",
                                            content:
                                                "Un moment de détente bien mérité après la venue au monde d'Elena.\n" +
                                                "De la part de Louis, Dimitri, Raph, Thibault, Sylvain, Olivier et Gabriel",
                                        },
                                        "how_to_become_good_parents.pdf": {
                                            type: "file",
                                            content: "",
                                        },
                                    },
                                },
                                Projects: {
                                    type: "dir",
                                    children: {
                                        "finder.md": {
                                            type: "file",
                                            content: "# Finder App\nFake FS",
                                        },
                                        "terminal.md": {
                                            type: "file",
                                            content: "# Terminal",
                                        },
                                        Web: {
                                            type: "dir",
                                            children: {
                                                "index.html": {
                                                    type: "file",
                                                    content: "<html>cc</html>",
                                                },
                                                "style.css": {
                                                    type: "file",
                                                    content: "body {}",
                                                },
                                            },
                                        },
                                    },
                                },
                                Invoices: {
                                    type: "dir",
                                    children: {
                                        "invoice-jan.pdf": {
                                            type: "file",
                                            content: "",
                                        },
                                        "invoice-feb.pdf": {
                                            type: "file",
                                            content: "",
                                        },
                                    },
                                },
                            },
                        },
                        Downloads: {
                            type: "dir",
                            children: {
                                "image.png": { type: "file", content: "" },
                                "archive.zip": { type: "file", content: "" },
                                "setup.dmg": { type: "file", content: "" },
                            },
                        },
                        Shared: {
                            type: "dir",
                            children: {
                                "readme.txt": {
                                    type: "file",
                                    content: "Shared folder",
                                },
                                "team.png": { type: "file", content: "" },
                            },
                        },
                    },
                },
            },
        },
        apps: applicationsDir,
    },
};

let cwd: string[] = ["home", "user"];

export const FS = {
    getCwd() {
        return [...cwd];
    },

    pwd() {
        return "/" + cwd.join("/");
    },

    cd(path: string) {
        const { node, cwd: next } = resolvePath(root, cwd, path);
        if (!node || node.type !== "dir") {
            throw new Error("Not a directory");
        }
        cwd = next;
    },

    ls(path = ".") {
        const { node } = resolvePath(root, cwd, path);
        if (!node || node.type !== "dir") {
            throw new Error("Not a directory");
        }
        return Object.keys(node.children);
    },

    readFile(path: string[]) {
        let node: FsNode = root;
        for (const p of path) {
            if (node.type !== "dir") {
                throw new Error("Not a file");
            }
            node = node.children[p];
        }
        if (node.type !== "file") {
            throw new Error("Not a file");
        }
        return node.content;
    },

    writeFile(path: string, content: string) {
        const { node } = resolvePath(root, cwd, path);
        if (!node || node.type !== "file") {
            throw new Error("Not a file");
        }
        node.content = content;
    },

    touch(name: string) {
        const { node } = resolvePath(root, cwd, ".");
        if (!node || node.type !== "dir") return;
        node.children[name] = { type: "file", content: "" };
    },

    mkdir(name: string) {
        const { node } = resolvePath(root, cwd, ".");
        if (!node || node.type !== "dir") return;
        node.children[name] = { type: "dir", children: {} };
    },

    getNode(path: string[] = cwd) {
        let node: FsNode = root;
        for (const p of path) {
            if (node.type !== "dir") return null;
            node = node.children[p];
        }
        return node;
    },

    search(query: string) {
        const results: Array<{ name: string; node: FsNode; path: string[] }> =
            [];
        searchNode(root, [], query.toLowerCase(), results);
        return results;
    },
};

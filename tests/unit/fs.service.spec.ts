import { FS } from "@/src/core/fs/fs.service";
import { beforeEach, describe, expect, it } from "vitest";

describe("FS service", () => {
    beforeEach(() => {
        FS.cd("/home/user");
    });

    it("pwd returns current path", () => {
        expect(FS.pwd()).toBe("/home/user");
    });

    it("throws when cd into file", () => {
        expect(() => FS.cd("Desktop/todo.txt")).toThrow();
    });

    it("cd navigates to a directory", () => {
        FS.cd("Documents");
        expect(FS.pwd()).toBe("/home/user/Documents");
    });

    it("ls lists directory content", () => {
        const files = FS.ls("Documents");
        expect(files).toContain("CV_Gabriel_EN.pdf");
    });

    it("cd throws if target is not a directory", () => {
        expect(() => FS.cd("Documents/CV_Gabriel_EN.pdf")).toThrow();
    });

    it("search finds files recursively", () => {
        const results = FS.search("invoice");
        expect(results.some((r) => r.name.includes("invoice"))).toBe(true);
    });

    it("search finds nested files", () => {
        const results = FS.search("finder");
        expect(results.some((r) => r.name === "finder.md")).toBe(true);
    });
});

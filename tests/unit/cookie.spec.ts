import {
    signUnlockedCookie,
    verifyUnlockedCookie,
    verifyUnlockedCookieEdge,
} from "@/src/core/auth/osUnlockCookie";
import crypto from "crypto";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("unlock cookie (node)", () => {
    const SECRET = "test-secret";

    beforeEach(() => {
        vi.resetModules();
        process.env.COOKIE_SIGN_SECRET = SECRET;
    });

    it("signs and verifies a valid cookie", () => {
        const cookie = signUnlockedCookie();

        expect(typeof cookie).toBe("string");
        expect(cookie.split(".")).toHaveLength(2);

        expect(verifyUnlockedCookie(cookie)).toBe(true);
    });

    it("returns false for missing cookie", () => {
        expect(verifyUnlockedCookie(undefined)).toBe(false);
    });

    it("returns false for malformed cookie", () => {
        expect(verifyUnlockedCookie("invalid")).toBe(false);
        expect(verifyUnlockedCookie("a.b.c")).toBe(false);
    });

    it("returns false if payload is tampered", () => {
        const cookie = signUnlockedCookie();
        const [raw, sig] = cookie.split(".");

        const decoded = Buffer.from(raw, "base64").toString();
        const hacked = Buffer.from(
            JSON.stringify({ u: false, t: Date.now() }),
        ).toString("base64");

        const forged = `${hacked}.${sig}`;

        expect(verifyUnlockedCookie(forged)).toBe(false);
    });

    it("returns false if signature is invalid", () => {
        const cookie = signUnlockedCookie();
        const [raw] = cookie.split(".");

        const bad = `${raw}.deadbeef`;

        expect(verifyUnlockedCookie(bad)).toBe(false);
    });
});

describe("unlock cookie (edge)", () => {
    const SECRET = "edge-secret";

    it("returns false for invalid cookie", async () => {
        const ok = await verifyUnlockedCookieEdge("invalid", SECRET);
        expect(ok).toBe(false);
    });

    it("returns false if signature does not match", async () => {
        const cookie = signUnlockedCookie();
        const [raw] = cookie.split(".");

        const forged = `${raw}.deadbeef`;

        const ok = await verifyUnlockedCookieEdge(forged, SECRET);
        expect(ok).toBe(false);
    });

    it("returns false if payload is invalid JSON", async () => {
        const raw = Buffer.from("not-json").toString("base64");
        const sig = crypto
            .createHmac("sha256", SECRET)
            .update("not-json")
            .digest("hex");

        const cookie = `${raw}.${sig}`;

        const ok = await verifyUnlockedCookieEdge(cookie, SECRET);
        expect(ok).toBe(false);
    });
});

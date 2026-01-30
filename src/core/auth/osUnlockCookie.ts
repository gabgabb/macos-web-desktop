import crypto from "crypto";

const COOKIE_SECRET = process.env.COOKIE_SIGN_SECRET!;

type UnlockPayload = {
    u: true;
    t: number;
};

export function signUnlockedCookie(): string {
    const payload: UnlockPayload = {
        u: true,
        t: Date.now(),
    };

    const raw = JSON.stringify(payload);
    const signature = crypto
        .createHmac("sha256", COOKIE_SECRET)
        .update(raw)
        .digest("hex");

    return Buffer.from(raw).toString("base64") + "." + signature;
}

export function verifyUnlockedCookie(value?: string): boolean {
    if (!value) return false;

    const [raw, sig] = value.split(".");
    if (!raw || !sig) return false;

    try {
        const decoded = Buffer.from(raw, "base64").toString();
        const expectedSig = crypto
            .createHmac("sha256", COOKIE_SECRET)
            .update(decoded)
            .digest("hex");

        if (sig !== expectedSig) return false;

        const payload = JSON.parse(decoded) as UnlockPayload;
        return payload.u;
    } catch {
        return false;
    }
}

function hex(buffer: ArrayBuffer) {
    return [...new Uint8Array(buffer)]
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}

async function hmacSHA256(secret: string, message: string): Promise<string> {
    const key = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"],
    );

    const sig = await crypto.subtle.sign(
        "HMAC",
        key,
        new TextEncoder().encode(message),
    );

    return hex(sig);
}

export async function verifyUnlockedCookieEdge(
    value: string | undefined,
    secret: string,
): Promise<boolean> {
    if (!value) return false;

    const [raw, sig] = value.split(".");
    if (!raw || !sig) return false;

    try {
        const decoded = atob(raw);
        const expectedSig = await hmacSHA256(secret, decoded);

        if (sig !== expectedSig) return false;

        const payload = JSON.parse(decoded);
        return payload.u === true;
    } catch {
        return false;
    }
}

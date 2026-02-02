"use client";

import { useState } from "react";
import { DoomLauncher } from "./DoomLauncher";
import { DoomRuntime } from "./DoomRuntime";

export function DoomApp() {
    const [wad, setWad] = useState<string | null>(null);

    if (!wad) {
        return <DoomLauncher onLaunch={setWad} />;
    }

    return <DoomRuntime wad={wad} onExit={() => setWad(null)} />;
}

import { DesktopState } from "@/src/store/desktop-store";
import { saveSnapshot } from "@/src/store/persist";

export function persistDesktop(get: () => DesktopState) {
    const {
        windows,
        activeWindowId,
        topZ,
        notes,
        terminal,
        settings,
        audio,
        ui,
        progress,
        slack,
        activeFile,
    } = get();

    saveSnapshot({
        windows,
        activeWindowId,
        topZ,
        notes,
        terminal,
        settings,
        audio,
        ui,
        progress,
        slack,
        activeFile,
    });
}

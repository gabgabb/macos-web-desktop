import { ACCENTS } from "@/src/core/ui/ui-constants";
import { useDesktopStore } from "@/src/store/desktop-store";

export function AccentColor() {
    const accentColor = useDesktopStore((s) => s.settings.accentColor);
    const setAccent = useDesktopStore((s) => s.setAccentColor);

    return (
        <div className="flex gap-2">
            {Object.entries(ACCENTS).map(([key, value]) => {
                const active = accentColor === key;

                return (
                    <button
                        key={key}
                        data-testid={`accent-${key}`}
                        onClick={() => setAccent(key as any)}
                        className={`relative h-8 w-8 rounded-full ring-2 transition ${
                            active
                                ? "ring-accent scale-110"
                                : "ring-transparent hover:scale-105"
                        }`}
                        style={{
                            backgroundColor: `rgb(${value})`,
                        }}
                        aria-label={key}
                    />
                );
            })}
        </div>
    );
}

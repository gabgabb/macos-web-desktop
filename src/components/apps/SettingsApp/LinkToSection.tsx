import React from "react";

export function LinkToSection({
    ref,
    content,
}: {
    ref: React.RefObject<HTMLDivElement | null>;
    content: string;
}) {
    return (
        <div
            className="mt-1 w-full rounded-lg p-2 transition-all hover:cursor-pointer hover:bg-(--border-soft) hover:font-bold"
            onClick={() =>
                ref?.current?.scrollIntoView({
                    behavior: "smooth",
                })
            }
        >
            {content}
        </div>
    );
}

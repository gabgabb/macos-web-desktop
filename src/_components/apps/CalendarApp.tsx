"use client";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function CalendarApp() {
    const now = new Date();

    return (
        <div className="p-4 text-white">
            <h2 className="mb-2 text-lg font-semibold">
                {now.toLocaleString("default", { month: "long" })}{" "}
                {now.getFullYear()}
            </h2>

            <div className="grid grid-cols-7 gap-2 text-center">
                {days.map((d) => (
                    <div key={d} className="opacity-70">
                        {d}
                    </div>
                ))}

                {Array.from({ length: 35 }).map((_, i) => (
                    <div key={i} className="rounded p-2 hover:bg-white/10">
                        {i + 1 <= 31 ? i + 1 : ""}
                    </div>
                ))}
            </div>
        </div>
    );
}

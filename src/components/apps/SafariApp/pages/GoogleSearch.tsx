const FAKE_RESULTS = [
    {
        title: "Aurora Borealis – Wikipedia",
        url: "https://en.wikipedia.org/wiki/Aurora",
        description: "An aurora is a natural light display in Earth's sky.",
    },
    {
        title: "Aurora lights forecast",
        url: "https://example.com/aurora-forecast",
        description: "Check the latest aurora activity predictions.",
    },
    {
        title: "Aurora research initiative",
        url: "https://example.com/aurora-research",
        description: "Overview of scientific research programs named Aurora.",
    },
];

export function GoogleSearch({
    query,
    navigate,
}: {
    query: string;
    navigate: (url: string) => void;
}) {
    return (
        <div className="h-full bg-(--sidebar)">
            <div className="mt-12 flex flex-col items-center justify-center">
                <h1 className="mb-6 text-4xl font-bold">Google</h1>

                <p className="mb-8 text-sm text-white/60">
                    Results for <strong>{query}</strong>
                </p>

                <ul className="space-y-6">
                    {FAKE_RESULTS.map((r, i) => (
                        <li key={i}>
                            <p
                                className="cursor-pointer text-blue-400 underline"
                                onClick={() => navigate(r.url)}
                            >
                                {r.title}
                            </p>
                            <p className="text-xs text-white/50">{r.url}</p>
                            <p className="text-sm text-white/70">
                                {r.description}
                            </p>
                        </li>
                    ))}

                    {/* Résultat interne (juste du contenu pour l’instant) */}
                    <li>
                        <p
                            className="cursor-pointer text-blue-400 underline"
                            onClick={() =>
                                navigate("https://aurora-internal.net")
                            }
                        >
                            AURORA Internal Network
                        </p>
                        <p className="text-xs text-white/50">
                            aurora-internal.net
                        </p>
                        <p className="text-sm text-white/70">
                            Restricted access internal network.
                        </p>
                    </li>
                </ul>
            </div>
        </div>
    );
}

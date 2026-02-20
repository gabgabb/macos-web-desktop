function getSpecificResults(query: string) {
    const q = query.toLowerCase();

    if (q.includes("aurora")) {
        return [
            {
                title: "Aurora Borealis – Wikipedia",
                url: "https://en.wikipedia.org/wiki/Aurora",
                description:
                    "An aurora is a natural light display in Earth's sky.",
                priority: 10,
            },
            {
                title: "AURORA Internal Network",
                url: "https://public.internal",
                description: "Restricted scientific access portal.",
                priority: 20,
            },
        ];
    }

    if (q.includes("log")) {
        return [
            {
                title: "Laboratory Log Archive",
                url: "https://log01.internal",
                description: "Internal experimental documentation.",
                priority: 20,
            },
        ];
    }

    return [];
}

function generateGenericResults(query: string, count = 6) {
    const domains = [
        "wikipedia.org",
        "reddit.com",
        "medium.com",
        "researchgate.net",
        "stackoverflow.com",
        "bbc.com",
        "nytimes.com",
        "techcrunch.com",
        "nature.com",
        "github.com",
    ];

    const prefixes = [
        "Understanding",
        "Complete Guide to",
        "What is",
        "Why",
        "How to use",
        "Top 10 facts about",
        "Beginner’s Guide to",
        "Advanced concepts in",
    ];

    const descriptions = [
        "In-depth analysis and expert commentary.",
        "Comprehensive overview including history and applications.",
        "Community discussion and technical insights.",
        "Latest research findings.",
        "Practical examples and explanations.",
    ];

    function randomItem<T>(arr: T[]) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    const slug = query.toLowerCase().replace(/\s+/g, "-");

    return Array.from({ length: count }).map(() => ({
        title: `${randomItem(prefixes)} ${query}`,
        url: `https://${randomItem(domains)}/${slug}`,
        description: randomItem(descriptions),
        priority: 1,
    }));
}

export function buildResults(query: string) {
    const specific = getSpecificResults(query);
    const generic = generateGenericResults(query, 6);

    const all = [...specific, ...generic];
    all.sort((a, b) => b.priority - a.priority);

    return all;
}

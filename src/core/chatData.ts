export const USER_COLORS = [
    "text-red-500",
    "text-orange-500",
    "text-amber-500",
    "text-green-500",
    "text-emerald-500",
    "text-teal-500",
    "text-cyan-500",
    "text-blue-500",
    "text-indigo-500",
    "text-purple-500",
    "text-pink-500",
];

export type User = {
    id: string;
    name: string;
    avatar: string;
};

export const USERS: Record<string, User> = {
    alice: {
        id: "alice",
        name: "Alice",
        avatar: "https://api.dicebear.com/9.x/micah/svg?seed=Amaya&backgroundColor=b6e3f4",
    },
    julie: {
        id: "julie",
        name: "Julie",
        avatar: "https://api.dicebear.com/9.x/micah/svg?seed=Leah&backgroundColor=b6e3f4",
    },
    marc: {
        id: "marc",
        name: "Marc",
        avatar: "https://api.dicebear.com/9.x/micah/svg?seed=Avery&backgroundColor=b6e3f4",
    },
    thomas: {
        id: "thomas",
        name: "Thomas",
        avatar: "https://api.dicebear.com/9.x/micah/svg?seed=Mason&backgroundColor=b6e3f4",
    },
    lea: {
        id: "lea",
        name: "Léa",
        avatar: "https://api.dicebear.com/9.x/micah/svg?seed=Chase&backgroundColor=b6e3f4",
    },
    system: {
        id: "systeme",
        name: "System",
        avatar: "https://api.dicebear.com/9.x/bottts/svg?seed=Avery&backgroundColor=b6e3f4",
    },
    max: {
        id: "max",
        name: "Max",
        avatar: "https://api.dicebear.com/9.x/micah/svg?seed=Emery&backgroundColor=b6e3f4",
    },
    unknown: {
        id: "unknown",
        name: "Unknown",
        avatar: "https://api.dicebear.com/9.x/shapes/svg?seed=Sarah",
    },
};

export type Message = {
    id: string;
    authorId: string;
    content: string;
    timestamp: string;
    date?: string;
    reactions?: {
        emoji: string;
        count: number;
    }[];
    type?: "normal" | "hint" | "system";
    read?: boolean;
};

export type Conversation = {
    id: string;
    name: string;
    type: "channel" | "dm";
    description?: string;
    participants?: string[];
    unlocked: boolean;
    unreadCount: number;
    messages: Message[];
};

export const CONVERSATIONS: Conversation[] = [
    {
        id: "general",
        name: "general",
        type: "channel",
        unlocked: true,
        description: "General chat about everything",
        participants: ["alice", "julie", "marc"],
        unreadCount: 3,
        messages: [
            {
                id: "g1",
                authorId: "alice",
                content: "Good morning everyone 👋",
                timestamp: "09:01",
                date: "2026-01-27",
            },
            {
                id: "g2",
                authorId: "marc",
                content: "Standup in 10 minutes",
                timestamp: "09:05",
                date: "2026-01-27",
                reactions: [{ emoji: "👍", count: 5 }],
            },
            {
                id: "g3",
                authorId: "julie",
                content: "@Marc can we push it 15min?",
                timestamp: "09:06",
                date: "2026-01-27",
            },
            {
                id: "g4",
                authorId: "marc",
                content: "Sure 👍",
                timestamp: "09:07",
                date: "2026-01-27",
            },
        ],
    },
    {
        id: "dev",
        name: "dev",
        type: "channel",
        unlocked: true,
        unreadCount: 12,
        description: "Discussion about the development of the app",
        participants: ["thomas", "alice", "julie"],
        messages: [
            {
                id: "d1",
                authorId: "julie",
                content: "CI failed again on main 😩",
                timestamp: "10:02",
                date: "2026-01-27",
            },
            {
                id: "d2",
                authorId: "thomas",
                content: "@Julie looks like a Node 20 vs 18 issue",
                timestamp: "10:03",
                date: "2026-01-27",
            },
            {
                id: "d3",
                authorId: "alice",
                content: "We really need to pin the version",
                timestamp: "10:04",
                date: "2026-01-27",
                reactions: [{ emoji: "🔥", count: 2 }],
            },
            {
                id: "d4",
                authorId: "thomas",
                content: "PR incoming",
                timestamp: "10:06",
                date: "2026-01-27",
                reactions: [{ emoji: "👀", count: 3 }],
            },
            {
                id: "d5",
                authorId: "julie",
                content: "Thanks 🙏",
                timestamp: "10:08",
                date: "2026-01-27",
            },
        ],
    },
    {
        id: "design",
        name: "design",
        type: "channel",
        unlocked: true,
        description: "Discussion about the design of the app",
        participants: ["lea"],
        unreadCount: 0,
        messages: [
            {
                id: "de1",
                authorId: "lea",
                content: "Uploaded new homepage mockups ✨",
                timestamp: "16:20",
                date: "2026-01-26",
                reactions: [
                    { emoji: "❤️", count: 3 },
                    { emoji: "🔥", count: 2 },
                ],
            },
        ],
    },
    {
        id: "incidents",
        name: "incidents",
        type: "channel",
        unlocked: true,
        description: "Incidents reported by the team",
        participants: ["thomas", "system"],
        unreadCount: 6,
        messages: [
            {
                id: "i1",
                authorId: "system",
                content: "🚨 Production error rate increased",
                timestamp: "22:41",
                date: "2026-01-26",
                type: "system",
            },
            {
                id: "i2",
                authorId: "system",
                content: "@oncall latency > 2.5s",
                timestamp: "22:42",
                date: "2026-01-26",
            },
            {
                id: "i3",
                authorId: "thomas",
                content: "Investigating",
                timestamp: "22:43",
                date: "2026-01-26",
                reactions: [{ emoji: "🚑", count: 1 }],
            },
        ],
    },
    {
        id: "random",
        name: "random",
        type: "channel",
        unlocked: true,
        description: "Random conversations",
        participants: ["alice", "max"],
        unreadCount: 1,
        messages: [
            {
                id: "r1",
                authorId: "max",
                content: "Coffee machine is broken again ☕💀",
                timestamp: "11:18",
                date: "2026-01-27",
                reactions: [
                    { emoji: "😂", count: 4 },
                    { emoji: "😭", count: 2 },
                ],
            },
            {
                id: "r2",
                authorId: "alice",
                content: "That thing is cursed",
                timestamp: "11:19",
                date: "2026-01-27",
            },
        ],
    },
    {
        id: "dm-unknown",
        name: "unknown",
        type: "dm",
        participants: ["unknown"],
        unlocked: true,
        unreadCount: 0,
        messages: [],
    },
];

export const INTRO_SEQUENCE = [
    {
        authorId: "unknown",
        content: "Can you hear me?",
        typing: 1500,
        delay: 2000,
    },
    {
        authorId: "unknown",
        content: "Good. Don’t panic.",
        typing: 2000,
        delay: 2000,
    },
    {
        authorId: "unknown",
        content: "You need to follow my instructions carefully.",
        typing: 2500,
        delay: 2000,
    },
];

export type ChatEvent =
    | { type: "typing:start"; conversationId: string; authorId: string }
    | { type: "typing:stop"; conversationId: string; authorId: string }
    | {
          type: "message:add";
          conversationId: string;
          message: {
              id: string;
              authorId: string;
              content: string;
              date: string;
              timestamp: string;
          };
      };

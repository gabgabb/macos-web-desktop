export type Message = {
    id: string;
    author: string;
    content: string;
    timestamp: string;
    type?: "normal" | "hint" | "system";
    read?: boolean;
};

export type Conversation = {
    id: string;
    name: string;
    type: "channel" | "dm";
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
        unreadCount: 4,
        messages: [
            {
                id: "m1",
                author: "Alice",
                content: "Hello 👋",
                timestamp: "09:01",
            },
            {
                id: "m2",
                author: "Julie",
                content: "Hey 🙂",
                timestamp: "09:02",
            },
        ],
    },
    {
        id: "dev",
        name: "dev",
        type: "channel",
        unlocked: false,
        unreadCount: 5,
        messages: [
            {
                id: "m3",
                author: "System",
                content: "Access restricted.",
                type: "system",
                timestamp: "—",
            },
        ],
    },
    {
        id: "dm-unknown",
        name: "unknown",
        type: "dm",
        unlocked: true,
        unreadCount: 0,
        messages: [],
    },
];

export const INTRO_SEQUENCE = [
    {
        author: "Unknown",
        content: "Can you hear me?",
        typing: 1500,
        delay: 2000,
    },
    {
        author: "Unknown",
        content: "Good. Don’t panic.",
        typing: 2000,
        delay: 2000,
    },
    {
        author: "Unknown",
        content: "You need to follow my instructions carefully.",
        typing: 2500,
        delay: 2000,
    },
];

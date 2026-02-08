import { Conversation, USERS } from "@/src/core/apps/chatData";
import { InfoIcon, PinIcon, SearchIcon, User } from "lucide-react";
import Image from "next/image";
import { ReactNode } from "react";

export function ChatHeader({
    activeConversation,
}: {
    activeConversation: Conversation;
}) {
    const isDM = activeConversation.type === "dm";
    const otherUserId = isDM ? activeConversation.participants?.[0] : null;
    const user = otherUserId ? USERS[otherUserId] : null;

    return (
        <div className="flex h-16 items-center justify-between border-b border-(--border-control)/60 bg-(--sidebar) px-4 text-sm">
            <div className="flex items-center gap-3">
                {isDM ? (
                    <>
                        <Image
                            src={user!.avatar}
                            alt={user!.name}
                            width={32}
                            height={32}
                            className="rounded-md"
                            unoptimized
                        />
                        <div className="flex flex-col leading-tight">
                            <span className="font-semibold text-(--text-strong)">
                                {user!.name}
                            </span>
                            <span className="text-xs text-green-600">
                                Online
                            </span>
                        </div>
                    </>
                ) : (
                    <div
                        className="flex flex-col gap-1 leading-tight"
                        data-testid="channel-name"
                    >
                        <span className="font-semibold text-(--text-strong)">
                            # {activeConversation.name}
                        </span>
                        <div
                            className="flex items-center gap-2"
                            data-testid="channel-description"
                        >
                            {activeConversation.participants &&
                                activeConversation.type === "channel" && (
                                    <span className="flex items-center gap-0.5 text-xs text-(--text-secondary)">
                                        <User className="mt-0.5 size-3" />
                                        {activeConversation.participants.length}
                                    </span>
                                )}
                            {activeConversation.description && (
                                <span className="text-xs text-(--text-secondary)">
                                    {activeConversation.description}
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-3 text-(--text-secondary) transition-all">
                <HeaderButton>
                    <SearchIcon className={"size-4"} />
                </HeaderButton>
                <HeaderButton>
                    <PinIcon className={"size-4"} />
                </HeaderButton>
                <HeaderButton>
                    <InfoIcon className={"size-4"} />
                </HeaderButton>
            </div>
        </div>
    );
}

function HeaderButton({ children }: { children: ReactNode }) {
    return (
        <button className="rounded p-1 hover:bg-(--border-soft)">
            {children}
        </button>
    );
}

import { Conversation, USERS } from "@/src/core/chatData";
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
        <div className="flex h-16 items-center justify-between border-b border-gray-400/30 bg-gray-100 px-4 text-sm">
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
                            <span className="font-semibold text-neutral-900">
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
                        <span className="font-semibold text-neutral-900">
                            # {activeConversation.name}
                        </span>
                        <div
                            className="flex items-center gap-2"
                            data-testid="channel-description"
                        >
                            {activeConversation.participants &&
                                activeConversation.type === "channel" && (
                                    <span className="flex items-center gap-0.5 text-xs text-gray-500">
                                        <User className="mt-0.5 size-3" />
                                        {activeConversation.participants.length}
                                    </span>
                                )}
                            {activeConversation.description && (
                                <span className="text-xs text-gray-500">
                                    {activeConversation.description}
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-3 text-gray-600">
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
        <button className="rounded p-1 hover:bg-gray-200/50">{children}</button>
    );
}

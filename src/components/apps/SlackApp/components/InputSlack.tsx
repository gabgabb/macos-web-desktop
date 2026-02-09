import { Conversation } from "@/src/core/apps/chatData";
import React from "react";

export function InputSlack({
    activeConversation,
}: {
    activeConversation: Conversation;
}) {
    return (
        <div className="w-full bg-(--sidebar) p-5 text-(--text-strong)">
            <div className="bg-background/80 flex w-2/3 flex-col rounded-xl border border-(--border-control)/30 shadow-sm backdrop-blur-md">
                <textarea
                    data-testid="slack-input"
                    rows={1}
                    className="w-full resize-none rounded-t-xl border-b border-(--border-control)/30 bg-transparent p-4 px-3 text-(--text-secondary) outline-none"
                    placeholder={
                        activeConversation.type === "dm"
                            ? `Message ${activeConversation.name}`
                            : `Message #${activeConversation.name}`
                    }
                />

                <div className="flex items-center justify-between px-3 py-1 text-(--text-secondary)">
                    <div className="flex gap-2">
                        <ToolbarButton label="Bold">B</ToolbarButton>
                        <ToolbarButton label="Italic">I</ToolbarButton>
                        <ToolbarButton label="Code">{"</>"}</ToolbarButton>
                    </div>

                    <div className="flex gap-2">
                        <IconButton icon="😊" />
                        <IconButton icon="@" />
                        <IconButton icon="📎" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function ToolbarButton({
    children,
    label,
}: {
    children: React.ReactNode;
    label?: string;
}) {
    return (
        <button
            type="button"
            title={label}
            className="rounded px-2 py-1 text-sm hover:bg-gray-200/50"
        >
            {children}
        </button>
    );
}

function IconButton({ icon }: { icon: string }) {
    return (
        <button type="button" className="rounded p-1 hover:bg-gray-200/50">
            {icon}
        </button>
    );
}

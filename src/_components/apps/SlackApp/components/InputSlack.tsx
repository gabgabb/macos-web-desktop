import { Conversation } from "@/src/core/chatData";
import React from "react";

export function InputSlack({
    activeConversation,
}: {
    activeConversation: Conversation;
}) {
    return (
        <div className="w-full p-5 text-neutral-900">
            <div className="flex w-2/3 flex-col rounded-xl border border-gray-600/20 bg-white/80 backdrop-blur-md">
                <textarea
                    rows={1}
                    className="w-full resize-none rounded-t-xl border-b border-gray-600/20 bg-transparent p-4 px-3 outline-none"
                    placeholder={
                        activeConversation.type === "dm"
                            ? `Message ${activeConversation.name}`
                            : `Message #${activeConversation.name}`
                    }
                />

                <div className="flex items-center justify-between px-3 py-1 text-gray-600">
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

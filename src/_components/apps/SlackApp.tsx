"use client";

import Image from "next/image";

export function SlackApp() {
    return (
        <div className="flex h-full text-white">
            <aside className="to-pur w-48 border-r border-white/10 bg-linear-to-b from-purple-900 to-pink-900 p-3">
                <div className="font-semibold">Channels</div>
                <ul className="mt-2 space-y-1 text-sm">
                    <li># general</li>
                    <li># dev</li>
                    <li># random</li>
                </ul>
            </aside>

            <main className="flex-1 bg-gray-50 text-gray-950">
                <div className="mb-2 border-b-2 border-gray-600/20 p-3 px-5 text-xl font-bold">
                    # general
                </div>

                <div className="flex flex-col gap-2 space-y-2 overflow-auto p-2 text-sm">
                    <div
                        className="flex items-center gap-2 border-b-2 border-gray-500/20 pb-2"
                        data-testid="message"
                    >
                        <Image
                            src={"/Cameleon.webp"}
                            alt={"Cameleon Avatar"}
                            priority
                            width={360}
                            height={360}
                            className="size-10 rounded-full object-cover"
                        />
                        <b>Alice:</b> Hello 👋
                    </div>

                    <div
                        className="flex items-center gap-2"
                        data-testid="message"
                    >
                        <Image
                            src={"/Cameleon.webp"}
                            alt={"Cameleon Avatar"}
                            priority
                            width={360}
                            height={360}
                            className="size-10 rounded-full object-cover"
                        />
                        <b>Julie:</b> Hey :)
                    </div>
                </div>
                <input />
            </main>
        </div>
    );
}

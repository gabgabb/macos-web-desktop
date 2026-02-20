import Image from "next/image";

export function AccessDenied() {
    return (
        <div className="bg-background flex h-full items-center justify-center">
            <Image
                src={"/icones/restricted.webp"}
                alt={"error"}
                width={980}
                height={980}
                className="absolute top-1/2 left-1/2 z-0 size-96 -translate-x-1/2 -translate-y-1/2 transform object-contain blur-sm"
            />
            <div className="z-10 mx-auto max-w-md text-center text-(--text-primary)">
                <h1 className="mb-2 text-2xl font-semibold">
                    Access Restricted
                </h1>
                <p className="bac text-sm text-(--text-primary)/60">
                    Clearance level insufficient.
                </p>
            </div>
        </div>
    );
}

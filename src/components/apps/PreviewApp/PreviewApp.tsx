import { TextFileViewer } from "@/src/components/apps/PreviewApp/TextViewer";
import { useDesktopStore } from "@/src/store/desktop-store";
import dynamic from "next/dynamic";
import Image from "next/image";

const PdfViewerDynamic = dynamic(
    () => import("./PdfViewer").then((m) => m.PdfViewer),
    { ssr: false },
);

export function PreviewApp() {
    const activeFile = useDesktopStore((s) => s.activeFile);

    if (!activeFile) {
        return (
            <div className="flex h-full w-full items-center justify-center text-white/50">
                No file selected
            </div>
        );
    }

    const ext = activeFile.name.split(".").pop()?.toLowerCase();
    const isImage = ["png", "jpg", "jpeg", "webp"].includes(ext ?? "");
    const isPdf = ext === "pdf";
    const isText = ["txt", "md", "dmg", "html", "css"].includes(ext ?? "");

    if (isImage) {
        return (
            <div className="flex h-full w-full items-center justify-center bg-black">
                <Image
                    src="/icones/image.webp"
                    alt={activeFile.name}
                    width={600}
                    height={400}
                    className="max-h-full max-w-full object-contain"
                />
            </div>
        );
    }

    if (isPdf) {
        return <PdfViewerDynamic fileName={activeFile.name} />;
    }

    if (isText) {
        return <TextFileViewer file={activeFile} />;
    }

    return (
        <div className="flex h-full w-full items-center justify-center text-white/50">
            Cannot preview this file
        </div>
    );
}

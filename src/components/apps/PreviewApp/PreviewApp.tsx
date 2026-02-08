import { TextFileViewer } from "@/src/components/apps/PreviewApp/TextViewer";
import { AppProps } from "@/src/core/apps/types";
import { useDesktopStore } from "@/src/store/desktop-store";
import dynamic from "next/dynamic";
import Image from "next/image";
import { FunctionComponent, useEffect } from "react";

const PdfViewerDynamic = dynamic(
    () => import("./PdfViewer").then((m) => m.PdfViewer),
    { ssr: false },
);

export const PreviewApp: FunctionComponent<AppProps> = ({ windowId }) => {
    const activeFile = useDesktopStore((s) => s.activeFile);
    const setWindowTitle = useDesktopStore((s) => s.setWindowTitle);

    useEffect(() => {
        if (!windowId) return;

        if (!activeFile) {
            setWindowTitle(windowId, "Preview");
            return;
        }

        setWindowTitle(windowId, `Preview - ${activeFile.name}`);
    }, [activeFile, windowId, setWindowTitle]);

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
            <div className="bg-background flex h-full w-full items-center justify-center">
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
};

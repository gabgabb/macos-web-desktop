"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf/pdf.worker.min.mjs";

export const PdfViewer = React.memo(function PdfViewer({
    fileName,
}: {
    fileName: string;
}) {
    const [numPages, setNumPages] = useState(0);
    const [scale, setScale] = useState(1);
    const [width, setWidth] = useState(800);

    useEffect(() => {
        function updateWidth() {
            setWidth(window.innerWidth * 0.6);
        }
        updateWidth();
        window.addEventListener("resize", updateWidth);
        return () => window.removeEventListener("resize", updateWidth);
    }, []);

    const fileUrl = useMemo(() => {
        return `/pdf/${fileName}`;
    }, [fileName]);

    return (
        <div className="h-full w-full overflow-auto bg-neutral-200 p-4">
            <Document
                file={fileUrl}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                className={"flex flex-col gap-4"}
            >
                {Array.from({ length: numPages }, (_, i) => (
                    <Page
                        key={i}
                        pageNumber={i + 1}
                        scale={scale}
                        width={width}
                        className="mx-auto mb-4 justify-center bg-white object-contain shadow"
                    />
                ))}
            </Document>
        </div>
    );
});

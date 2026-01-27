import React from "react";

export type FsFile = {
    type: "file";
    content: string;
};

export type FsDir = {
    type: "dir";
    children: Record<string, FsNode>;
};

export type FsApp = {
    type: "app";
    id: string;
    title: string;
    icon: string | React.ReactNode;
};

export type FsNode = FsFile | FsDir | FsApp;

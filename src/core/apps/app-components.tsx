import { CalculatorApp } from "@/src/components/apps/CalculatorApp";
import { CalendarApp } from "@/src/components/apps/CalendarApp/CalendarApp";
import { DoomApp } from "@/src/components/apps/DoomApp/DoomApp";
import { FinderApp } from "@/src/components/apps/FinderApp/FinderApp";
import { NotesApp } from "@/src/components/apps/NotesApp";
import { PreviewApp } from "@/src/components/apps/PreviewApp/PreviewApp";
import { SafariApp } from "@/src/components/apps/SafariApp";
import { SettingsApp } from "@/src/components/apps/SettingsApp/SettingsApp";
import { SlackApp } from "@/src/components/apps/SlackApp/SlackApp";
import { TerminalApp } from "@/src/components/apps/TerminalApp";
import { AppId, AppProps } from "@/src/core/apps/types";
import { ComponentType } from "react";

export const APP_COMPONENTS: Record<AppId, ComponentType<AppProps>> = {
    finder: FinderApp,
    notes: NotesApp,
    settings: SettingsApp,
    terminal: TerminalApp,
    safari: SafariApp,
    calculator: CalculatorApp,
    calendar: CalendarApp,
    slack: SlackApp,
    preview: PreviewApp,
    doom: DoomApp,
};

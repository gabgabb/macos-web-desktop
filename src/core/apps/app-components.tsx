import { CalculatorApp } from "@/src/_components/apps/CalculatorApp";
import { CalendarApp } from "@/src/_components/apps/CalendarApp";
import { FinderApp } from "@/src/_components/apps/FinderApp";
import { NotesApp } from "@/src/_components/apps/NotesApp";
import { SafariApp } from "@/src/_components/apps/SafariApp";
import { SettingsApp } from "@/src/_components/apps/SettingsApp";
import { SlackApp } from "@/src/_components/apps/SlackApp";
import { TerminalApp } from "@/src/_components/apps/TerminalApp";
import { AppId } from "@/src/core/types";
import { ComponentType } from "react";

export const APP_COMPONENTS: Record<AppId, ComponentType> = {
    finder: FinderApp,
    notes: NotesApp,
    settings: SettingsApp,
    terminal: TerminalApp,
    safari: SafariApp,
    calculator: CalculatorApp,
    calendar: CalendarApp,
    slack: SlackApp,
};

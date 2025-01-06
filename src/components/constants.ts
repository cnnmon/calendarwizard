import { Dispatch } from "react";
import Chat from "./Chat";
import Events from "./Events";
import Setup from "./Setup";
import { Action } from "@/app/manager";
import { Message } from "ai";
import Notepad from "./Notepad";

export type EventsByDate = { [key: string]: CalendarEvent[] };

export type ChatApiProps = {
  messages: Message[];
  eventsByDate: EventsByDate;
  notepad: string;
}

export type CalendarEvent = {
  id: string;
  summary: string;
  start: { date: string, dateTime: string, timeZone: string };
  end: { date: string, dateTime: string, timeZone: string };
  location: string;
  organizer: { email: string, displayName: string };
  attendees: { email: string, responseStatus: string }[];
};

export interface Calendar {
  id: string;
  summary: string;
}

export type CalendarForm = {
  name: string;
  calendars: Calendar[];
  selectedCalendars: Calendar[];
  minDate: string;
  maxDate: string;
};

export type SetupForm = CalendarForm & {
  formVersionId: string;
};

export type State = {
  setupStep: number;
  accessToken: string;
  windowsOpen: Windows[];
  eventsByDate: EventsByDate;
  eventsVersionId: string; // which form version the events were last updated from
  eventsLastUpdated: string | null;
  messages: Message[];
  notepad: string;
} & SetupForm;


export enum Windows {
  Setup = "Setup",
  Chat = "Chat",
  Events = "Events",
  Notepad = "Notepad",
}

export const WINDOW_COMPONENTS: {
  [key in Windows]: React.FC<{
    state: State;
    dispatch: Dispatch<Action>;
    onExit: () => void;
  }>;
} = {
  [Windows.Setup]: Setup,
  [Windows.Chat]: Chat,
  [Windows.Events]: Events,
  [Windows.Notepad]: Notepad,
};

export const WINDOW_ICONS: {
  window: Windows;
  emoji: string;
  title: string;
  isDisabled?: (state: State) => boolean;
}[] = [
  { window: Windows.Setup, emoji: "⚙️", title: "Setup" },
  {
    window: Windows.Chat,
    emoji: "💬",
    title: "Chat",
    isDisabled: (state: State) => !Object.keys(state.eventsByDate).length,
  },
  {
    window: Windows.Events,
    emoji: "📅",
    title: "Events",
    isDisabled: (state: State) => !Object.keys(state.eventsByDate).length,
  },
  {
    window: Windows.Notepad,
    emoji: "📝",
    title: "Notepad",
  },
];
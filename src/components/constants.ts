import { Dispatch } from "react";
import Chat from "./Chat";
import Events from "./Events";
import Setup from "./Setup";
import { Calendar, CalendarEvent } from "./Setup/utils";
import { Action } from "@/app/manager";
import { Message } from "ai";

export type CalendarForm = {
  name: string;
  calendars: Calendar[];
  selectedCalendars: Calendar[];
  minDate: string;
  maxDate: string;
};

export type SetupForm = CalendarForm & {
  versionId: string;
};

export type State = {
  setupStep: number;
  accessToken: string;
  windowsOpen: Windows[];
  eventsByDate: { [key: string]: CalendarEvent[] };
  eventsLastUpdated: string | null;
  messages: Message[];
} & SetupForm;


export enum Windows {
  Setup = "Setup",
  Chat = "Chat",
  Events = "Events",
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
};

export type EventsByDate = { [key: string]: CalendarEvent[] };

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
];

export const initialForm: Omit<SetupForm, "versionId"> = {
  name: "",
  calendars: [],
  selectedCalendars: [],
  minDate: new Date(
    new Date().setMonth(new Date().getMonth() - 2)
  ).toISOString(),
  maxDate: new Date(
    new Date().setMonth(new Date().getMonth() + 2)
  ).toISOString(),
};

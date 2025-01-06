import { initialForm, CalendarForm, State, Windows } from "@/components/constants";
import { Calendar, CalendarEvent } from "@/components/Setup/utils";
import { Message } from "ai";

const STORAGE_KEY_STATE = "state";

export const initialState: State = {
  accessToken: "",
  windowsOpen: [],
  eventsLastUpdated: null,
  eventsByDate: {},
  ...initialForm,
  setupStep: 0,
  versionId: "-1",
  messages: [
    {
      id: "initial-message",
      role: "assistant",
      content: "Hello! I'm WizardingAssistant, your home-grown, all-knowing calendar cat wizard. How can I help you today?",
    },
  ],
};

export type Action =
  | { type: "openWindowBox"; payload: Windows }
  | { type: "closeWindowBox"; payload: Windows }
  | { type: "setEventsByDate"; payload: { [key: string]: CalendarEvent[] } }
  | { type: "clearEvents" }
  | { type: "setAccessToken"; payload: string }
  | { type: "selectCalendar"; payload: { calendar: Calendar; checked: boolean } }
  | { type: "reloadEvents" }
  | { type: "setSetupStep"; payload: number }
  | { type: "loadState"; payload: State }
  | { type: "saveMessages"; payload: Message[] }
  | { type: "clearAccessToken" }
  | { type: "setCalendarForm"; payload: CalendarForm }
  | { type: "loginToGoogleApi", payload: { accessToken: string; calendars: Calendar[]; name: string } };

function handleAction(state: State, action: Action): State {
  switch (action.type) {
    case "openWindowBox":
      if (state.windowsOpen.includes(action.payload)) {
        return state;
      }
      return { ...state, windowsOpen: [...state.windowsOpen, action.payload] };
    case "closeWindowBox":
      return {
        ...state,
        windowsOpen: state.windowsOpen.filter((w) => w !== action.payload),
      };
    case "setEventsByDate":
      return { ...state, eventsByDate: action.payload, eventsLastUpdated: new Date().toISOString() };
    case "clearEvents":
      return { ...state, eventsByDate: {}, versionId: "-1", messages: [] };
    case "setSetupStep":
      return { ...state, setupStep: action.payload };
    case "saveMessages":
      return { ...state, messages: action.payload };
    case "loadState":
      return action.payload;
    case "setAccessToken":
      return { ...state, accessToken: action.payload };
    case "setCalendarForm":
      return { ...state, ...action.payload };
    case "loginToGoogleApi":
      return { ...state, ...action.payload };
    case "clearAccessToken":
      return {
        ...initialState,
        setupStep: state.setupStep,
        windowsOpen: state.windowsOpen,
      };
    case "selectCalendar":
      const { calendar, checked } = action.payload;
      const selectedCalendars = checked
        ? [...state.selectedCalendars, calendar]
        : state.selectedCalendars.filter((c) => c.id !== calendar.id);
      return {
        ...state,
        selectedCalendars,
      };
    default:
      return state;
  }
}

export function reducer(state: State, action: Action): State {
  const newState = handleAction(state, action);
  localStorage.setItem(STORAGE_KEY_STATE, JSON.stringify(newState));
  return newState;
}

export function loadState(): State {
  const state = localStorage.getItem(STORAGE_KEY_STATE);
  return state ? JSON.parse(state) : initialState;
}

import { State, Windows, Calendar, SetupForm, CalendarForm, EventsByDate } from "@/components/constants";
import { Message } from "ai";
import exampleEventsByDate from "../example/eventsByDateExample.json";

const STORAGE_KEY_STATE = "state";

const initialForm: Omit<SetupForm, "formVersionId"> = {
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

export const initialState: State = {
  accessToken: "",
  windowsOpen: [],
  eventsLastUpdated: null,
  eventsByDate: {},
  eventsVersionId: "-1",
  ...initialForm,
  setupStep: 0,
  formVersionId: "-1",
  messages: [{
    id: "1",
    role: "assistant",
    content: "Hello! I'm WizardingAssistant, your home-grown, all-knowing calendar cat wizard. Ask me anything about your past year(s), specific highlights from your week, or anything else you'd like to know.",
  }],
  notepad: "",
  isExample: false,
};

export type Action =
  | { type: "openWindowBox"; payload: Windows }
  | { type: "closeWindowBox"; payload: Windows }
  | { type: "setEventsByDate"; payload: EventsByDate }
  | { type: "setAccessToken"; payload: string }
  | { type: "selectCalendar"; payload: { calendar: Calendar; checked: boolean } }
  | { type: "reloadEvents" }
  | { type: "setSetupStep"; payload: number }
  | { type: "loadState"; payload: State }
  | { type: "saveMessages"; payload: Message[] }
  | { type: "clearAccessToken" }
  | { type: "setCalendarForm"; payload: SetupForm }
  | { type: "loginToGoogleApi", payload: { accessToken: string; calendars: Calendar[]; name: string } }
  | { type: "setNotepad"; payload: string }
  | { type: "clearMessages" }
  | { type: "useExampleCalendar" };

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
      const eventsByDate = action.payload;
      return {
        ...state,
        eventsByDate,
        eventsLastUpdated: new Date().toISOString(),
        eventsVersionId: state.formVersionId,
        messages: initialState.messages,
      };
    case "setSetupStep":
      return { ...state, setupStep: action.payload };
    case "saveMessages":
      return { ...state, messages: action.payload };
    case "loadState":
      return action.payload;
    case "setAccessToken":
      return { ...state, accessToken: action.payload };
    case "setCalendarForm":
      const newForm: CalendarForm = { ...action.payload };
      if (JSON.stringify(state.selectedCalendars) === JSON.stringify(newForm.selectedCalendars) &&
        state.minDate === newForm.minDate &&
        state.maxDate === newForm.maxDate) {
        return state;
      }
      return { ...state, ...newForm, formVersionId: Date.now().toString(), isExample: false };
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
    case "setNotepad":
      return { ...state, notepad: action.payload };
    case "clearMessages":
      return { ...state, messages: initialState.messages };
    case "useExampleCalendar":
      return {
        ...state,
        isExample: true,
        eventsByDate: JSON.parse(JSON.stringify(exampleEventsByDate)),
        messages: initialState.messages,
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

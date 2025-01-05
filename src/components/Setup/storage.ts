import { Message } from "ai";
import { CalendarEvent, SetupForm } from "./utils";
import { Window } from "@/components/constants";

// Storage keys
export const STORAGE_KEY_FORM = "form";
export const STORAGE_KEY_ACCESS_TOKEN = "accessToken";
export const STORAGE_KEY_EVENTS_BY_DATE = "eventsByDate";
export const STORAGE_KEY_EVENTS_VERSION_ID = "eventsVersionId";
export const STORAGE_KEY_WINDOWS_OPEN = "windowsOpen";
export const STORAGE_KEY_SETUP_STEP = "setupStep";
export const STORAGE_KEY_MESSAGES = "messages";
export function getAccessToken(): string | null {
  return localStorage.getItem(STORAGE_KEY_ACCESS_TOKEN);
}

export function saveAccessToken(accessToken: string) {
  localStorage.setItem(STORAGE_KEY_ACCESS_TOKEN, accessToken);
}

export function getForm(): SetupForm | null {
  const form = localStorage.getItem(STORAGE_KEY_FORM);
  if (form) {
    return JSON.parse(form);
  }
  return null;
}

export function saveForm(form: Omit<SetupForm, "versionId">) {
  const previousForm = getForm();
  if (previousForm && JSON.stringify(previousForm) === JSON.stringify(form)) {
    return;
  }

  localStorage.setItem(
    STORAGE_KEY_FORM,
    JSON.stringify({
      ...form,
      versionId: new Date().toISOString(),
    })
  );
}

export function getEventsVersionId(): string | null {
  return localStorage.getItem(STORAGE_KEY_EVENTS_VERSION_ID);
}

export function getEventsByDate(versionId?: string): {[key: string]: CalendarEvent[]} | null {
  const eventsByDate = localStorage.getItem(STORAGE_KEY_EVENTS_BY_DATE);
  if (eventsByDate) {
    const storedVersionId = localStorage.getItem(STORAGE_KEY_EVENTS_VERSION_ID);
    if (!versionId || versionId === storedVersionId) {
      return JSON.parse(eventsByDate)
    }
  }
  return null;
}

export function saveEvents(eventsByDate: {[key: string]: CalendarEvent[]}, versionId: string) {
  clearEvents();
  localStorage.setItem(
    STORAGE_KEY_EVENTS_BY_DATE,
    JSON.stringify(eventsByDate)
  );
  localStorage.setItem(STORAGE_KEY_EVENTS_VERSION_ID, versionId);
}

export function clearEvents() {
  localStorage.removeItem(STORAGE_KEY_EVENTS_BY_DATE);
  localStorage.removeItem(STORAGE_KEY_EVENTS_VERSION_ID);
  localStorage.removeItem(STORAGE_KEY_MESSAGES);
}

export function saveWindowsOpen(windowsOpen: Window[]) {
  localStorage.setItem(STORAGE_KEY_WINDOWS_OPEN, JSON.stringify(windowsOpen));
}

export function getWindowsOpen(): Window[] {
  const windowsOpen = localStorage.getItem(STORAGE_KEY_WINDOWS_OPEN);
  if (windowsOpen) {
    return JSON.parse(windowsOpen);
  }
  return [];
}

export function saveSetupStep(step: number) {
  localStorage.setItem(STORAGE_KEY_SETUP_STEP, step.toString());
}

export function getSetupStep(): number {
  const step = localStorage.getItem(STORAGE_KEY_SETUP_STEP);
  if (step) {
    return parseInt(step);
  }
  return 0;
}

export function saveMessages(messages: Message[]) {
  localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages));
}

export function getInitialMessages(): Message[] {
  const messages = localStorage.getItem(STORAGE_KEY_MESSAGES);
  if (messages) {
    return JSON.parse(messages);
  }
  return [
    {
      role: "assistant",
      content: "Hello! I'm WizardingAssistant, your home-grown, all-knowing calendar wizard. How can I help you today?",
      id: "system-message",
    },
  ];
}

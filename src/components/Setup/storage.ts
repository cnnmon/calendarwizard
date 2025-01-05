import { CalendarEvent, SetupEvents, SetupForm } from "./utils";
import { Window } from "@/components/constants";

// Storage keys
export const STORAGE_KEY_FORM = "form";
export const STORAGE_KEY_ACCESS_TOKEN = "accessToken";
export const STORAGE_KEY_EVENTS = "events";
export const STORAGE_KEY_WINDOWS_OPEN = "windowsOpen";

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

export function getEvents(versionId: string): SetupEvents | null {
  const eventsInfo = localStorage.getItem(STORAGE_KEY_EVENTS);
  if (eventsInfo) {
    const { events, versionId: storedVersionId } = JSON.parse(eventsInfo);
    if (versionId === storedVersionId) {
      return { events, versionId: storedVersionId };
    }
  }
  return null;
}

export function saveEvents(events: CalendarEvent[], versionId: string) {
  localStorage.setItem(
    STORAGE_KEY_EVENTS,
    JSON.stringify({
      events,
      versionId,
    })
  );
}

export function clearEvents() {
  localStorage.removeItem(STORAGE_KEY_EVENTS);
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

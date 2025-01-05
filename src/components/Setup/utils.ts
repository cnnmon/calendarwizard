import { TokenResponse, useGoogleLogin } from "@react-oauth/google";
import { saveEvents } from "./storage";

export type Step = React.FC<StepProps>;

export type StepProps = {
  goToNextStep?: () => void;
  goToPreviousStep?: () => void;
  exitWindow?: () => void;
};

export type SetupForm = {
  name: string;
  calendars: Calendar[];
  selectedCalendars: Calendar[];
  minDate: string;
  maxDate: string;
  versionId: string;
};

export type SetupEvents = {
  events: CalendarEvent[];
  versionId: string;
};

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

type GoogleResponse<T> = {
  ok: boolean;
  data: T;
  error?: string;
};

export function useGoogle(onSuccess: (tokenResponse: TokenResponse) => void) {
  return useGoogleLogin({
    scope:
      "https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events",
    onSuccess,
    onError: () => {
      console.log("error");
    },
  });
}

export async function fetchName(accessToken: string): Promise<GoogleResponse<string>> {
  const response = await fetch(
    "https://www.googleapis.com/oauth2/v1/userinfo",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  if (!response.ok) {
    return {
      ok: false,
      data: "",
      error: "Failed to fetch name " + response.statusText,
    };
  }
  const data = await response.json();
  return {
    ok: true,
    data: data.name,
  };
}

export async function fetchCalendars(accessToken: string): Promise<GoogleResponse<Calendar[]>> {
  const response = await fetch(
    "https://www.googleapis.com/calendar/v3/users/me/calendarList",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  if (!response.ok) {
    return {
      ok: false,
      data: [],
      error: "Failed to fetch calendars " + response.statusText,
    };
  }
  const data = await response.json();
  return {
    ok: true,
    data: data.items,
  };
}

export async function fetchEvents(
  accessToken: string, 
  form: SetupForm,
  setProgress: (calendar: Calendar, progress: number, eventsByDate: {[key: string]: CalendarEvent[]}) => void
): Promise<GoogleResponse<CalendarEvent[]>> {
  const eventsByDate: {[key: string]: CalendarEvent[]} = {};
  const { selectedCalendars, minDate, maxDate } = form;

  for (let i = 0; i < selectedCalendars.length; i++) {
    const calendar = selectedCalendars[i];
    // set progress callback with current calendar and progress percentage
    setProgress(calendar, (i / selectedCalendars.length) * 100, eventsByDate);

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${calendar.id}/events?timeMin=${minDate}&timeMax=${maxDate}&singleEvents=true&maxResults=2000`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      return {
        ok: false,
        data: [],
        error: "Failed to fetch events " + response.statusText,
      };
    }
    const data = await response.json();
    
    // process each event and add to dates
    data.items.forEach((event: CalendarEvent) => {
      const startDate = new Date(event.start.dateTime || event.start.date);
      const endDate = new Date(event.end.dateTime || event.end.date);
      
      // get all dates between start and end
      const dates: Date[] = [];
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      // add event to each date
      dates.forEach(date => {
        const dateStr = date.toISOString().split('T')[0];
        if (!eventsByDate[dateStr]) {
          eventsByDate[dateStr] = [];
        }
        eventsByDate[dateStr].push(event);
      });
    });
  }

  // flatten events by date into single sorted array
  const sortedEvents = Object.keys(eventsByDate)
    .sort()
    .flatMap(date => eventsByDate[date]);

  // remove duplicates
  const uniqueEvents = Array.from(new Set(sortedEvents));

  // sets progress to 100% for last calendar
  setProgress(selectedCalendars[selectedCalendars.length - 1], 100, eventsByDate);
  saveEvents(eventsByDate, form.versionId);

  return {
    ok: true,
    data: uniqueEvents,
  };
}

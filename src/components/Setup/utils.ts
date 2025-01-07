import { TokenResponse, useGoogleLogin } from "@react-oauth/google";
import { Dispatch } from "react";
import { Calendar, CalendarEvent, EventsByDate, State } from "../constants";
import { Action } from "@/app/manager";

export function formExpired(state: State): boolean {
  return state.formVersionId !== state.eventsVersionId || 
         parseInt(state.formVersionId) <= Date.now() - 60 * 60 * 1000;
}

export type Step = React.FC<StepProps>;

export type StepProps = {
  state: State;
  dispatch: Dispatch<Action>;
  goToNextStep?: () => void;
  goToPreviousStep?: () => void;
  onExit?: () => void;
};

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
  state: State,
  setProgress: (calendar: Calendar, eventsByDate: EventsByDate) => void
): Promise<GoogleResponse<EventsByDate>> {
  const eventsByDate: EventsByDate = {};
  const { selectedCalendars, minDate, maxDate } = state;

  for (let i = 0; i < selectedCalendars.length; i++) {
    const calendar = selectedCalendars[i];
    // set progress callback with current calendar and progress percentage
    setProgress(calendar, eventsByDate);

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${calendar.id}/events?timeMin=${minDate}&timeMax=${maxDate}&singleEvents=true&maxResults=3000`,
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
        data: {},
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

  // sets progress to 100% for last calendar
  setProgress(selectedCalendars[selectedCalendars.length - 1], eventsByDate);

  return {
    ok: true,
    data: eventsByDate,
  };
}

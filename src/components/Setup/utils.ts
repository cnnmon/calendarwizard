
import { useGoogleLogin } from "@react-oauth/google";
import { Calendar } from "../constants";

export function useGoogle(setAccessToken: (accessToken: string) => void) {
  return useGoogleLogin({
    scope:
      "https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events",
    onSuccess: async (tokenResponse) => {
    localStorage.setItem("accessToken", tokenResponse.access_token);
    setAccessToken(tokenResponse.access_token);
  },
  onError: () => {
    console.log("error");
    },
  });
}

export async function fetchName(accessToken: string): Promise<string> {
  const response = await fetch(
    "https://www.googleapis.com/oauth2/v1/userinfo",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const data = await response.json();
  return data.name;
}

export async function fetchCalendars(accessToken: string): Promise<Calendar[]> {
  const response = await fetch(
    "https://www.googleapis.com/calendar/v3/users/me/calendarList",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const data = await response.json();
  return data.items;
}

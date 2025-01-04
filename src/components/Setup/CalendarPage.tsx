import { useGoogleLogin } from "@react-oauth/google";

export default function CalendarPage() {
  const login = useGoogleLogin({
    scope:
      "https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events",
    onSuccess: async (tokenResponse) => {
      localStorage.setItem("accessToken", tokenResponse.access_token);
    },
    onError: () => {
      console.log("error");
    },
  });

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Google Calendar Events</h1>
      <button onClick={() => login()}>Sign in with Google</button>
    </div>
  );
}

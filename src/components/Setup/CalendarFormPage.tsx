import { useGoogle, fetchCalendars, fetchName } from "./utils";
import { StepProps } from "./utils";
import { Header, Box, DateSelector, Footer } from "../Form";

export default function CalendarFormPage({
  state,
  dispatch,
  goToNextStep,
  goToPreviousStep,
}: StepProps) {
  const login = useGoogle(async (tokenResponse) => {
    const accessToken = tokenResponse.access_token;

    const [calendars, name] = await Promise.all([
      fetchCalendars(accessToken),
      fetchName(accessToken),
    ]);

    dispatch({
      type: "loginToGoogleApi",
      payload: { accessToken, calendars: calendars.data, name: name.data },
    });
  });

  return (
    <>
      <Header
        title="Google Calendar Integration"
        description="Choose the calendar you want to integrate with the Wizard. We
          don't store your info in any database."
      />
      <div className="flex flex-col px-4 py-6 gap-6">
        <div>
          {state.accessToken ? (
            <p>
              Signed into {state.name}. Or,{" "}
              <a
                onClick={() => {
                  dispatch({ type: "clearAccessToken" });
                }}
              >
                sign out
              </a>
              .
            </p>
          ) : (
            <p>
              <a onClick={() => login()}>Sign in</a> to see your calendars.
            </p>
          )}
        </div>
        <Box title="Calendars">
          {state.calendars.length > 0 ? (
            <div className="overflow-y-auto sm:max-h-[200px]">
              {state.calendars.map((calendar) => (
                <div key={calendar.id} className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    id={calendar.id}
                    name={calendar.id}
                    className="h-4 w-4"
                    checked={state.selectedCalendars.some(
                      (c) => c.id === calendar.id
                    )}
                    onChange={(e) =>
                      dispatch({
                        type: "selectCalendar",
                        payload: {
                          calendar,
                          checked: e.target.checked,
                        },
                      })
                    }
                  />
                  <label htmlFor={calendar.id} className="cursor-pointer">
                    {calendar.summary}
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <p>No calendars found.</p>
          )}
        </Box>
        <Box title="Time">
          <div className="flex flex-col gap-2">
            <DateSelector
              label="Min date to start"
              value={state.minDate}
              onChange={(value) =>
                dispatch({
                  type: "setCalendarForm",
                  payload: { ...state, minDate: value },
                })
              }
            />
            <DateSelector
              label="Max date to start"
              value={state.maxDate}
              onChange={(value) =>
                dispatch({
                  type: "setCalendarForm",
                  payload: { ...state, maxDate: value },
                })
              }
            />
          </div>
        </Box>
      </div>
      <Footer
        goToNextStep={() => {
          goToNextStep?.();
        }}
        goToPreviousStep={goToPreviousStep}
        nextIsDisabled={
          state.selectedCalendars.length === 0 ||
          !state.minDate ||
          !state.maxDate
        }
      />
    </>
  );
}

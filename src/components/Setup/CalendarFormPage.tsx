import { useGoogle, fetchCalendars, fetchName, StepProps } from "./utils";
import { Header, Box, DateSelector, Footer } from "../Form";
import { useState, useEffect } from "react";
import { Calendar } from "../constants";

export default function CalendarFormPage({
  state,
  dispatch,
  goToNextStep,
  goToPreviousStep,
}: StepProps) {
  const [selectedCalendars, setSelectedCalendars] = useState<Calendar[]>([]);
  const [minDate, setMinDate] = useState<string | null>(null);
  const [maxDate, setMaxDate] = useState<string | null>(null);

  useEffect(() => {
    setSelectedCalendars(state.selectedCalendars);
    setMinDate(state.minDate);
    setMaxDate(state.maxDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              {state.calendars
                .sort((a, b) => -a.summary.localeCompare(b.summary))
                .map((calendar) => (
                  <div
                    key={calendar.id}
                    className="flex items-center gap-2 mb-2"
                  >
                    <input
                      type="checkbox"
                      id={calendar.id}
                      name={calendar.id}
                      className="h-4 w-4"
                      checked={selectedCalendars.some(
                        (c) => c.id === calendar.id
                      )}
                      onChange={(e) =>
                        setSelectedCalendars(
                          e.target.checked
                            ? [...selectedCalendars, calendar]
                            : selectedCalendars.filter(
                                (c) => c.id !== calendar.id
                              )
                        )
                      }
                    />
                    <label htmlFor={calendar.id} className="cursor-pointer">
                      {calendar.summary}
                    </label>
                  </div>
                ))}
            </div>
          ) : (
            <p>
              No calendars found.{" "}
              <a
                onClick={() => {
                  dispatch({ type: "useExampleCalendar" });
                  goToNextStep?.();
                }}
              >
                Use an example?
              </a>
            </p>
          )}
        </Box>
        <Box title="Time">
          <div className="flex flex-col gap-2">
            <DateSelector
              label="Min date to start"
              value={minDate || ""}
              onChange={(value) => setMinDate(value)}
            />
            <DateSelector
              label="Max date to start"
              value={maxDate || ""}
              onChange={(value) => setMaxDate(value)}
            />
          </div>
        </Box>
      </div>
      <Footer
        goToNextStep={() => {
          dispatch({
            type: "setCalendarForm",
            payload: {
              ...state,
              selectedCalendars,
              minDate: minDate!,
              maxDate: maxDate!,
              formVersionId: Date.now().toString(),
            },
          });
          goToNextStep?.();
        }}
        goToPreviousStep={goToPreviousStep}
        nextIsDisabled={selectedCalendars.length === 0 || !minDate || !maxDate}
      />
    </>
  );
}

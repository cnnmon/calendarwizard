import { useEffect, useState } from "react";
import { useGoogle, fetchCalendars, fetchName } from "./utils";
import { StepProps, SetupForm } from "./utils";
import { Header, Box, DateSelector, Footer } from "../Form";
import { getAccessToken, getForm, saveAccessToken, saveForm } from "./storage";

const initialForm: Omit<SetupForm, "versionId"> = {
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

export default function CalendarPage({
  goToNextStep,
  goToPreviousStep,
}: StepProps) {
  const [accessToken, setAccessToken] = useState<string>("");

  // form state
  const [form, setForm] = useState<Omit<SetupForm, "versionId">>(initialForm);

  const login = useGoogle((tokenResponse) => {
    const accessToken = tokenResponse.access_token;
    saveAccessToken(accessToken);
    setAccessToken(accessToken);
    fetchCalendars(accessToken).then((calendars) => {
      setForm((prev) => ({
        ...prev,
        calendars: calendars.data,
      }));
    });

    fetchName(accessToken).then((name) => {
      if (name.ok) {
        setForm((prev) => ({
          ...prev,
          name: name.data,
        }));
      }
    });
  });

  useEffect(() => {
    const accessToken = getAccessToken();
    if (accessToken) {
      setAccessToken(accessToken);
      const form = getForm();
      if (form) {
        setForm(form);
      }
    }
  }, []);

  return (
    <>
      <Header
        title="Google Calendar Integration"
        description="Choose the calendar you want to integrate with the Wizard. We
          don't store your info in any database."
      />
      <div className="flex flex-col px-4 py-6 gap-6">
        <div>
          {accessToken ? (
            <p>
              Signed into {form.name}. Or,{" "}
              <a
                onClick={() => {
                  saveAccessToken("");
                  setAccessToken("");
                  setForm(initialForm);
                }}
              >
                sign out.
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
          {form.calendars.length > 0 ? (
            <div className="overflow-y-auto sm:max-h-[200px]">
              {form.calendars.map((calendar) => (
                <div key={calendar.id} className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    id={calendar.id}
                    name={calendar.id}
                    className="h-4 w-4"
                    checked={form.selectedCalendars.some(
                      (c) => c.id === calendar.id
                    )}
                    onChange={() =>
                      setForm((prev) => ({
                        ...prev,
                        selectedCalendars: prev.selectedCalendars.includes(
                          calendar
                        )
                          ? prev.selectedCalendars.filter(
                              (c) => c.id !== calendar.id
                            )
                          : [...prev.selectedCalendars, calendar],
                      }))
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
              value={form.minDate}
              onChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  minDate: value,
                }))
              }
            />
            <DateSelector
              label="Max date to start"
              value={form.maxDate}
              onChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  maxDate: value,
                }))
              }
            />
          </div>
        </Box>
      </div>
      <Footer
        goToNextStep={() => {
          saveForm(form);
          goToNextStep?.();
        }}
        goToPreviousStep={goToPreviousStep}
        nextIsDisabled={
          form.selectedCalendars.length === 0 || !form.minDate || !form.maxDate
        }
      />
    </>
  );
}

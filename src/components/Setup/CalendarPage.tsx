import { useEffect, useState } from "react";
import Box from "./Box";
import Footer from "./Footer";
import { useGoogle, fetchCalendars, fetchName } from "./utils";
import DateSelector from "../Form/DateSelector";
import { Calendar, StepProps } from "../constants";

type FormState = {
  accessToken: string;
  name: string;
  calendars: Calendar[];
  selectedCalendars: Calendar[];
  minDate: Date | null;
  maxDate: Date | null;
};

export default function CalendarPage({
  goToNextStep,
  goToPreviousStep,
}: StepProps) {
  const [formState, setFormState] = useState<FormState>({
    accessToken: "",
    name: "",
    calendars: [],
    selectedCalendars: [],
    minDate: new Date(Date.now() - 366 * 24 * 60 * 60 * 1000),
    maxDate: new Date(),
  });

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      setFormState((prev) => ({ ...prev, accessToken }));
    }
  }, []);

  const login = useGoogle((accessToken) => {
    setFormState((prev) => ({ ...prev, accessToken }));
  });

  useEffect(() => {
    if (formState.accessToken) {
      fetchCalendars(formState.accessToken).then((calendars) => {
        setFormState((prev) => ({ ...prev, calendars }));
      });
      fetchName(formState.accessToken).then((name) => {
        setFormState((prev) => ({ ...prev, name }));
      });
    }
  }, [formState.accessToken]);

  const handleNext = () => {
    localStorage.setItem(
      "selectedCalendars",
      JSON.stringify(formState.selectedCalendars)
    );
    localStorage.setItem("minDate", formState.minDate?.toISOString() || "");
    localStorage.setItem("maxDate", formState.maxDate?.toISOString() || "");
    goToNextStep!();
  };

  return (
    <>
      <div className="bg-white p-4 border-b border-dark-color">
        <h1 className="text-xl">Google Calendar Integration</h1>
        <p>
          Choose the calendar you want to integrate with the Wizard. We
          won&apos;t store this anywhere.
        </p>
      </div>
      <div className="flex flex-col px-4 py-6 gap-6">
        <div>
          {formState.accessToken ? (
            <p>
              Signed into {formState.name}. Or,{" "}
              <a onClick={() => login()}>sign into another account</a>.
            </p>
          ) : (
            <p>
              <a onClick={() => login()}>Sign in</a> to see your calendars.
            </p>
          )}
        </div>
        <Box title="Calendars">
          {formState.calendars.length > 0 ? (
            <div className="overflow-y-auto sm:max-h-[200px]">
              {formState.calendars.map((calendar) => (
                <div key={calendar.id} className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    id={calendar.id}
                    name={calendar.id}
                    className="h-4 w-4"
                    checked={formState.selectedCalendars.includes(calendar)}
                    onChange={() =>
                      setFormState((prev) => ({
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
              value={
                formState.minDate
                  ? formState.minDate.toISOString().split("T")[0]
                  : ""
              }
              onChange={(value) =>
                setFormState((prev) => ({ ...prev, minDate: new Date(value) }))
              }
            />
            <DateSelector
              label="Max date to start"
              value={
                formState.maxDate
                  ? formState.maxDate.toISOString().split("T")[0]
                  : ""
              }
              onChange={(value) =>
                setFormState((prev) => ({ ...prev, maxDate: new Date(value) }))
              }
            />
          </div>
        </Box>
      </div>
      <Footer
        goToNextStep={handleNext}
        goToPreviousStep={goToPreviousStep}
        nextIsDisabled={formState.selectedCalendars.length === 0}
      />
    </>
  );
}

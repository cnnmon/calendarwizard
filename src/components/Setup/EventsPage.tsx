import { useEffect, useState } from "react";
import { Header, Footer } from "../Form";
import { Calendar, CalendarEvent, StepProps, fetchEvents } from "./utils";

function EventLine({ event }: { event: CalendarEvent }) {
  return (
    <div key={event.id} className="flex justify-between">
      <p>{event.summary ?? "(No title)"}</p>
      <p>
        {new Date(event.start.dateTime || event.start.date).toLocaleString()}
      </p>
    </div>
  );
}

export default function EventsPage({
  state,
  dispatch,
  goToPreviousStep,
  onExit,
}: StepProps) {
  const [progress, setProgress] = useState(0);
  const [eventsByDate, setEventsByDate] = useState<{
    [key: string]: CalendarEvent[];
  }>({});
  const [currentCalendar, setCurrentCalendar] = useState<Calendar | null>(null);
  const isDone = progress === 100;

  useEffect(
    () => {
      if (!state.accessToken || !state.eventsByDate) {
        goToPreviousStep?.();
        return;
      }

      if (state.eventsLastUpdated) {
        setProgress(100);
        setEventsByDate(state.eventsByDate);
        return;
      }

      fetchEvents(state.accessToken, state, (calendar, progress, events) => {
        setCurrentCalendar(calendar);
        setProgress(progress);
        setEventsByDate(events);
      }).then((allEvents) => {
        if (allEvents.ok) {
          dispatch({ type: "setEventsByDate", payload: allEvents.data });
        }
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  function getProgressText() {
    if (progress === 100 && state.eventsLastUpdated) {
      const lastUpdatedDate = new Date(state.eventsLastUpdated);
      return (
        <p>
          {Object.values(eventsByDate).flat().length} events loaded as of{" "}
          {lastUpdatedDate.toLocaleString()}.{" "}
          <a
            onClick={() => {
              dispatch({ type: "clearEvents" });
            }}
          >
            Reload events?
          </a>
        </p>
      );
    }

    if (currentCalendar) {
      return <p>Loading events from {currentCalendar.summary}...</p>;
    }

    return <p>Preparing to load events...</p>;
  }

  return (
    <div>
      <Header
        title="Events"
        description="WizardingAssistant is loading the events from your calendar."
      />
      <div className="flex flex-col gap-4 p-4">
        <div>
          <div className="mb-2">{getProgressText()}</div>
          <div className="w-full bg-gray-200 h-4 border overflow-hidden">
            <div
              className="h-full bg-dark-color transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="border bg-white p-4 max-h-[400px] overflow-y-auto">
          {Object.entries(eventsByDate)
            .slice()
            .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
            .map(([date, events]) => (
              <div key={date}>
                {Array.from(new Set(events)).map((event, index) => (
                  <EventLine key={index.toString()} event={event} />
                ))}
              </div>
            ))}
        </div>
      </div>
      <Footer
        goToPreviousStep={goToPreviousStep}
        nextOverride={
          <button
            className="border"
            disabled={!isDone}
            onClick={() => {
              onExit?.();
            }}
          >
            {isDone ? "Finish" : "Loading..."}
          </button>
        }
      />
    </div>
  );
}

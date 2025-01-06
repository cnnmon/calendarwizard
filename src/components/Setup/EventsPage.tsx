import { useEffect, useState } from "react";
import { Header, Footer } from "../Form";
import { CalendarEvent, Calendar, EventsByDate } from "../constants";
import { StepProps, fetchEvents } from "./utils";

enum ProgressStage {
  PREPARING = "preparing",
  LOADING_EVENTS = "loading_events",
  LOADING_VECTOR_STORE = "loading_vector_store",
  DONE = "done",
}

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
  const [progress, setProgress] = useState<{
    current: number;
    stage: ProgressStage;
    eventsByDate: EventsByDate;
  }>({
    current: 0,
    stage: ProgressStage.PREPARING,
    eventsByDate: {},
  });
  const [completedCalendars, setCompletedCalendars] = useState<Calendar[]>([]);
  const [reloadEvents, setReloadEvents] = useState(false);

  useEffect(() => {
    if (!reloadEvents && state.eventsVersionId === state.formVersionId) {
      if (!state.accessToken || !state.eventsByDate) {
        goToPreviousStep?.();
        return;
      }

      if (state.eventsLastUpdated) {
        setProgress({
          current: 100,
          stage: ProgressStage.DONE,
          eventsByDate: state.eventsByDate,
        });
        return;
      }
    }

    setReloadEvents(false);
    fetchEvents(state.accessToken, state, (calendar, eventsByDate) => {
      setCompletedCalendars([...completedCalendars, calendar]);
      setProgress({
        current: (completedCalendars.length / state.calendars.length) * 100,
        stage: ProgressStage.LOADING_EVENTS,
        eventsByDate,
      });
    }).then((allEvents) => {
      if (allEvents.ok) {
        setProgress({
          current: 100,
          stage: ProgressStage.LOADING_VECTOR_STORE,
          eventsByDate: allEvents.data,
        });
        fetch(`/api/vectorstore`, {
          method: "POST",
          body: JSON.stringify({ eventsByDate: allEvents.data }),
        }).then((res) => {
          if (res.ok) {
            setProgress({
              current: 100,
              stage: ProgressStage.DONE,
              eventsByDate: allEvents.data,
            });
            dispatch({ type: "setEventsByDate", payload: allEvents.data });
          }
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadEvents]);

  function getProgressText() {
    if (progress.stage === ProgressStage.DONE) {
      const lastUpdatedDate = new Date(state.eventsLastUpdated || "");
      return (
        <p>
          {Object.values(progress.eventsByDate).flat().length} events loaded as
          of {lastUpdatedDate.toLocaleString()}.{" "}
          <a
            onClick={() => {
              setReloadEvents(true);
            }}
          >
            Reload events?
          </a>
        </p>
      );
    }

    if (progress.stage === ProgressStage.LOADING_EVENTS) {
      return (
        <p>
          Loading events from{" "}
          {completedCalendars[completedCalendars.length - 1]?.summary}...
        </p>
      );
    }

    if (progress.stage === ProgressStage.LOADING_VECTOR_STORE) {
      return <p>Loading events into vector store...</p>;
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
              style={{ width: `${progress.current}%` }}
            />
          </div>
        </div>

        <div className="border bg-white p-4 max-h-[400px] overflow-y-auto">
          {Object.entries(progress.eventsByDate)
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
            disabled={progress.stage !== ProgressStage.DONE}
            onClick={() => {
              onExit?.();
            }}
          >
            {progress.stage === ProgressStage.DONE ? "Finish" : "Loading..."}
          </button>
        }
      />
    </div>
  );
}

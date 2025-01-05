import { useEffect, useState } from "react";
import { Header, Footer } from "../Form";
import { Calendar, CalendarEvent, StepProps, fetchEvents } from "./utils";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import {
  clearEvents,
  getAccessToken,
  getEvents,
  getForm,
  saveEvents,
} from "./storage";

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo("en-US");

function EventLine({ event }: { event: CalendarEvent }) {
  const dateString = (() => {
    const startDate = new Date(event.start.date ?? event.start.dateTime);
    const endDate = new Date(event.end.date ?? event.end.dateTime);

    // same date or time
    if (startDate.toDateString() === endDate.toDateString()) {
      return timeAgo.format(startDate);
    }

    // different days
    return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
  })();

  return (
    <div key={event.id} className="flex justify-between">
      <p>{event.summary ?? "(No title)"}</p>
      <p>{dateString}</p>
    </div>
  );
}

export default function EventsPage({
  goToPreviousStep,
  exitWindow,
}: StepProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentCalendar, setCurrentCalendar] = useState<Calendar | null>(null);
  const [reloadEvents, setReloadEvents] = useState(false);

  const isDone = progress === 100;

  useEffect(() => {
    setReloadEvents(false);

    const savedForm = getForm();
    if (!savedForm) {
      goToPreviousStep?.();
      return;
    }

    const savedEvents = getEvents(savedForm.versionId);
    if (savedEvents) {
      setEvents(savedEvents.events);
      setProgress(100);
      setLastUpdated(savedEvents.versionId);
      // we don't need to re-save events
      return;
    }

    const accessToken = getAccessToken();
    if (!accessToken) {
      goToPreviousStep?.();
      return;
    }

    fetchEvents(accessToken, savedForm, (calendar, progress, events) => {
      setCurrentCalendar(calendar);
      setEvents(events);
      setProgress(progress);
    }).then((allEvents) => {
      if (allEvents.ok) {
        saveEvents(allEvents.data, savedForm.versionId);
        setLastUpdated(savedForm.versionId);
      }
    });
  }, [reloadEvents, goToPreviousStep]);

  function getProgressText() {
    if (progress === 100 && lastUpdated) {
      const lastUpdatedDate = new Date(lastUpdated);
      return (
        <p>
          {events.length} events loaded as of {lastUpdatedDate.toLocaleString()}
          .{" "}
          <a
            onClick={() => {
              clearEvents();
              setReloadEvents(true);
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
          {events
            .slice()
            .reverse()
            .map((event, index) => (
              <EventLine key={index.toString()} event={event} />
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
              exitWindow?.();
            }}
          >
            {isDone ? "Finish" : "Loading..."}
          </button>
        }
      />
    </div>
  );
}

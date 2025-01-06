import RelativeTime from "../RelativeTime";
import { CalendarEvent } from "../Setup/utils";
import WindowBox from "../WindowBox";
import { State } from "@/components/constants";

export default function Events({
  state,
  onExit,
}: {
  state: State;
  onExit: () => void;
}) {
  const eventsByDate = state.eventsByDate;
  if (!eventsByDate) {
    return null;
  }

  // get upcoming events for the next 42 hours
  const upcomingEvents: Array<{ date: string; events: Array<CalendarEvent> }> =
    [];
  const today = new Date();
  const endTime = new Date(today.getTime() + 42 * 60 * 60 * 1000);
  const currentDate = new Date(today);
  while (currentDate <= endTime) {
    const dateStr = currentDate.toISOString().split("T")[0];
    upcomingEvents.push({
      date: dateStr,
      events: eventsByDate[dateStr] || [],
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // filter events within each date to only include those in next 42 hours
  upcomingEvents.forEach((dayEvents) => {
    dayEvents.events = dayEvents.events.filter((event) => {
      const eventTime = new Date(event.start.dateTime || event.start.date);
      return eventTime >= today && eventTime <= endTime;
    });
  });

  return (
    <div className="sm:absolute sm:top-1/2 sm:left-1/4">
      <WindowBox name="Upcoming Events 📅" onExit={onExit}>
        <div className="flex flex-col gap-4 p-4 max-h-[500px] overflow-y-auto">
          {upcomingEvents.map(({ date, events }) => {
            if (events.length === 0) {
              return null;
            }
            return (
              <div key={date}>
                {events
                  .sort((a, b) => {
                    const aTime = new Date(a.start.dateTime || a.start.date);
                    const bTime = new Date(b.start.dateTime || b.start.date);
                    return aTime.getTime() - bTime.getTime();
                  })
                  .map((event) => (
                    <div key={event.id} className="mb-2">
                      <p>
                        <span className="font-bold">{event.summary}</span>{" "}
                        <span className="text-gray-500">
                          <RelativeTime
                            date={
                              new Date(event.start.dateTime || event.start.date)
                            }
                          />
                        </span>{" "}
                      </p>
                      <p className="text-gray-500">{event.location}</p>
                    </div>
                  ))}
              </div>
            );
          })}
        </div>
      </WindowBox>
    </div>
  );
}

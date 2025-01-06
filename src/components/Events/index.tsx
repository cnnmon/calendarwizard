import RelativeTime from "../RelativeTime";
import WindowBox from "../WindowBox";
import { CalendarEvent, State } from "@/components/constants";

export default function Events({
  state,
  onExit,
}: {
  state: State;
  onExit: () => void;
}) {
  const eventsByDate = state.eventsByDate;
  const upcomingEvents: CalendarEvent[] = [];
  const today = new Date();
  const endTime = new Date(today.getTime() + 42 * 60 * 60 * 1000);
  const currentDate = new Date(today);

  while (currentDate <= endTime) {
    const dateStr = currentDate.toISOString().split("T")[0];
    upcomingEvents.push(...(eventsByDate[dateStr] || []));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return (
    <div className="sm:absolute">
      <WindowBox name="Events 📅" onExit={onExit}>
        <div className="flex flex-col p-4 sm:w-[400px] max-h-[500px] overflow-y-auto">
          {upcomingEvents.length === 0 ? (
            <p className="text-gray-500">No upcoming events.</p>
          ) : (
            upcomingEvents
              .sort((a, b) => {
                const aTime = new Date(a.start.dateTime || a.start.date);
                const bTime = new Date(b.start.dateTime || b.start.date);
                return aTime.getTime() - bTime.getTime();
              })
              .map((event) => (
                <div key={event.id}>
                  <div className="flex justify-between">
                    <p>
                      <span className="font-bold">{event.summary}</span>{" "}
                    </p>
                    <div className="text-gray-500">
                      <RelativeTime
                        date={
                          new Date(event.start.dateTime || event.start.date)
                        }
                      />
                    </div>{" "}
                  </div>
                </div>
              ))
          )}
        </div>
      </WindowBox>
    </div>
  );
}

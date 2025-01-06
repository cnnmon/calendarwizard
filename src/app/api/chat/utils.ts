import { EventsByDate } from "@/components/constants";
import { formatDocumentsAsString } from "langchain/util/document";

export function formatEventsAsString(eventsByDate: EventsByDate): string {
  return formatDocumentsAsString(Object.values(eventsByDate).flat().map(event => ({
    pageContent: `${new Date(event.start.date ?? event.start.dateTime).toLocaleDateString()}: ${event.summary ?? '(No title)'} - ${event.location ?? ''} - (${event.start.date ?? event.start.dateTime} to ${event.end.date ?? event.end.dateTime})${event.organizer?.displayName ? ` (organized by ${event.organizer.displayName})` : ''}`,
    metadata: {
      source: 'calendar'
    }
  })))
}

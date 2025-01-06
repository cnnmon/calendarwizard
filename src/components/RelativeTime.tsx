import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { useState, useEffect } from "react";

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo("en-US");

export default function RelativeTime({ date }: { date: Date }) {
  const [relativeTime, setRelativeTime] = useState(
    timeAgo.format(new Date(date ?? new Date()))
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setRelativeTime(timeAgo.format(new Date(date ?? new Date())));
    }, 60000);

    return () => clearInterval(timer);
  }, [date]);

  return <p suppressHydrationWarning>{relativeTime}</p>;
}

import Image from "next/image";
import { Message } from "@/components/constants";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { useState, useEffect } from "react";

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo("en-US");

export default function Bubble({ message }: { message: Message }) {
  const { sender, content, timestamp } = message;
  const [relativeTime, setRelativeTime] = useState(
    timeAgo.format(new Date(timestamp))
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setRelativeTime(timeAgo.format(new Date(timestamp)));
    }, 60000);

    return () => clearInterval(timer);
  }, [timestamp]);

  if (!sender) {
    return (
      <div className="flex justify-center">
        <p
          className="whitespace-pre-wrap italic text-gray-color text-center px-4"
          suppressHydrationWarning
        >
          {content}
        </p>
      </div>
    );
  }

  const sentBySystem = sender === "assistant";

  return (
    <div className="flex items-start">
      {sentBySystem && (
        <div className="mr-2 w-24 mt-[8px]">
          <Image
            src="/profile.png"
            width={100}
            height={100}
            alt={sender}
            className="button no-drag"
          />
        </div>
      )}
      <div className="w-full">
        <div className="flex justify-between">
          <p>{sender}</p>
          <p suppressHydrationWarning>{relativeTime}</p>
        </div>
        <p
          className={`border p-2 w-full whitespace-pre-line ${
            sentBySystem ? "bg-gray-200" : "bg-dark-color text-white"
          }`}
        >
          {content}
        </p>
      </div>
    </div>
  );
}

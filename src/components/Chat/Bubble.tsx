import Image from "next/image";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { useState, useEffect } from "react";
import { Message } from "ai";
import ReactMarkdown from "react-markdown";

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo("en-US");

export default function Bubble({ message }: { message: Message }) {
  const isSystem = message.role === "assistant";

  const [relativeTime, setRelativeTime] = useState(
    timeAgo.format(new Date(message.createdAt ?? new Date()))
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setRelativeTime(
        timeAgo.format(new Date(message.createdAt ?? new Date()))
      );
    }, 60000);

    return () => clearInterval(timer);
  }, [message.createdAt]);

  return (
    <div className={`flex ${isSystem ? "justify-start" : "justify-end"}`}>
      {isSystem && (
        <div className="mr-2 w-24 mt-[8px]">
          <Image
            src="/profile.png"
            width={100}
            height={100}
            alt="WizardingAssistant"
            className="button no-drag"
          />
        </div>
      )}
      <div className="w-full">
        <div className="flex justify-between">
          <p>{message.role}</p>
          <p suppressHydrationWarning>{relativeTime}</p>
        </div>
        <div
          className={`border p-2 w-full prose prose-sm max-w-none ${
            isSystem ? "bg-gray-200" : "bg-dark-color text-white prose-invert"
          } ${message.content === "" && isSystem ? "animate-pulse" : ""}`}
        >
          {message.content ? (
            <ReactMarkdown>{message.content}</ReactMarkdown>
          ) : (
            isSystem && "..."
          )}
        </div>
      </div>
    </div>
  );
}

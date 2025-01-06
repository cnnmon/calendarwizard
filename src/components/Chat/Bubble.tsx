import Image from "next/image";
import { Message } from "ai";
import ReactMarkdown from "react-markdown";
import RelativeTime from "../RelativeTime";

export default function Bubble({ message }: { message: Message }) {
  const isSystem = message.role === "assistant";

  return (
    <div className={`flex ${isSystem ? "justify-start" : "justify-end"}`}>
      {isSystem && (
        <div className="mr-2 w-24 mt-[8px]">
          <Image
            src="/profile.svg"
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
          <RelativeTime date={message.createdAt ?? new Date()} />
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

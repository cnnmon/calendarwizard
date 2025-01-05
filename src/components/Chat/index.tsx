import Bubble from "./Bubble";
import Textbox from "./Textbox";
import Window from "@/components/Window";
import { useChat } from "ai/react";
import { useRef, useEffect } from "react";
import {
  getEventsByDate,
  saveMessages,
  getInitialMessages,
} from "../Setup/storage";

export default function Chat({ onExit }: { onExit: () => void }) {
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
    streamProtocol: "text",
    initialMessages: getInitialMessages(),
    body: {
      eventsByDate: getEventsByDate(),
    },
    onError: (error) => {
      console.error("Error:", error);
    },
    onFinish: () => {
      saveMessages(messages);
    },
  });

  useEffect(() => {
    chatScrollRef.current?.scrollTo({
      top: chatScrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <Window name="Chat 💬" onExit={onExit}>
      <div className="sm:w-[550px] sm:h-[600px] sm:max-h-[calc(100vh-100px)] flex flex-col">
        <div
          ref={chatScrollRef}
          className="overflow-y-auto p-4 flex flex-col gap-4 h-full"
        >
          {messages.map((message, index) => (
            <Bubble message={message} key={index} />
          ))}
        </div>
        <Textbox
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          focusTextbox={() => {
            const textarea = document.querySelector("textarea");
            textarea?.focus();
          }}
        />
      </div>
    </Window>
  );
}

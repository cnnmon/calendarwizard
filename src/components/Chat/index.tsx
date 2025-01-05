import { useState, useRef } from "react";
import { Message } from "@/components/constants";
import Bubble from "./Bubble";
import Textbox from "./Textbox";
import Window from "@/components/Window";

export default function Chat({ onExit }: { onExit: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "assistant",
      content:
        "Hello! I'm WizardingAssistant, your personal assistant. I know about your calendar events. Ask me anything!",
      timestamp: new Date().toISOString(),
    },
  ]);

  const sendMessage = (message: string) => {
    setMessages((prev) => [...prev, { sender: "user", content: message }]);
  };

  const [chatboxText, setChatboxText] = useState("");
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const focusTextbox = () => {
    const textarea = document.querySelector("textarea");
    textarea?.focus();
  };

  return (
    <Window name="Chat 💬" onExit={onExit}>
      <div className="sm:w-[500px] sm:h-[500px] sm:max-h-[calc(100vh-100px)] flex flex-col">
        <div
          ref={chatScrollRef}
          className="overflow-y-auto p-4 flex flex-col gap-4 h-full"
        >
          {messages.map((message, index) => (
            <Bubble message={message} key={index} />
          ))}
        </div>
        <Textbox
          chatboxText={chatboxText}
          setChatboxText={setChatboxText}
          sendMessage={sendMessage}
          chatScrollRef={chatScrollRef as React.RefObject<HTMLDivElement>}
          focusTextbox={focusTextbox}
        />
      </div>
    </Window>
  );
}

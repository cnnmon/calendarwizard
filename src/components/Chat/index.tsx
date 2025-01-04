import { useState, useRef } from "react";
import { Message } from "@/components/constants";
import Bubble from "./Bubble";
import Textbox from "./Textbox";
import Container from "../Container";

export default function Chat({
  messages,
  sendMessage,
}: {
  messages: Message[];
  sendMessage: (message: Message) => void;
}) {
  const [chatboxText, setChatboxText] = useState("");
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    const newMessage: Message = {
      sender: "user",
      content: chatboxText,
      timestamp: new Date().toISOString(),
    };

    sendMessage(newMessage);
    setChatboxText("");

    /* focus textarea again after sending message */
    setTimeout(() => {
      focusTextbox();
      chatScrollRef.current?.scrollTo({
        top: chatScrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 0);
  };

  const focusTextbox = () => {
    const textarea = document.querySelector("textarea");
    textarea?.focus();
  };

  return (
    <Container name="Chat">
      <div className="h-[700px] sm:h-[700px] sm:max-h-[calc(100vh-100px)] flex flex-col">
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
          sendMessage={handleSendMessage}
          focusTextbox={focusTextbox}
        />
      </div>
    </Container>
  );
}

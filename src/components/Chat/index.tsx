import Bubble from "./Bubble";
import Textbox from "./Textbox";
import { useChat } from "ai/react";
import { useRef, useEffect, Dispatch, useState } from "react";
import { State } from "../constants";
import WindowBox from "../WindowBox";
import { Action } from "@/app/manager";

export default function Chat({
  state,
  dispatch,
  onExit,
}: {
  state: State;
  dispatch: Dispatch<Action>;
  onExit: () => void;
}) {
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const [chatId, setChatId] = useState<number>(1);

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    id: chatId.toString(),
    api: "/api/chat",
    streamProtocol: "text",
    initialMessages: state.messages,
    body: {
      eventsByDate: state.eventsByDate,
      notepad: state.notepad,
      isExample: state.isExample,
    },
  });

  const clearChat = () => {
    dispatch({ type: "clearMessages" });
    setChatId(chatId + 1);
  };

  useEffect(() => {
    chatScrollRef.current?.scrollTo({
      top: chatScrollRef.current.scrollHeight,
    });
    dispatch({ type: "saveMessages", payload: messages });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  return (
    <WindowBox name="Chat 💬" onExit={onExit}>
      <div className="sm:w-[550px] h-[600px] sm:max-h-[calc(100vh-100px)] flex flex-col">
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
          clearChat={clearChat}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          focusTextbox={() => {
            const textarea = document.querySelector("textarea");
            textarea?.focus();
          }}
        />
      </div>
    </WindowBox>
  );
}

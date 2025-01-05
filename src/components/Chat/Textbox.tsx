"use client";

import { Message } from "../constants";

export const MAX_CHAT_LENGTH = 250;

export default function Textbox({
  chatboxText,
  setChatboxText,
  chatScrollRef,
  sendMessage,
  focusTextbox,
}: {
  chatboxText: string;
  setChatboxText: (text: string) => void;
  sendMessage: (message: Message) => void;
  chatScrollRef: React.RefObject<HTMLDivElement>;
  focusTextbox: () => void;
}) {
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      if (chatboxText && chatboxText.length <= MAX_CHAT_LENGTH) {
        handleSendMessage();
      }

      setTimeout(() => {
        focusTextbox();
      }, 0);
    }
  };

  return (
    <div className="p-2 border-t-[1.5px] border-dark-color flex flex-col">
      <textarea
        className="w-full resize-none p-2 border textbox"
        rows={3}
        value={chatboxText}
        onChange={(e) => setChatboxText(e.target.value)}
        placeholder="Ask me anything..."
        onKeyDown={handleKeyDown}
      />
      <div className="flex justify-between">
        <button
          className="mt-2 border"
          disabled={!chatboxText || chatboxText.length > MAX_CHAT_LENGTH}
          onClick={sendMessage}
        >
          Submit
        </button>
        <p
          className={`mt-1 ${
            chatboxText.length > MAX_CHAT_LENGTH ? "text-red-500" : ""
          }`}
        >
          {chatboxText.length}/{MAX_CHAT_LENGTH} characters
        </p>
      </div>
    </div>
  );
}

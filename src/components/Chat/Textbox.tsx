"use client";

import { ChangeEvent } from "react";
import { ChatRequestOptions } from "ai";

export const MAX_CHAT_LENGTH = 250;

export default function Textbox({
  input,
  handleInputChange,
  handleSubmit,
  focusTextbox,
}: {
  input: string;
  handleInputChange: (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => void;
  handleSubmit: (
    event?: { preventDefault?: (() => void) | undefined } | undefined,
    chatRequestOptions?: ChatRequestOptions | undefined
  ) => void;
  focusTextbox: () => void;
}) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      if (input && input.length <= MAX_CHAT_LENGTH) {
        handleSubmit();
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
        value={input}
        onChange={(e) => handleInputChange(e)}
        placeholder="Ask me anything..."
        onKeyDown={handleKeyDown}
      />
      <div className="flex justify-between">
        <button
          className="mt-2 border"
          disabled={!input || input.length > MAX_CHAT_LENGTH}
          onClick={handleSubmit}
        >
          Submit
        </button>
        <p
          className={`mt-1 ${
            input.length > MAX_CHAT_LENGTH ? "text-red-500" : ""
          }`}
        >
          {input.length}/{MAX_CHAT_LENGTH} characters
        </p>
      </div>
    </div>
  );
}

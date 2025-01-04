"use client";
import Setup from "@/components/Setup";

export default function Home() {
  return (
    <main className="flex min-h-screen sm:items-center justify-center">
      <div className="sm:max-w-[800px] sm:p-4">
        <Setup />
        {/* <Chat
          messages={[]}
          sendMessage={(message) => {
            setMessages([...messages, message]);
          }}
        /> */}
      </div>
    </main>
  );
}

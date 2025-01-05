"use client";
import Chat from "@/components/Chat";
import { Message } from "@/components/constants";
import Container from "@/components/Container";
import Icon from "@/components/Icon/icon";
import Setup from "@/components/Setup";
import { getWindowsOpen, saveWindowsOpen } from "@/components/Setup/storage";
import { useEffect, useState } from "react";
import { Window } from "@/components/constants";

export default function Home() {
  const [windowsOpen, setWindowsOpen] = useState<Window[]>([]);

  useEffect(() => {
    const windowsOpen = getWindowsOpen();
    setWindowsOpen(windowsOpen);
  }, []);

  useEffect(() => {
    saveWindowsOpen(windowsOpen);
  }, [windowsOpen]);

  const handleExitWindow = (window: Window) => {
    setWindowsOpen(windowsOpen.filter((w) => w !== window));
  };

  return (
    <Container>
      {windowsOpen.includes(Window.Setup) && (
        <Setup exitWindow={() => handleExitWindow(Window.Setup)} />
      )}
      {windowsOpen.includes(Window.Chat) && (
        <Chat onExit={() => handleExitWindow(Window.Chat)} />
      )}
      <Icon
        emoji="💬"
        title="Chat"
        onClick={() => setWindowsOpen([Window.Chat])}
      />
      <Icon
        emoji="⚙️"
        title="Setup"
        onClick={() => setWindowsOpen([Window.Setup])}
      />
    </Container>
  );
}

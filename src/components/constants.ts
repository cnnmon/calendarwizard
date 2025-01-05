export type Message = {
  sender: "user" | "assistant";
  content: string;
  timestamp: string;
};

export enum Window {
  Setup = "Setup",
  Chat = "Chat",
}

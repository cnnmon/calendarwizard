export type Message = {
  sender: "user" | "assistant";
  content: string;
  timestamp: string;
};

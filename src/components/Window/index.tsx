import { ReactNode, useRef } from "react";
import Header from "./Header";

export default function Window({
  children,
  name,
  onExit,
}: {
  children: ReactNode;
  name: string;
  onExit?: () => void;
}) {
  const windowRef = useRef<HTMLDivElement>(null);
  return (
    <div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-100 border-dark-color border-2 w-screen sm:min-w-[300px] sm:w-auto"
      ref={windowRef as React.RefObject<HTMLDivElement>}
    >
      <Header name={name} onExit={onExit} />
      {children}
    </div>
  );
}

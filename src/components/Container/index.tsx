import { ReactNode, useEffect, useRef, useState } from "react";
import Header from "./Header";
import Draggable, { ControlPosition } from "react-draggable";

export default function Container({
  children,
  name,
}: {
  children: ReactNode;
  name: string;
}) {
  const [position, setPosition] = useState<ControlPosition>({
    x: 0,
    y: 0,
  });
  const nodeRef = useRef<HTMLDivElement>(null);

  return (
    <Draggable
      handle=".draggable"
      defaultPosition={position}
      onStop={(_, data: ControlPosition) => {
        const { x, y } = data;
        setPosition({ x, y });
      }}
      nodeRef={nodeRef}
    >
      <div
        className="bg-gray-100 border-dark-color border-2 w-screen sm:min-w-[300px] sm:w-auto"
        ref={nodeRef}
      >
        <Header name={name} />
        {children}
      </div>
    </Draggable>
  );
}

import { ReactNode, useRef, useState, useEffect } from "react";
import Header from "./Header";

export default function WindowBox({
  children,
  name,
  onExit,
}: {
  children: ReactNode;
  name: string;
  onExit?: () => void;
}) {
  const WindowBoxRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 500,
    y: 200,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    if (position) {
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && position) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging, dragStart]);

  return (
    <div
      className="absolute bg-gray-100 border-dark-color border-2 w-screen sm:min-w-[300px] sm:w-auto"
      ref={WindowBoxRef}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? "grabbing" : "auto",
      }}
    >
      <div onMouseDown={handleMouseDown}>
        <Header name={name} onExit={onExit} />
      </div>
      {children}
    </div>
  );
}

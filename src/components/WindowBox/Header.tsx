import React from "react";

function Lines() {
  return (
    <div className="w-full mt-1">
      {[1, 2, 3].map((_, index) => (
        <div
          className="h-[7px] border-t-[1.5px] border-dark-color"
          key={index}
        />
      ))}
    </div>
  );
}

export default function Header({
  name,
  onExit,
  onMouseDown,
  onMouseUp,
}: {
  name: string;
  onExit?: () => void;
  onMouseDown?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseUp?: (e: React.MouseEvent<HTMLDivElement>) => void;
}) {
  return (
    <div
      className="flex justify-between"
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      <div className="border-b-[1.5px] border-dark-color w-full">
        <div className="flex mx-2 my-1">
          <Lines />
          <p className="px-2 text-center whitespace-nowrap">{name}</p>
          <Lines />
        </div>
      </div>
      {onExit && (
        <div
          className="border-l-[1.5px] border-dark-color border-b-[1.5px] flex justify-center"
          style={{ width: "50px" }}
        >
          <button onClick={onExit}>x</button>
        </div>
      )}
    </div>
  );
}

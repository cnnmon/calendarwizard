"use client";
import { useState, useEffect } from "react";

function getNewDate() {
  const date = new Date();
  const newDate = new Date(date.setFullYear(date.getFullYear() + 50));
  return newDate;
}

export default function Header() {
  const [date, setDate] = useState(getNewDate());

  useEffect(() => {
    setInterval(() => {
      setDate(getNewDate());
    }, 1000);
  }, []);

  return (
    <div className="absolute top-0 w-full h-8 justify-center bg-light-color border-b-[1.5px] border-dark-color flex items-center z-800">
      <p suppressHydrationWarning>
        {date.toDateString()} {date.toLocaleTimeString()}
      </p>
    </div>
  );
}

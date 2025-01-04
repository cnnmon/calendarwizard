import { ReactNode } from "react";
import Header from "./Header";

export default function Container({
  children,
  name,
}: {
  children: ReactNode;
  name: string;
}) {
  return (
    <div className="bg-gray-100 border-dark-color border-2 w-screen sm:min-w-[300px] sm:w-auto">
      <Header name={name} />
      {children}
    </div>
  );
}

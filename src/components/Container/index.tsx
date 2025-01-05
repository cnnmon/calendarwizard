import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Particles from "./Particles";

export default function Container({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen sm:items-center justify-center">
      <Header />
      <div className="sm:p-4">
        <Particles />
        {children}
      </div>
      <Footer />
    </main>
  );
}

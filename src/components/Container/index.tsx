import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Particles from "./Particles";

export default function Container({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen sm:items-center justify-center">
      <Header />
      <Particles />
      {children}
      <Footer />
    </main>
  );
}

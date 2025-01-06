import { GoogleOAuthProvider } from "@react-oauth/google";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "calendar wizard",
  description: "a temporal assistant that's like magic",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
        <body className={inter.className}>{children}</body>
      </GoogleOAuthProvider>
    </html>
  );
}

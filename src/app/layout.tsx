import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "./context/AppContext";

// Import Press Start 2P font for the retro game look
import { Press_Start_2P } from "next/font/google";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start-2p",
});

export const metadata: Metadata = {
  title: "Doable.AI - Your Productivity Companion",
  description: "A gamified productivity app to help you stay focused and achieve your goals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${pressStart2P.variable}`}>
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
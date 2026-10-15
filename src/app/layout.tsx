import type { Metadata } from "next";
import { Inter, Syncopate } from "next/font/google";
import "./globals.css";
import "./landing.css";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const syncopate = Syncopate({
  variable: "--font-heading",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "M47W-SURVIVOR",
  description: "A modern warships gaming community. Connect, Compete, Conquer, Survive.",
};

import { LiveDataProvider } from "../hooks/useLiveData";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${syncopate.variable}`}>
      <body>
        <LiveDataProvider>
          {children}
        </LiveDataProvider>
      </body>
    </html>
  );
}

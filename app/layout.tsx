import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Bricolage_Grotesque, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});
const body = Inter({ subsets: ["latin"], variable: "--font-body" });
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "AeroPulse Bike Studio — Find Your Way to Ride",
  description:
    "สตูดิโอจักรยานสมรรถนะสูง SSS-Tier พร้อมระบบ Smart Finder จับคู่จักรยานที่ใช่ให้คุณใน 7 คำถาม",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="th">
      <body
        className={`${display.variable} ${body.variable} ${mono.variable} font-body`}
      >
        {children}
      </body>
    </html>
  );
}

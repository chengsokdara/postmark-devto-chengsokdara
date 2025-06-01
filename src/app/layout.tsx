import type { Metadata } from "next";
import { Playwrite_HR_Lijeva } from "next/font/google";
import type { PropsWithChildren } from "react";
import "./globals.css";

const playwrite = Playwrite_HR_Lijeva({
  weight: "400",
  variable: "--font-playwrite",
});

export const metadata: Metadata = {
  title: "Postmark Email Parser",
  description: "by Cheng Sokdara",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html data-theme="black" lang="en">
      <body className={`${playwrite.variable}`}>{children}</body>
    </html>
  );
}

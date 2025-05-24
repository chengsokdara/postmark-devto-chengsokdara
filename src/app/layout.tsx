import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Postmark Email Parser",
  description: "by Cheng Sokdara",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html data-theme="black" lang="en">
      <body>{children}</body>
    </html>
  );
}

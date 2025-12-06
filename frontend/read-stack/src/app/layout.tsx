import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Read Stack",
  description: "A modern article publishing platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

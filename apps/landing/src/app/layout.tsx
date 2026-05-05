import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "lulu — match deeper, reveal later",
  description: "a dating app where you swipe on what people actually think — not the angle of their selfie. bangalore first. coming soon.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <body>{children}</body>
    </html>
  );
}

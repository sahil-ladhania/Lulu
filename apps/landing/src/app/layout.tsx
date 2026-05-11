import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "lulu. — match deeper, reveal later.",
  description: "coming soon. be first.",
  icons: {
    icon: "/branding/svg/lulu-mark-marigold.svg",
    apple: "/branding/png/lulu-mark-marigold.png",
    shortcut: "/branding/svg/lulu-mark-marigold.svg",
  },
  openGraph: {
    title: "lulu. — match deeper, reveal later.",
    description: "coming soon. be first.",
    url: "https://getluluapp.in",
    siteName: "lulu.",
    images: [
      {
        url: "https://getluluapp.in/og.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "lulu. — match deeper, reveal later.",
    description: "coming soon. be first.",
    images: ["https://getluluapp.in/og.png"],
  },
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

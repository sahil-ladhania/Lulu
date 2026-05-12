import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Reenie_Beanie } from 'next/font/google'
import "./globals.css";

const reenieBeanie = Reenie_Beanie({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-lulu-hand',
  display: 'swap',
})

const cabinetGrotesk = localFont({
  src: [
    {
      path: '../../public/fonts/CabinetGrotesk-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/CabinetGrotesk-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-cabinet-grotesk',
})

const switzer = localFont({
  src: [
    {
      path: '../../public/fonts/Switzer-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Switzer-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Switzer-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
  ],
  variable: '--font-switzer',
})

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
      <head>
        <link rel="preload" as="image" href="/splash-bg.jpg" />
      </head>
      <body className={`${reenieBeanie.variable} ${cabinetGrotesk.variable} ${switzer.variable}`}>
        {children}
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Cinzel, Inter } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Qamar E Bani Hashim (A.S.) | Sabeel-e-Imam Hussain (A.S.)",
  description:
    "Contribute towards Sabeel-e-Imam Hussain (A.S.). Serving in the name of Hussain (A.S.) — Muharram donation by Qamar E Bani Hashim.",
  keywords: [
    "Muharram",
    "Imam Hussain",
    "Sabeel",
    "Donation",
    "Qamar E Bani Hashim",
    "Hadiya",
  ],
  openGraph: {
    title: "Qamar E Bani Hashim (A.S.) | Sabeel Donation",
    description:
      "Contribute towards Sabeel-e-Imam Hussain (A.S.). Serving in the name of Hussain (A.S.)",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#050505",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cinzel.variable} ${inter.variable}`}>
      <body className="antialiased">
        {/* Full-screen Karbala background */}
        <div className="bg-karbala" aria-hidden="true" />
        <div className="bg-grain" aria-hidden="true" />

        {/* Main content */}
        <main className="relative z-10 min-h-dvh">{children}</main>
      </body>
    </html>
  );
}

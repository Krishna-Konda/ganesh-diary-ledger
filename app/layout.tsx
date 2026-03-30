import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shree Ganesh Dairy Ledger",
  description:
    "A mobile-first dairy management and customer ledger app to track milk entries, manage customers, monitor payments, and simplify daily operations.",

  keywords: [
    "dairy management app",
    "milk ledger",
    "customer management",
    "dairy business software",
    "ganesh dairy",
    "milk tracking app",
    "ledger app",
  ],

  authors: [{ name: "Krishna Konda" }],

  creator: "Krishna Konda",

  metadataBase: new URL("https://ganesh-diary-ledger.vercel.app/login"), // replace later

  openGraph: {
    title: "Shree Ganesh Dairy Ledger",
    description:
      "Manage your dairy business efficiently with customer tracking, payment monitoring, and daily milk entries.",
    url: "https://ganesh-diary-ledger.vercel.app/login",
    siteName: "Shree Ganesh Dairy Ledger",
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Shree Ganesh Dairy Ledger",
    description:
      "A simple and powerful dairy ledger app for managing customers, payments, and milk entries.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

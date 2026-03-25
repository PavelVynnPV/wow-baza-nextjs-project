import type { Metadata } from "next";
import { Inter, New_Rocker } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "600", "700"],
});
const newRocker = New_Rocker({
  subsets: ["latin"],
  variable: "--font-new-rocker",
  weight: ["400"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://localhost:3000"),
   title: {
    default: "WOW Baza — Buy WoW Gold, Accounts & Boosting",
    template: "%s | WOW Baza",
  },
  description:
    "Buy World of Warcraft gold, accounts, boosting and in-game items. Fast delivery, safe transactions, best prices for Horde and Alliance.",
  keywords: [
    "wow gold",
    "world of warcraft gold",
    "buy wow account",
    "wow boosting",
    "wow items",
    "horde gold",
    "alliance gold",
    "wow carry",
  ],
  openGraph: {
    title: "WOW Baza — Buy WoW Gold, Accounts & Boosting",
    description:
      "Buy World of Warcraft gold, accounts, boosting and in-game items. Fast delivery, safe transactions, best prices.",
    url: "https://localhost:3000",
    siteName: "WOW Baza",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "WOW Baza",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WOW Baza — Buy WoW Gold, Accounts & Boosting",
    description:
      "Buy World of Warcraft gold, accounts, boosting and in-game items. Fast delivery, safe transactions.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${newRocker.variable}`}>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
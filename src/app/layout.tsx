import type { Metadata } from "next";
import { Fraunces, Instrument_Sans } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://fantomes-henna-psi.vercel.app"),
  title: "Fantômes – Débusque les abonnements que tu paies sans t'en servir",
  description:
    "Dépose ton relevé bancaire : on repère les prélèvements oubliés, et on t'écrit la lettre pour les résilier.",
  openGraph: {
    title: "Fantômes – Débusque les abonnements oubliés",
    description:
      "Dépose ton relevé bancaire : on repère les prélèvements oubliés et on t'écrit les lettres de résiliation.",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${instrument.variable}`}>
      <body>{children}</body>
    </html>
  );
}

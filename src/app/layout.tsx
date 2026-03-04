import React, { Suspense } from "react";
import type { Metadata } from "next";
import { StackProvider, StackTheme } from "@stackframe/stack";
import localFont from "next/font/local";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { stackServerApp } from "../stack/server";
import { cn } from "@/lib/utils";

const cinzel = localFont({
  src: "../../public/fonts/Cinzel-latin-normal-400900.woff2",
  variable: "--font-cinzel",
  display: "swap",
  weight: "400 900",
});

const playfair = localFont({
  src: "../../public/fonts/PlayfairDisplay-latin-normal-400900.woff2",
  variable: "--font-playfair",
  display: "swap",
  weight: "400 900",
});

const lato = localFont({
  src: [
    { path: "../../public/fonts/Lato-latin-normal-100.woff2", weight: "100", style: "normal" },
    { path: "../../public/fonts/Lato-latin-normal-300.woff2", weight: "300", style: "normal" },
    { path: "../../public/fonts/Lato-latin-normal-400.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/Lato-latin-normal-700.woff2", weight: "700", style: "normal" },
    { path: "../../public/fonts/Lato-latin-normal-900.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-lato",
  display: "swap",
});

import { SITE_CONFIG } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: `${SITE_CONFIG.name} | BIT Mesra`,
    template: `%s | ${SITE_CONFIG.name}`
  },
  description: SITE_CONFIG.description,
  keywords: SITE_CONFIG.keywords,
  authors: [{ name: "Bitotsav Team" }],
  creator: "Bitotsav Team",
  publisher: "BIT Mesra",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: `${SITE_CONFIG.name} | BIT Mesra`,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: SITE_CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: SITE_CONFIG.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_CONFIG.name} | BIT Mesra`,
    description: SITE_CONFIG.description,
    creator: '@bitotsav',
    images: [SITE_CONFIG.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.png',
  },
};

const customTheme = {
  dark: {
    primary: "#ffffff",
    background: "#000000",
    surface: "#0a0a0a",
    border: "#1a1a1a",
  },
  radius: "0px",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          cinzel.variable,
          playfair.variable,
          lato.variable,
          "antialiased bg-black text-white selection:bg-white selection:text-black overflow-x-hidden font-mono"
        )}
      >
        <StackProvider app={stackServerApp}>
          <StackTheme theme={customTheme}>
          

            <Suspense fallback={null}>
              <Navbar />
            </Suspense>
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
          </StackTheme>
        </StackProvider>
      </body>
    </html>
  );
}

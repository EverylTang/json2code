import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n/I18nProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProviderWrapper } from "@/components/ThemeProvider";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://codetools.cc"),
  title: "CodeTools - Free Online Developer Tools",
  description: "Free online developer tools: Base64, JSON formatter, hash generator, UUID, QR code, currency converter, password generator, and more. All client-side, no data leaves your browser.",
  keywords: [
    "developer tools",
    "online tools",
    "base64",
    "json formatter",
    "hash generator",
    "uuid generator",
    "qr code generator",
    "currency converter",
    "password generator",
    "developer toolbox",
  ],
  openGraph: {
    title: "CodeTools - Free Online Developer Tools",
    description: "18+ free online developer tools. Format JSON, generate hashes, create QR codes, convert currencies, test regex, and more. All in your browser.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CodeTools - Free Online Developer Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeTools - Free Online Developer Tools",
    description: "18+ free online developer tools. All client-side, no server upload.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3864848447623769"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`min-h-full flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 ${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProviderWrapper>
          <I18nProvider>
            <Header />
            <main className="flex-1 flex flex-col">{children}</main>
            <Footer />
            <Analytics />
          </I18nProvider>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
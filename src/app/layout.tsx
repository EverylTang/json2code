import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n/I18nProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProviderWrapper } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JSON2Code - Convert JSON to TypeScript, Go, Python, Java, Rust, C#, Swift & Kotlin",
  description: "Free online tool to convert JSON into TypeScript interfaces, Go structs, Python dataclasses, Java classes, Rust structs, C# classes, Swift structs, and Kotlin data classes. Fast, accurate, no sign-up required.",
  keywords: [
    "json to typescript",
    "json to go struct",
    "json to python dataclass",
    "json to java class",
    "json to rust struct",
    "json to csharp class",
    "json to swift struct",
    "json to kotlin data class",
    "json converter",
    "type generator",
    "JSON 转 TypeScript",
    "JSON 转 Go",
    "JSON 转 Java",
  ],
  openGraph: {
    title: "JSON2Code - Convert JSON to 8 Programming Languages",
    description: "Paste JSON and instantly generate code in TypeScript, Go, Python, Java, Rust, C#, Swift, and Kotlin. Free developer tool with i18n support.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "JSON2Code - JSON to Code Converter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON2Code - JSON to 8 Languages Converter",
    description: "Convert JSON to TypeScript, Go, Python, Java, Rust, C#, Swift & Kotlin instantly. Free tool, no signup.",
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
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <ThemeProviderWrapper>
          <I18nProvider>
            <Header />
            <main className="flex-1 flex flex-col">{children}</main>
            <Footer />
          </I18nProvider>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
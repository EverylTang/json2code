import Link from "next/link";

export const metadata = {
  title: "Privacy Policy - CodeTools",
  description: "CodeTools privacy policy. Learn how our browser-based developer tools process data and how analytics and advertising may be used.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy - CodeTools",
    description: "How CodeTools handles privacy, browser-side processing, analytics, and advertising.",
    url: "/privacy",
    siteName: "CodeTools",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "CodeTools Privacy Policy" }],
  },
  twitter: { card: "summary_large_image", title: "Privacy Policy - CodeTools", description: "How CodeTools handles privacy and browser-side processing.", images: ["/og-image.png"] },
};

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto w-full px-4 py-10 text-sm leading-7 text-gray-600 dark:text-gray-400">
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2"><Link href="/" className="hover:text-blue-500">Home</Link> / Privacy</p>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">Privacy Policy</h1>
      <p className="mb-6">Last updated: June 21, 2026</p>

      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-6 mb-2">Browser-side processing</h2>
      <p>Most CodeTools utilities process your input directly in your browser. For tools such as JSON formatting, Base64 encoding, hashing, UUID generation, timestamp conversion, and text conversion, your data is not intentionally uploaded to CodeTools servers.</p>

      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-6 mb-2">Server-side features</h2>
      <p>Some features may require network requests, such as webhook testing, exchange-rate lookup, analytics, advertising, or future API endpoints. When a tool needs server-side functionality, data may be transmitted as necessary to provide that feature.</p>

      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-6 mb-2">Analytics and advertising</h2>
      <p>CodeTools may use privacy-conscious analytics and Google AdSense to understand site usage and support free access. Third-party services may use cookies or similar technologies according to their own policies.</p>

      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-6 mb-2">Data retention</h2>
      <p>CodeTools does not require user accounts for the web tools and does not intentionally store the content you paste into client-side tools. Server logs, analytics events, and abuse-prevention data may be retained by hosting or third-party providers.</p>

      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-6 mb-2">Contact</h2>
      <p>If you have privacy questions, please contact us through the <Link href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">contact page</Link>.</p>
    </main>
  );
}

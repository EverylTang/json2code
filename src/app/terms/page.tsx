import Link from "next/link";

export const metadata = {
  title: "Terms of Use - CodeTools",
  description: "Terms of use for CodeTools free online developer tools.",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "Terms of Use - CodeTools",
    description: "Terms for using CodeTools free online developer tools.",
    url: "/terms",
    siteName: "CodeTools",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "CodeTools Terms" }],
  },
  twitter: { card: "summary_large_image", title: "Terms of Use - CodeTools", description: "Terms for using CodeTools developer tools.", images: ["/og-image.png"] },
};

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto w-full px-4 py-10 text-sm leading-7 text-gray-600 dark:text-gray-400">
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2"><Link href="/" className="hover:text-blue-500">Home</Link> / Terms</p>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">Terms of Use</h1>
      <p className="mb-6">Last updated: June 21, 2026</p>

      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-6 mb-2">Use of the service</h2>
      <p>CodeTools provides free online developer utilities for convenience. You are responsible for how you use the tools and for verifying outputs before using them in production systems.</p>

      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-6 mb-2">No warranty</h2>
      <p>The service is provided “as is” without warranties of any kind. We do not guarantee that every tool will be error-free, uninterrupted, or suitable for every use case.</p>

      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-6 mb-2">Acceptable use</h2>
      <p>You agree not to abuse, overload, reverse engineer, attack, or interfere with the service. Automated use may be rate limited or blocked to protect availability.</p>

      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-6 mb-2">Third-party services</h2>
      <p>CodeTools may use third-party hosting, analytics, advertising, or API providers. Their services are governed by their own terms and policies.</p>

      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-6 mb-2">Contact</h2>
      <p>Questions about these terms can be sent through the <Link href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">contact page</Link>.</p>
    </main>
  );
}

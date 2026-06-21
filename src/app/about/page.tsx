import Link from "next/link";

export const metadata = {
  title: "About CodeTools - Free Online Developer Tools",
  description: "Learn about CodeTools, a privacy-first collection of free online developer tools for JSON, Base64, hashes, UUIDs, QR codes, timestamps, and more.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About CodeTools",
    description: "Privacy-first free online developer tools that run in your browser.",
    url: "/about",
    siteName: "CodeTools",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "CodeTools" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About CodeTools",
    description: "Privacy-first free online developer tools that run in your browser.",
    images: ["/og-image.png"],
  },
};

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto w-full px-4 py-10">
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2"><Link href="/" className="hover:text-blue-500">Home</Link> / About</p>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">About CodeTools</h1>
      <p className="mt-3 text-gray-600 dark:text-gray-400 leading-relaxed">
        CodeTools is a free online toolbox for developers, makers, and technical teams. It provides fast utilities for formatting JSON, encoding Base64, generating hashes, creating UUIDs, testing regular expressions, converting timestamps, debugging payment workflows, and more.
      </p>

      <section className="mt-8 space-y-6 text-sm leading-7 text-gray-600 dark:text-gray-400">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Our principles</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Privacy first:</strong> most tools run entirely in your browser, so your input is not uploaded to our servers.</li>
            <li><strong>Fast and simple:</strong> tools are designed to open quickly and solve one job clearly.</li>
            <li><strong>No signup required:</strong> the web tools are available for free without creating an account.</li>
            <li><strong>Developer focused:</strong> every tool is built around common daily engineering workflows.</li>
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Contact</h2>
          <p>For feedback, bug reports, or partnership requests, visit the <Link href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">contact page</Link>.</p>
        </div>
      </section>
    </main>
  );
}

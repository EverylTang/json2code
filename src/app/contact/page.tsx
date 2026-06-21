import Link from "next/link";

export const metadata = {
  title: "Contact - CodeTools",
  description: "Contact CodeTools for feedback, bug reports, feature requests, partnerships, and privacy questions.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact CodeTools",
    description: "Send feedback, bug reports, and feature requests for CodeTools.",
    url: "/contact",
    siteName: "CodeTools",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Contact CodeTools" }],
  },
  twitter: { card: "summary_large_image", title: "Contact CodeTools", description: "Send feedback and feature requests for CodeTools.", images: ["/og-image.png"] },
};

export default function ContactPage() {
  return (
    <main className="max-w-3xl mx-auto w-full px-4 py-10 text-sm leading-7 text-gray-600 dark:text-gray-400">
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2"><Link href="/" className="hover:text-blue-500">Home</Link> / Contact</p>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">Contact CodeTools</h1>
      <p className="mb-6">We welcome feedback, bug reports, feature requests, partnership questions, and privacy inquiries.</p>

      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Email</h2>
        <p>You can contact the project owner at:</p>
        <p className="mt-2"><a href="mailto:contact@codetools.cc" className="text-blue-600 dark:text-blue-400 hover:underline">contact@codetools.cc</a></p>
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">GitHub</h2>
        <p>For technical issues, you can also open an issue on GitHub:</p>
        <p className="mt-2"><a href="https://github.com/EverylTang/codetools" className="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noreferrer">github.com/EverylTang/codetools</a></p>
      </div>
    </main>
  );
}

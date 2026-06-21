"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nProvider";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 px-4 py-4 text-center text-[10px] text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-900">
      <div>{t.footer}</div>
      <nav className="mt-2 flex items-center justify-center gap-3">
        <Link href="/about" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">About</Link>
        <Link href="/privacy" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Privacy</Link>
        <Link href="/terms" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Terms</Link>
        <Link href="/contact" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Contact</Link>
      </nav>
    </footer>
  );
}

"use client";

import { useI18n } from "@/lib/i18n/I18nProvider";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const { t, locale, setLocale } = useI18n();

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 px-4 py-3 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
            J2C
          </div>
          <div>
            <h1 className="text-sm font-semibold">{t.title}</h1>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 hidden sm:block">
              {t.subtitle}
            </p>
          </div>
        </div>
        <nav className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <ThemeToggle />
          <button
            onClick={() => setLocale(locale === "zh" ? "en" : "zh")}
            className="px-2 py-1 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            title={locale === "zh" ? "切换为英文" : "Switch to Chinese"}
          >
            {locale === "zh" ? "EN" : "中"}
          </button>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors hidden sm:inline"
          >
            {t.github}
          </a>
        </nav>
      </div>
    </header>
  );
}

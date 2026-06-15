"use client";

import { useI18n } from "@/lib/i18n/I18nProvider";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 px-4 py-2 text-center text-[10px] text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-900">
      {t.footer}
    </footer>
  );
}

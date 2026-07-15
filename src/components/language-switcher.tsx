"use client";

import { usePathname, useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <div className="flex items-center gap-2 border-l border-slate-200 pl-4 ml-4">
      <span className="text-sm font-medium text-slate-500">Language:</span>
      <select 
        value={locale} 
        onChange={handleLanguageChange}
        className="h-8 px-2 rounded-md border border-slate-300 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
      >
        <option value="en">🇺🇸 English</option>
        <option value="es">🇪🇸 Español</option>
        <option value="pt">🇧🇷 Português</option>
      </select>
    </div>
  );
}

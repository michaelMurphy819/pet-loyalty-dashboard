"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Card } from "@/components/ui/card";
import { useTranslations } from "next-intl";

interface DashboardFiltersProps {
  availableSpecies: string[];
  availableYears: string[];
}

export function DashboardFilters({ availableSpecies, availableYears }: DashboardFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("Dashboard");
  const tReporting = useTranslations("Dashboard.reporting");

  const currentInterval = searchParams.get("interval") || "daily";
  const currentSpecies = searchParams.get("species") || "all";
  const currentYear = searchParams.get("year") || "all";

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "all" || (value === "daily" && name === "interval")) {
        params.delete(name);
      } else {
        params.set(name, value);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleFilterChange = (name: string, value: string) => {
    const qs = createQueryString(name, value);
    router.push(pathname + (qs ? `?${qs}` : ""), { scroll: false });
  };

  const handleClearAll = () => {
    router.push(pathname, { scroll: false });
  };

  const displayYear = currentYear === "all" ? t("filters.allTime").toLowerCase() : currentYear;
  const displaySpecies = currentSpecies === "all" ? t("filters.allSpecies").toLowerCase() : currentSpecies;
  const displayInterval = t(`filters.${currentInterval}` as any).toLowerCase();

  const plainEnglishSummary = tReporting("plainEnglish", {
    year: displayYear,
    species: displaySpecies,
    interval: displayInterval
  });

  const hasFilters = currentInterval !== "daily" || currentSpecies !== "all" || currentYear !== "all";

  return (
    <Card className="flex flex-col shadow-sm border-slate-200 bg-slate-50/50">
      <div className="px-5 py-3 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/50 rounded-t-lg">
        <p className="text-sm font-medium text-slate-700 italic">
          {plainEnglishSummary}
        </p>
        {hasFilters && (
          <button 
            onClick={handleClearAll}
            className="text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-md transition-colors"
          >
            {tReporting("clearAll")}
          </button>
        )}
      </div>

      <div className="p-4 flex flex-col sm:flex-row gap-4 items-end">
        <div className="flex flex-col gap-1.5 w-full sm:w-auto">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t("filters.interval")}</label>
          <select 
            value={currentInterval}
            onChange={(e) => handleFilterChange("interval", e.target.value)}
            className="h-10 px-3 rounded-md border border-slate-300 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-[150px]"
          >
            <option value="daily">{t("filters.daily")}</option>
            <option value="weekly">{t("filters.weekly")}</option>
            <option value="monthly">{t("filters.monthly")}</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5 w-full sm:w-auto">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t("filters.species")}</label>
          <select 
            value={currentSpecies}
            onChange={(e) => handleFilterChange("species", e.target.value)}
            className="h-10 px-3 rounded-md border border-slate-300 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-[180px] capitalize"
          >
            <option value="all">{t("filters.allSpecies")}</option>
            {availableSpecies.map(s => (
              <option key={s} value={s} className="capitalize">{s}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5 w-full sm:w-auto">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t("filters.year")}</label>
          <select 
            value={currentYear}
            onChange={(e) => handleFilterChange("year", e.target.value)}
            className="h-10 px-3 rounded-md border border-slate-300 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-[150px]"
          >
            <option value="all">{t("filters.allTime")}</option>
            {availableYears.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>
    </Card>
  );
}

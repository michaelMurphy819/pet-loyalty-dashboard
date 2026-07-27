"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Card } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { Filter, XCircle } from "lucide-react";

interface DashboardFiltersProps {
  availableSpecies: string[];
  availableYears: string[];
  availablePlatforms?: string[];
}

export function DashboardFilters({ availableSpecies, availableYears, availablePlatforms = [] }: DashboardFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("Dashboard");
  const tReporting = useTranslations("Dashboard.reporting");

  const currentInterval = searchParams.get("interval") || "daily";
  const currentSpecies = searchParams.get("species") || "all";
  const currentYear = searchParams.get("year") || "all";
  const currentPlatform = searchParams.get("platform") || "all";

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
  const displayPlatform = currentPlatform === "all" ? "all platforms" : currentPlatform;
  const displayInterval = t(`filters.${currentInterval}` as any).toLowerCase();

  const plainEnglishSummary = tReporting("plainEnglish", {
    year: displayYear,
    species: displaySpecies,
    interval: displayInterval
  }) + (currentPlatform !== "all" ? ` on ${currentPlatform}` : "");

  const hasFilters = currentInterval !== "daily" || currentSpecies !== "all" || currentYear !== "all" || currentPlatform !== "all";

  return (
    <Card className="flex flex-col shadow-sm border border-slate-200/80 bg-white rounded-2xl overflow-hidden transition-all hover:shadow-md">
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700 font-bold shadow-2xs shrink-0">
            <Filter className="w-4 h-4" />
          </div>
          <p className="text-xs font-semibold text-slate-700 truncate">
            <span className="text-slate-400 font-normal mr-1">Active View:</span>
            {plainEnglishSummary}
          </p>
        </div>
        {hasFilters && (
          <button 
            onClick={handleClearAll}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1 rounded-lg transition-colors border border-rose-200/80 shadow-2xs shrink-0"
          >
            <XCircle className="w-3.5 h-3.5" />
            {tReporting("clearAll")}
          </button>
        )}
      </div>

      <div className="p-4 px-5 flex flex-wrap gap-4 items-center bg-white">
        <div className="flex flex-col gap-1 w-full sm:w-auto">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t("filters.interval")}</label>
          <select 
            value={currentInterval}
            onChange={(e) => handleFilterChange("interval", e.target.value)}
            className="h-9.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50/80 text-xs font-bold text-slate-800 shadow-2xs hover:bg-slate-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors w-full sm:w-[150px] cursor-pointer"
          >
            <option value="daily">{t("filters.daily")}</option>
            <option value="weekly">{t("filters.weekly")}</option>
            <option value="monthly">{t("filters.monthly")}</option>
          </select>
        </div>

        <div className="flex flex-col gap-1 w-full sm:w-auto">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t("filters.species")}</label>
          <select 
            value={currentSpecies}
            onChange={(e) => handleFilterChange("species", e.target.value)}
            className="h-9.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50/80 text-xs font-bold text-slate-800 shadow-2xs hover:bg-slate-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors w-full sm:w-[170px] capitalize cursor-pointer"
          >
            <option value="all">{t("filters.allSpecies")}</option>
            {availableSpecies.map(s => (
              <option key={s} value={s} className="capitalize">{s}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1 w-full sm:w-auto">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t("filters.year")}</label>
          <select 
            value={currentYear}
            onChange={(e) => handleFilterChange("year", e.target.value)}
            className="h-9.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50/80 text-xs font-bold text-slate-800 shadow-2xs hover:bg-slate-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors w-full sm:w-[140px] cursor-pointer"
          >
            <option value="all">{t("filters.allTime")}</option>
            {availableYears.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {availablePlatforms.length > 0 && (
          <div className="flex flex-col gap-1 w-full sm:w-auto">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Platform</label>
            <select 
              value={currentPlatform}
              onChange={(e) => handleFilterChange("platform", e.target.value)}
              className="h-9.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50/80 text-xs font-bold text-slate-800 shadow-2xs hover:bg-slate-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors w-full sm:w-[160px] capitalize cursor-pointer"
            >
              <option value="all">All Platforms</option>
              {availablePlatforms.map(p => (
                <option key={p} value={p} className="capitalize">{p}</option>
              ))}
            </select>
          </div>
        )}
      </div>
    </Card>
  );
}

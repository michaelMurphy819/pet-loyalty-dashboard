"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Filter, X, Trash2, MapPin, Building2, PawPrint, Monitor, Calendar, Tag } from "lucide-react";
import { useEffect, useState, Suspense } from "react";

function ActiveFiltersPopupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !searchParams) return null;

  const species = searchParams.get("species");
  const platform = searchParams.get("platform");
  const city = searchParams.get("city");
  const shelter = searchParams.get("shelter");
  const year = searchParams.get("year");
  const breed = searchParams.get("breed");

  const hasActiveFilters = Boolean(species || platform || city || shelter || breed || (year && year !== "all"));

  if (!hasActiveFilters) return null;

  const clearFilter = (key: string) => {
    const current = new URLSearchParams(searchParams.toString());
    current.delete(key);
    router.push(`${pathname}?${current.toString()}`, { scroll: false });
  };

  const clearAllFilters = () => {
    const current = new URLSearchParams(searchParams.toString());
    current.delete("species");
    current.delete("platform");
    current.delete("city");
    current.delete("shelter");
    current.delete("year");
    current.delete("breed");
    router.push(`${pathname}?${current.toString()}`, { scroll: false });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200 max-w-md w-full md:w-auto shadow-2xl">
      <div className="bg-white border border-slate-200/90 text-slate-800 rounded-2xl p-4 md:p-5 shadow-xl ring-1 ring-slate-900/5 transition-all">
        <div className="flex items-center justify-between gap-6 border-b border-slate-100 pb-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-2xs">
              <Filter className="w-4 h-4" />
            </div>
            <span className="text-sm md:text-base font-extrabold tracking-tight text-slate-900">
              Active Analytical Filters
            </span>
          </div>
          <button
            onClick={clearAllFilters}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1.5 rounded-lg transition-colors border border-rose-200 shadow-2xs"
            title="Reset all filters"
          >
            <Trash2 className="w-3.5 h-3.5 shrink-0" />
            Clear All
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Current filter slice:
          </p>
          <div className="flex flex-wrap gap-2">
            {shelter && (
              <span className="inline-flex items-center gap-1.5 text-xs bg-amber-50 border border-amber-200 text-amber-950 font-bold px-3 py-1.5 rounded-xl shadow-2xs">
                <Building2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="truncate max-w-[170px]">{shelter}</span>
                <button
                  onClick={() => clearFilter("shelter")}
                  className="hover:bg-amber-200/70 text-amber-700 hover:text-amber-950 p-0.5 rounded-md transition-colors ml-0.5"
                  title="Remove shelter filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {city && (
              <span className="inline-flex items-center gap-1.5 text-xs bg-emerald-50 border border-emerald-200 text-emerald-950 font-bold px-3 py-1.5 rounded-xl shadow-2xs">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate max-w-[150px]">{city}</span>
                <button
                  onClick={() => clearFilter("city")}
                  className="hover:bg-emerald-200/70 text-emerald-700 hover:text-emerald-950 p-0.5 rounded-md transition-colors ml-0.5"
                  title="Remove city filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {species && (
              <span className="inline-flex items-center gap-1.5 text-xs bg-indigo-50 border border-indigo-200 text-indigo-950 font-bold px-3 py-1.5 rounded-xl shadow-2xs">
                <PawPrint className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span className="truncate max-w-[140px] capitalize">{species}</span>
                <button
                  onClick={() => clearFilter("species")}
                  className="hover:bg-indigo-200/70 text-indigo-700 hover:text-indigo-950 p-0.5 rounded-md transition-colors ml-0.5"
                  title="Remove species filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {breed && (
              <span className="inline-flex items-center gap-1.5 text-xs bg-sky-50 border border-sky-200 text-sky-950 font-bold px-3 py-1.5 rounded-xl shadow-2xs">
                <Tag className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span className="truncate max-w-[150px]">{breed}</span>
                <button
                  onClick={() => clearFilter("breed")}
                  className="hover:bg-sky-200/70 text-sky-700 hover:text-sky-950 p-0.5 rounded-md transition-colors ml-0.5"
                  title="Remove breed filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {platform && (
              <span className="inline-flex items-center gap-1.5 text-xs bg-purple-50 border border-purple-200 text-purple-950 font-bold px-3 py-1.5 rounded-xl shadow-2xs">
                <Monitor className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span className="truncate max-w-[140px] capitalize">{platform}</span>
                <button
                  onClick={() => clearFilter("platform")}
                  className="hover:bg-purple-200/70 text-purple-700 hover:text-purple-950 p-0.5 rounded-md transition-colors ml-0.5"
                  title="Remove platform filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {year && year !== "all" && (
              <span className="inline-flex items-center gap-1.5 text-xs bg-slate-100 border border-slate-200 text-slate-900 font-bold px-3 py-1.5 rounded-xl shadow-2xs">
                <Calendar className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                <span>Year: {year}</span>
                <button
                  onClick={() => clearFilter("year")}
                  className="hover:bg-slate-200 text-slate-600 hover:text-slate-900 p-0.5 rounded-md transition-colors ml-0.5"
                  title="Remove year filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ActiveFiltersPopup() {
  return (
    <Suspense fallback={null}>
      <ActiveFiltersPopupContent />
    </Suspense>
  );
}

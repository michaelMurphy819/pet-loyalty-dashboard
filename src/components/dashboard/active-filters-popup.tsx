"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Filter, X, Trash2, MapPin, Building2, PawPrint, Monitor, Calendar } from "lucide-react";
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

  // Only pops up if any filter is explicitly active. If showing "any shelter" / defaults, nothing appears.
  const hasActiveFilters = Boolean(species || platform || city || shelter || (year && year !== "all"));

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
    router.push(`${pathname}?${current.toString()}`, { scroll: false });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300 max-w-sm w-full md:w-auto shadow-2xl">
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-white rounded-2xl p-4 shadow-xl ring-1 ring-indigo-500/30">
        <div className="flex items-center justify-between gap-4 border-b border-slate-700/60 pb-2.5 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Filter className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold tracking-wide text-slate-100">
              Active Filters
            </span>
          </div>
          <button
            onClick={clearAllFilters}
            className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-rose-400 font-semibold transition-colors bg-slate-800/80 hover:bg-slate-800 px-2 py-1 rounded-md"
            title="Reset all filters"
          >
            <Trash2 className="w-3 h-3" />
            Clear All
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
            Viewing adoptions from:
          </p>
          <div className="flex flex-wrap gap-2">
            {shelter && (
              <span className="inline-flex items-center gap-1.5 text-xs bg-indigo-950/80 border border-indigo-700/60 text-indigo-200 font-medium px-2.5 py-1 rounded-lg shadow-sm">
                <Building2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="truncate max-w-[160px]">{shelter}</span>
                <button
                  onClick={() => clearFilter("shelter")}
                  className="hover:bg-indigo-800/60 p-0.5 rounded transition-colors text-indigo-300 hover:text-white ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {city && (
              <span className="inline-flex items-center gap-1.5 text-xs bg-emerald-950/80 border border-emerald-700/60 text-emerald-200 font-medium px-2.5 py-1 rounded-lg shadow-sm">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{city}</span>
                <button
                  onClick={() => clearFilter("city")}
                  className="hover:bg-emerald-800/60 p-0.5 rounded transition-colors text-emerald-300 hover:text-white ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {species && (
              <span className="inline-flex items-center gap-1.5 text-xs bg-purple-950/80 border border-purple-700/60 text-purple-200 font-medium px-2.5 py-1 rounded-lg shadow-sm">
                <PawPrint className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>{species}</span>
                <button
                  onClick={() => clearFilter("species")}
                  className="hover:bg-purple-800/60 p-0.5 rounded transition-colors text-purple-300 hover:text-white ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {platform && (
              <span className="inline-flex items-center gap-1.5 text-xs bg-sky-950/80 border border-sky-700/60 text-sky-200 font-medium px-2.5 py-1 rounded-lg shadow-sm">
                <Monitor className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>{platform}</span>
                <button
                  onClick={() => clearFilter("platform")}
                  className="hover:bg-sky-800/60 p-0.5 rounded transition-colors text-sky-300 hover:text-white ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {year && year !== "all" && (
              <span className="inline-flex items-center gap-1.5 text-xs bg-amber-950/80 border border-amber-700/60 text-amber-200 font-medium px-2.5 py-1 rounded-lg shadow-sm">
                <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Year: {year}</span>
                <button
                  onClick={() => clearFilter("year")}
                  className="hover:bg-amber-800/60 p-0.5 rounded transition-colors text-amber-300 hover:text-white ml-0.5"
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

"use client";

import { useState, useEffect, useRef } from "react";
import { Search, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { searchLocations } from "@/actions/search";

interface SearchResult {
  city: string | null;
  stateCode: string | null;
  countryCode: string | null;
  totalAdoptions: string | number;
}

export function GlobalSearch() {
  const t = useTranslations("Dashboard.nav");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 2) {
        setIsLoading(true);
        const data = await searchLocations(query);
        setResults(data as SearchResult[]);
        setIsLoading(false);
        setIsOpen(true);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (result: SearchResult) => {
    setIsOpen(false);
    setQuery("");
    
    // Route to the country dashboard
    if (result.countryCode) {
      router.push(`/dashboard/map/${result.countryCode.toLowerCase()}`);
    } else {
      router.push(`/dashboard/map`);
    }
  };

  return (
    <div className="relative hidden lg:flex items-center w-64" ref={wrapperRef}>
      <Search className="absolute left-3 h-4 w-4 text-slate-400" />
      <input 
        type="text" 
        placeholder={t("searchPlaceholder")}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => { if (results.length > 0) setIsOpen(true); }}
        className="h-9 w-full pl-9 pr-4 rounded-full border border-slate-300 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
      />
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 overflow-hidden">
          {isLoading ? (
            <div className="px-4 py-3 text-sm text-slate-500 text-center">Searching...</div>
          ) : results.length === 0 ? (
            <div className="px-4 py-3 text-sm text-slate-500 text-center">No locations found.</div>
          ) : (
            results.map((result, i) => (
              <button
                key={i}
                onClick={() => handleSelect(result)}
                className="w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors flex items-center justify-between group border-b border-slate-50 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                    <MapPin className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-900">
                      {result.city ? `${result.city}, ${result.stateCode}` : result.countryCode}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {result.countryCode} • {Number(result.totalAdoptions).toLocaleString()} Adoptions
                    </span>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

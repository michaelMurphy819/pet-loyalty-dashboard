"use client";

import React, { useState, useMemo } from "react";
import { Search, MapPin, Building2, ExternalLink } from "lucide-react";
import { Link } from "@/i18n/routing";

interface DirectoryTableProps {
  data: any[];
  type: "cities" | "organizations";
  translations: Record<string, string>;
}

export const DirectoryTable = React.memo(function DirectoryTable({ data, type, translations: t }: DirectoryTableProps) {
  const [search, setSearch] = useState("");

  const filteredData = useMemo(() => {
    return data.filter(row => {
      if (!search) return true;
      const searchTerms = search.toLowerCase().split(' ').filter(Boolean);
      const searchableString = type === "cities" 
        ? [row.city, row.state, row.country].filter(Boolean).join(' ').toLowerCase()
        : [row.organizationName].filter(Boolean).join(' ').toLowerCase();
      
      return searchTerms.every(term => searchableString.includes(term));
    });
  }, [data, search, type]);

  return (
    <div className="w-full flex flex-col bg-white rounded-2xl overflow-hidden">
      {/* Search and Control Header */}
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder={type === "cities" ? "Search by city, state, or country..." : "Search for a partner shelter or organization..."}
            className="w-full pl-10 pr-4 py-2 border border-slate-200/80 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-2xs transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="text-xs font-semibold text-slate-500">
          Showing <span className="text-slate-800 font-extrabold">{Math.min(filteredData.length, 100)}</span> of <span className="text-slate-800 font-extrabold">{filteredData.length}</span> entries
        </div>
      </div>

      {/* Structured Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50 border-b border-slate-200/80">
            {type === "cities" ? (
              <tr>
                <th className="px-6 py-3.5 font-extrabold">Rank & {t.city}</th>
                <th className="px-6 py-3.5 font-extrabold">{t.state}</th>
                <th className="px-6 py-3.5 font-extrabold">{t.country}</th>
                <th className="px-6 py-3.5 font-extrabold text-right">{t.totalAdoptions}</th>
                <th className="px-6 py-3.5 font-extrabold text-right">{t.latestAdoption}</th>
              </tr>
            ) : (
              <tr>
                <th className="px-6 py-3.5 font-extrabold">Rank & Organization Name</th>
                <th className="px-6 py-3.5 font-extrabold text-right">{t.totalAdoptions}</th>
                <th className="px-6 py-3.5 font-extrabold text-right">{t.latestAdoption}</th>
              </tr>
            )}
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white font-medium">
            {filteredData.slice(0, 100).map((row, i) => {
              const rank = i + 1;
              const isTop3 = rank <= 3;
              const rankPillStyle = rank === 1 
                ? "bg-amber-100 text-amber-900 border-amber-300 font-black shadow-2xs" 
                : rank === 2 
                ? "bg-slate-200 text-slate-800 border-slate-300 font-extrabold shadow-2xs"
                : rank === 3 
                ? "bg-amber-50 text-amber-800 border-amber-200 font-bold shadow-2xs"
                : "bg-slate-50 text-slate-600 border-slate-200/80 font-semibold";

              return (
                <tr key={i} className="hover:bg-indigo-50/30 transition-colors group">
                  {type === "cities" ? (
                    <>
                      <td className="px-6 py-3.5 text-slate-900 flex items-center gap-3">
                        <span className={`inline-flex items-center justify-center min-w-6 h-6 px-1.5 rounded-lg text-xs border ${rankPillStyle}`}>
                          #{rank}
                        </span>
                        <Link 
                          href={`/dashboard/cities/${row.country}/${encodeURIComponent(row.state || '_')}/${encodeURIComponent(row.city || '')}`} 
                          className="font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 group-hover:underline"
                        >
                          <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0 opacity-80" />
                          <span>{row.city}</span>
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ml-0.5" />
                        </Link>
                      </td>
                      <td className="px-6 py-3.5 text-slate-600 font-medium">{row.state || "-"}</td>
                      <td className="px-6 py-3.5 text-slate-700 font-bold">{row.country}</td>
                      <td className="px-6 py-3.5 text-right font-black text-slate-900">
                        {Number(row.totalAdoptions).toLocaleString()}
                      </td>
                      <td className="px-6 py-3.5 text-slate-500 text-right text-xs font-semibold">
                        {row.latestAdoption ? new Date(row.latestAdoption).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : "-"}
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-3.5 text-slate-900 flex items-center gap-3">
                        <span className={`inline-flex items-center justify-center min-w-6 h-6 px-1.5 rounded-lg text-xs border ${rankPillStyle}`}>
                          #{rank}
                        </span>
                        <Link 
                          href={`/dashboard/organizations/${encodeURIComponent(row.organizationName || '')}`} 
                          className="font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 group-hover:underline"
                        >
                          <Building2 className="w-3.5 h-3.5 text-indigo-500 shrink-0 opacity-80" />
                          <span>{row.organizationName}</span>
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ml-0.5" />
                        </Link>
                      </td>
                      <td className="px-6 py-3.5 text-right font-black text-slate-900">
                        {Number(row.totalAdoptions).toLocaleString()}
                      </td>
                      <td className="px-6 py-3.5 text-slate-500 text-right text-xs font-semibold">
                        {row.latestAdoption ? new Date(row.latestAdoption).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : "-"}
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredData.length === 0 && (
          <div className="p-12 text-center text-slate-500 font-medium flex flex-col items-center gap-2">
            <Search className="w-8 h-8 text-slate-300" />
            <p>No matching records found for "{search}".</p>
          </div>
        )}
        {filteredData.length > 100 && (
          <div className="p-3.5 text-center text-xs font-bold text-slate-500 border-t border-slate-100 bg-slate-50/50">
            Showing top 100 results. Please use the search bar above to filter specific entries.
          </div>
        )}
      </div>
    </div>
  );
});

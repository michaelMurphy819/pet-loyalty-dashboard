"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, FileText, Calendar, PawPrint, Monitor, MapPin, Building2 } from "lucide-react";
import { Link } from "@/i18n/routing";

export const CountryDataTable = React.memo(function CountryDataTable({ data }: { data: any[] }) {
  const [search, setSearch] = useState("");

  const filteredData = useMemo(() => {
    return data.filter(item => {
      if (!search) return true;
      const searchTerms = search.toLowerCase().split(' ').filter(Boolean);
      const searchableString = [
        item.inquiryId, 
        item.animalId, 
        item.species, 
        item.stateCode, 
        item.city,
        item.platform,
        item.organizationName
      ].filter(Boolean).join(' ').toLowerCase();
      return searchTerms.every(term => searchableString.includes(term));
    });
  }, [data, search]);

  const getPlatformTagStyle = (platform: string) => {
    const p = (platform || "").toLowerCase();
    if (p.includes("mobile") || p.includes("ios") || p.includes("app")) {
      return "bg-emerald-50 text-emerald-800 border-emerald-200/80";
    }
    if (p.includes("web") || p.includes("portal") || p.includes("desktop")) {
      return "bg-indigo-50 text-indigo-800 border-indigo-200/80";
    }
    if (p.includes("partner") || p.includes("shelter")) {
      return "bg-amber-50 text-amber-900 border-amber-200/80";
    }
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  return (
    <Card className="col-span-full shadow-sm border border-slate-200/80 rounded-2xl bg-white overflow-hidden">
      <div className="py-4 px-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700 font-bold shadow-2xs">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 leading-none">Recent Adoption Ledger</h3>
            <span className="text-xs text-slate-500 font-medium">Granular adoption records and verified timestamped events</span>
          </div>
        </div>
        
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search ID, species, city or platform..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200/80 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-2xs transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="text-[11px] text-slate-500 font-extrabold uppercase tracking-wider bg-slate-50 border-b border-slate-200/80">
            <tr>
              <th className="px-6 py-3.5">Inquiry ID</th>
              <th className="px-6 py-3.5">Animal ID</th>
              <th className="px-6 py-3.5">Species</th>
              <th className="px-6 py-3.5">Channel</th>
              <th className="px-6 py-3.5">Location / Partner</th>
              <th className="px-6 py-3.5 text-right">Adoption Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white font-medium">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500 flex flex-col items-center gap-2">
                  <Search className="w-8 h-8 text-slate-300 mx-auto" />
                  <p>No adoption records matching "{search}".</p>
                </td>
              </tr>
            ) : (
              filteredData.slice(0, 50).map((row) => (
                <tr key={row.id || row.inquiryId} className="hover:bg-indigo-50/30 transition-colors">
                  <td className="px-6 py-3.5 font-extrabold text-slate-900 font-mono text-xs">{row.inquiryId}</td>
                  <td className="px-6 py-3.5 text-slate-600 font-mono text-xs">{row.animalId}</td>
                  <td className="px-6 py-3.5 text-slate-700 capitalize flex items-center gap-1.5">
                    <PawPrint className="w-3.5 h-3.5 text-indigo-500 shrink-0 opacity-70" />
                    <span>{row.species}</span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-bold border shadow-2xs capitalize ${getPlatformTagStyle(row.platform)}`}>
                      <Monitor className="w-3 h-3 opacity-70" />
                      {row.platform}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-slate-700 font-semibold">
                    {row.city ? (
                      <Link 
                        href={`/dashboard/cities/${row.countryCode}/${encodeURIComponent(row.stateCode || '_')}/${encodeURIComponent(row.city)}`} 
                        className="text-indigo-600 hover:text-indigo-800 hover:underline inline-flex items-center gap-1"
                      >
                        <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span>{row.city}, {row.stateCode}</span>
                      </Link>
                    ) : row.organizationName ? (
                      <Link 
                        href={`/dashboard/organizations/${encodeURIComponent(row.organizationName)}`} 
                        className="text-indigo-600 hover:text-indigo-800 hover:underline inline-flex items-center gap-1"
                      >
                        <Building2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span>{row.organizationName}</span>
                      </Link>
                    ) : (
                      <span className="text-slate-400 font-normal">Unspecified</span>
                    )}
                  </td>
                  <td className="px-6 py-3.5 text-slate-600 font-semibold text-right text-xs">
                    <span className="inline-flex items-center gap-1 justify-end">
                      <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                      {new Date(row.adoptionTimestamp).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="py-3 px-6 text-xs font-bold text-slate-500 text-right bg-slate-50/50 border-t border-slate-100">
        Showing up to 50 chronological ledger records matching active view
      </div>
    </Card>
  );
});

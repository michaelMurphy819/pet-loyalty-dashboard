"use client";

import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
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
    <div className="w-full flex flex-col">
      <div className="px-6 py-4 border-b border-slate-100">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder={type === "cities" ? "Search for a city, state, or country..." : "Search for an organization..."}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow bg-slate-50 focus:bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
            {type === "cities" ? (
              <tr>
                <th className="px-6 py-4 font-bold">{t.city}</th>
                <th className="px-6 py-4 font-bold">{t.state}</th>
                <th className="px-6 py-4 font-bold">{t.country}</th>
                <th className="px-6 py-4 font-bold">{t.totalAdoptions}</th>
                <th className="px-6 py-4 font-bold">{t.latestAdoption}</th>
              </tr>
            ) : (
              <tr>
                <th className="px-6 py-4 font-bold">Organization Name</th>
                <th className="px-6 py-4 font-bold">{t.totalAdoptions}</th>
                <th className="px-6 py-4 font-bold">{t.latestAdoption}</th>
              </tr>
            )}
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {filteredData.slice(0, 100).map((row, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                {type === "cities" ? (
                  <>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      <Link href={`/dashboard/cities/${row.country}/${encodeURIComponent(row.state || '_')}/${encodeURIComponent(row.city || '')}`} className="text-indigo-600 hover:underline">
                        {row.city}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{row.state || "-"}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{row.country}</td>
                    <td className="px-6 py-4 text-indigo-600 font-semibold">{row.totalAdoptions}</td>
                    <td className="px-6 py-4 text-slate-500">
                      {row.latestAdoption ? new Date(row.latestAdoption).toLocaleDateString() : "-"}
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      <Link href={`/dashboard/organizations/${encodeURIComponent(row.organizationName || '')}`} className="text-indigo-600 hover:underline">
                        {row.organizationName}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-indigo-600 font-semibold">{row.totalAdoptions}</td>
                    <td className="px-6 py-4 text-slate-500">
                      {row.latestAdoption ? new Date(row.latestAdoption).toLocaleDateString() : "-"}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {filteredData.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            No matching records found.
          </div>
        )}
        {filteredData.length > 100 && (
          <div className="p-4 text-center text-xs text-slate-500 border-t border-slate-100">
            Showing first 100 results. Please refine your search.
          </div>
        )}
      </div>
    </div>
  );
});

"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Building2 } from "lucide-react";
import { fetchCachedData } from "@/lib/client-cache";

interface OrgItem {
  organization_name: string;
  total_adoptions: number;
}

export function OrganizationsDataTable() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryString = searchParams?.toString() || "";

  const [data, setData] = useState<OrgItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchCachedData(`/api/analytics/organizations${queryString ? `?${queryString}` : ""}`)
      .then((json) => {
        if (isMounted) {
          setData(json.data || []);
          setLoading(false);
        }
      })
      .catch(() => { if (isMounted) setLoading(false); });
    return () => { isMounted = false; };
  }, [queryString]);

  const handleRowClick = (orgName: string) => {
    if (!orgName) return;
    const current = new URLSearchParams(queryString);
    if (current.get("shelter") === orgName) {
      current.delete("shelter");
    } else {
      current.set("shelter", orgName);
    }
    router.push(`${pathname}?${current.toString()}`, { scroll: false });
  };

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    const lower = searchQuery.toLowerCase();
    return data.filter((org) => org.organization_name.toLowerCase().includes(lower));
  }, [data, searchQuery]);

  if (loading) {
    return (
      <div className="h-[380px] w-full animate-pulse bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between p-5">
        <div className="h-6 w-48 bg-slate-100 rounded-md mb-4" />
        <div className="h-[290px] bg-slate-50/80 rounded-xl my-2" />
      </div>
    );
  }

  return (
    <Card className="border border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-all rounded-2xl overflow-hidden flex flex-col h-[380px] min-w-0 w-full justify-between">
      <div className="py-3 px-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700 font-bold shadow-2xs shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div className="truncate">
            <h3 className="text-sm font-bold text-slate-900 leading-none truncate">Partner Organization Directory</h3>
            <p className="text-[11px] text-slate-500 mt-0.5 truncate">Click any organization row to cross-filter</p>
          </div>
        </div>

        <div className="relative w-36 sm:w-44 shrink-0">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Filter network..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all shadow-2xs"
          />
        </div>
      </div>

      <CardContent className="p-0 overflow-hidden min-w-0 w-full">
        <div className="overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-200 w-full h-[310px] max-h-[310px]">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-white text-slate-500 text-[10px] uppercase tracking-wider font-bold border-b border-slate-100 z-10 shadow-2xs">
              <tr>
                <th className="py-2.5 px-5 w-20">Rank</th>
                <th className="py-2.5 px-5">Organization Name</th>
                <th className="py-2.5 px-5 text-right w-36">Total Volume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-12 text-slate-400 text-xs">No matching rescue partners found.</td>
                </tr>
              ) : (
                filteredData.map((org, idx) => {
                  const isSelected = searchParams?.get("shelter") === org.organization_name;
                  return (
                    <tr 
                      key={org.organization_name} 
                      onClick={() => handleRowClick(org.organization_name)}
                      className={`hover:bg-amber-50/50 transition-colors cursor-pointer select-none ${isSelected ? "bg-amber-50/90 font-bold text-amber-950 border-l-4 border-amber-500" : ""}`}
                    >
                      <td className="py-2 px-5">
                        <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-md text-[11px] font-bold ${
                          idx === 0 ? "bg-amber-100 text-amber-800 border border-amber-200" :
                          idx === 1 ? "bg-slate-200 text-slate-700" :
                          idx === 2 ? "bg-orange-100 text-orange-800" :
                          "text-slate-400 bg-slate-50"
                        }`}>
                          #{idx + 1}
                        </span>
                      </td>
                      <td className="py-2 px-5 font-semibold text-slate-900 truncate max-w-xs">{org.organization_name}</td>
                      <td className="py-2 px-5 text-right font-bold text-emerald-600">
                        {Number(org.total_adoptions).toLocaleString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

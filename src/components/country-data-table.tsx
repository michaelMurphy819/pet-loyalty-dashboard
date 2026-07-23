"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import { Link } from "@/i18n/routing";

export const CountryDataTable = React.memo(function CountryDataTable({ data }: { data: any[] }) {
  const [search, setSearch] = useState("");

  const filteredData = useMemo(() => {
    return data.filter(item => {
      if (!search) return true;
      
      const searchTerms = search.toLowerCase().split(' ').filter(Boolean);
    
    // Create a massive string of all searchable fields for this row
    const searchableString = [
      item.inquiryId, 
      item.animalId, 
      item.species, 
      item.stateCode, 
      item.city,
      item.platform,
      item.organizationName
    ].filter(Boolean).join(' ').toLowerCase();

    // Ensure EVERY term the user typed is found somewhere in the row's data
    return searchTerms.every(term => searchableString.includes(term));
    });
  }, [data, search]);

  return (
    <Card className="col-span-full shadow-sm border-slate-200">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 gap-4">
        <CardTitle className="text-xl font-bold">Recent Adoption Records</CardTitle>
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search state, species, ID..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow bg-slate-50 focus:bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Inquiry ID</th>
                <th className="px-6 py-4 font-semibold">Animal ID</th>
                <th className="px-6 py-4 font-semibold">Species</th>
                <th className="px-6 py-4 font-semibold">Platform</th>
                <th className="px-6 py-4 font-semibold">Location</th>
                <th className="px-6 py-4 font-semibold text-right">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">No records found.</td></tr>
              ) : (
                filteredData.slice(0, 50).map((row) => (
                  <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3 font-medium text-slate-900">{row.inquiryId}</td>
                    <td className="px-6 py-3 text-slate-600">{row.animalId}</td>
                    <td className="px-6 py-3 text-slate-600 capitalize">{row.species}</td>
                    <td className="px-6 py-3 text-slate-600">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {row.platform}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-slate-600">
                      {row.city ? (
                        <Link href={`/dashboard/cities/${row.countryCode}/${encodeURIComponent(row.stateCode || '_')}/${encodeURIComponent(row.city)}`} className="text-indigo-600 hover:underline">
                          {row.city}, {row.stateCode}
                        </Link>
                      ) : row.organizationName ? (
                        <Link href={`/dashboard/organizations/${encodeURIComponent(row.organizationName)}`} className="text-indigo-600 hover:underline">
                          {row.organizationName}
                        </Link>
                      ) : (
                        "Unknown"
                      )}
                    </td>
                    <td className="px-6 py-3 text-slate-600 text-right">
                      {new Date(row.adoptionTimestamp).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-xs text-slate-500 text-right">
          Showing up to 50 results matching your search
        </div>
      </CardContent>
    </Card>
  );
});

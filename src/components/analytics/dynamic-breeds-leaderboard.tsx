"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Tag } from "lucide-react";
import { fetchCachedData } from "@/lib/client-cache";

interface BreedItem {
  primary_breed: string;
  total_adoptions: number;
}

interface DynamicBreedsLeaderboardProps {
  selectedSpecies?: string | null;
}

// Engaging azure/sapphire gradient spectrum for breeds leaderboard
const BREED_COLORS = ["#0284c7", "#0369a1", "#0277bd", "#0891b2", "#0e7490", "#2563eb", "#3b82f6", "#4f46e5", "#6366f1", "#8b5cf6"];

function BreedsLeaderboardContent({ selectedSpecies: propSpecies }: DynamicBreedsLeaderboardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryString = searchParams?.toString() || "";

  const species = propSpecies !== undefined ? propSpecies : (searchParams?.get("species") || null);

  const [data, setData] = useState<BreedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchCachedData(`/api/analytics/leaderboard/breeds${queryString ? `?${queryString}` : ""}`)
      .then((json) => {
        if (isMounted) {
          setData(json.data || []);
          setLoading(false);
        }
      })
      .catch(() => { if (isMounted) setLoading(false); });
    return () => { isMounted = false; };
  }, [queryString]);

  const handleBarClick = (item: any) => {
    if (!item || !item.primary_breed) return;
    const current = new URLSearchParams(queryString);
    if (current.get("breed") === item.primary_breed) {
      current.delete("breed");
    } else {
      current.set("breed", item.primary_breed);
    }
    router.push(`${pathname}?${current.toString()}`, { scroll: false });
  };

  if (loading) {
    return (
      <div className="h-[380px] w-full animate-pulse bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between p-5">
        <div className="h-6 w-48 bg-slate-100 rounded-md mb-4" />
        <div className="flex-1 bg-slate-50/80 rounded-xl my-2" />
      </div>
    );
  }

  return (
    <Card className="border border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-all rounded-2xl overflow-hidden min-w-0 w-full h-[380px] flex flex-col justify-between">
      <div className="py-3 px-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-sky-100 text-sky-700 font-bold shadow-2xs">
            <Tag className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-none">Top 10 Primary Breeds</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {species ? `Exclusively showing ${species}` : "Click any breed column to cross-filter"}
            </p>
          </div>
        </div>
        {species && (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 text-sky-800 border border-sky-200 shrink-0 shadow-2xs">
            {species} Filtered
          </span>
        )}
      </div>

      <CardContent className="p-4 flex-1 flex flex-col justify-center overflow-hidden min-w-0 w-full">
        <div className="w-full relative shrink-0" style={{ height: "260px", width: "100%", minHeight: "260px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 2, right: 15, left: 5, bottom: 2 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" stroke="#64748b" font-weight={500} fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => Number(v).toLocaleString()} />
              <YAxis 
                type="category" 
                dataKey="primary_breed" 
                stroke="#334155" 
                fontSize={11} 
                fontWeight={600}
                tickLine={false} 
                axisLine={false} 
                width={135}
                tickFormatter={(v) => typeof v === 'string' && v.length > 19 ? `${v.substring(0, 19)}...` : String(v || "Unknown")}
              />
              <Tooltip 
                cursor={{ fill: "#f8fafc" }}
                formatter={(value: any) => [Number(value).toLocaleString(), "Adoptions"]}
                contentStyle={{ borderRadius: "10px", border: "1px solid #e2e8f0", backgroundColor: "#ffffff", fontSize: "12px", fontWeight: 600, boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.08)" }}
              />
              <Bar 
                dataKey="total_adoptions" 
                radius={[0, 6, 6, 0]} 
                barSize={16}
                onClick={handleBarClick}
                style={{ cursor: "pointer" }}
              >
                {data.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={BREED_COLORS[idx % BREED_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function DynamicBreedsLeaderboard(props: DynamicBreedsLeaderboardProps) {
  return (
    <Suspense fallback={
      <div className="h-[380px] w-full animate-pulse bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between">
        <div className="h-6 w-48 bg-slate-100 rounded-md" />
        <div className="flex-1 bg-slate-50/80 rounded-xl my-2" />
      </div>
    }>
      <BreedsLeaderboardContent {...props} />
    </Suspense>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { fetchCachedData } from "@/lib/client-cache";

interface LocationItem {
  state_code: string;
  city: string;
  total_adoptions: number;
  label?: string;
}

// Engaging emerald and teal gradient spectrum for municipal regions
const LOCATION_COLORS = ["#059669", "#10b981", "#0d9488", "#14b8a6", "#047857", "#0f766e", "#34d399", "#2dd4bf", "#10b981", "#059669"];

export function LocationLeaderboardChart() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryString = searchParams?.toString() || "";

  const [data, setData] = useState<LocationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchCachedData(`/api/analytics/leaderboard/locations${queryString ? `?${queryString}` : ""}`)
      .then((json) => {
        if (isMounted) {
          const formatted = (json.data || []).map((item: LocationItem) => ({
            ...item,
            label: `${item.city}, ${item.state_code}`,
          }));
          setData(formatted);
          setLoading(false);
        }
      })
      .catch(() => { if (isMounted) setLoading(false); });
    return () => { isMounted = false; };
  }, [queryString]);

  const handleBarClick = (item: any) => {
    if (!item || !item.city) return;
    const current = new URLSearchParams(queryString);
    if (current.get("city") === item.city) {
      current.delete("city");
    } else {
      current.set("city", item.city);
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
      <div className="py-3 px-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-teal-100 text-teal-700 font-bold shadow-2xs">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-none">Top 10 Municipal Areas</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">City volume concentration (Click bars to filter by city)</p>
          </div>
        </div>
      </div>

      <CardContent className="p-4 flex-1 flex flex-col justify-center overflow-hidden min-w-0 w-full">
        <div className="w-full relative shrink-0" style={{ height: "260px", width: "100%", minHeight: "260px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 2, right: 15, left: 5, bottom: 2 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" stroke="#64748b" font-weight={500} fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => Number(v).toLocaleString()} />
              <YAxis 
                type="category" 
                dataKey="label" 
                stroke="#334155" 
                fontSize={11} 
                fontWeight={600}
                tickLine={false} 
                axisLine={false} 
                width={135} 
                tickFormatter={(v) => typeof v === 'string' && v.length > 18 ? `${v.substring(0, 18)}...` : String(v || "Unknown")}
              />
              <Tooltip 
                cursor={{ fill: "#f8fafc" }}
                formatter={(value: any) => [Number(value).toLocaleString(), "Total Volume"]}
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
                  <Cell key={`cell-${idx}`} fill={LOCATION_COLORS[idx % LOCATION_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

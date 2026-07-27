"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Layers } from "lucide-react";
import { fetchCachedData } from "@/lib/client-cache";

// Vibrant multi-color channel spectrum aligning with platform pie colors
const PLATFORM_COLORS = ["#8b5cf6", "#10b981", "#06b6d4", "#f59e0b", "#f43f5e", "#3b82f6", "#14b8a6"];

export function PlatformDominanceChart() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryString = searchParams?.toString() || "";

  const [data, setData] = useState<any[]>([]);
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchCachedData(`/api/analytics/platform-dominance${queryString ? `?${queryString}` : ""}`)
      .then((json) => {
        if (isMounted) {
          setData(json.data || []);
          setPlatforms(json.platforms || []);
          setLoading(false);
        }
      })
      .catch(() => { if (isMounted) setLoading(false); });
    return () => { isMounted = false; };
  }, [queryString]);

  const handleLegendOrBarClick = (platName: string) => {
    if (!platName) return;
    const current = new URLSearchParams(queryString);
    if (current.get("platform") === platName) {
      current.delete("platform");
    } else {
      current.set("platform", platName);
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
          <div className="p-1.5 rounded-lg bg-cyan-100 text-cyan-700 font-bold shadow-2xs">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-none">Platform Dominance by Region</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Regional volume breakdown (Click any platform bar to filter)</p>
          </div>
        </div>
      </div>

      <CardContent className="p-4 flex-1 flex flex-col justify-center overflow-hidden min-w-0 w-full">
        <div className="w-full relative shrink-0" style={{ height: "260px", width: "100%", minHeight: "260px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 15, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="state_code" stroke="#64748b" font-weight={600} fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" font-weight={500} fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => Number(v).toLocaleString()} />
              <Tooltip 
                cursor={{ fill: "#f8fafc" }}
                formatter={(value: any, name: any) => [Number(value).toLocaleString(), name]}
                contentStyle={{ borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "12px", fontWeight: 600, backgroundColor: "#ffffff", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.08)" }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: "10px", fontSize: "11px", fontWeight: 600, color: "#475569", cursor: "pointer" }} 
                onClick={(e: any) => e?.dataKey && handleLegendOrBarClick(String(e.dataKey))}
              />
              {platforms.map((plat, idx) => (
                <Bar 
                  key={plat} 
                  dataKey={plat} 
                  stackId="region" 
                  fill={PLATFORM_COLORS[idx % PLATFORM_COLORS.length]} 
                  onClick={(entry: any, index: number, e: any) => handleLegendOrBarClick(plat)}
                  style={{ cursor: "pointer" }}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

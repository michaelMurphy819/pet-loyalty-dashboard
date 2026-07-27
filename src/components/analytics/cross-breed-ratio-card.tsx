"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { fetchCachedData } from "@/lib/client-cache";

export function CrossBreedRatioCard() {
  const searchParams = useSearchParams();
  const queryString = searchParams?.toString() || "";

  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchCachedData(`/api/analytics/ratios/crossbreed${queryString ? `?${queryString}` : ""}`)
      .then((json) => {
        if (isMounted) {
          setMetrics(json);
          setLoading(false);
        }
      })
      .catch(() => { if (isMounted) setLoading(false); });
    return () => { isMounted = false; };
  }, [queryString]);

  if (loading || !metrics) return <div className="h-[260px] animate-pulse bg-slate-50 border border-slate-200 rounded-xl w-full" />;

  const chartData = [
    { name: "Mixed / Cross-Breed", value: Number(metrics.mixed_count || 0), color: "#4f46e5" },
    { name: "Purebred / Single Breed", value: Number(metrics.purebred_count || 0), color: "#94a3b8" },
  ];

  return (
    <Card className="border border-slate-200 bg-white shadow-2xs rounded-xl overflow-hidden min-w-0 w-full flex flex-col justify-between h-full">
      <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Purebred vs. Mixed Ratio</h3>
          <p className="text-xs text-slate-500 mt-0.5">Secondary breed genetic lineage proportion (Filtered in real-time)</p>
        </div>
      </div>
      <CardContent className="p-6 flex flex-col md:flex-row items-center justify-around gap-8 overflow-hidden min-w-0 w-full">
        <div className="flex-1 w-full space-y-5 min-w-0">
          <div>
            <div className="flex justify-between items-center text-xs font-semibold mb-2">
              <span className="text-slate-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-indigo-600 inline-block" />
                Mixed / Domestic ({metrics.mixed_pct}%)
              </span>
              <span className="text-slate-600 flex items-center gap-2">
                Purebred ({metrics.purebred_pct}%)
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-400 inline-block" />
              </span>
            </div>
            <div className="h-3 w-full bg-slate-100 rounded overflow-hidden flex border border-slate-200/60">
              <div 
                className="h-full bg-indigo-600 transition-all duration-700 ease-out" 
                style={{ width: `${metrics.mixed_pct}%` }} 
              />
              <div 
                className="h-full bg-slate-400 transition-all duration-700 ease-out" 
                style={{ width: `${metrics.purebred_pct}%` }} 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-1">
            <div className="p-4 bg-slate-50/80 rounded-lg border border-slate-200/80">
              <div className="text-xs font-medium text-slate-500">Mixed Breed Volume</div>
              <div className="text-xl font-bold text-slate-900 mt-1">{Number(metrics.mixed_count || 0).toLocaleString()}</div>
            </div>
            <div className="p-4 bg-slate-50/80 rounded-lg border border-slate-200/80">
              <div className="text-xs font-medium text-slate-500">Purebred Volume</div>
              <div className="text-xl font-bold text-slate-900 mt-1">{Number(metrics.purebred_count || 0).toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="w-[140px] h-[140px] relative shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={46}
                outerRadius={65}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(val: any) => [Number(val).toLocaleString(), "Adoptions"]}
                contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", backgroundColor: "#ffffff", fontSize: "12px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { fetchCachedData } from "@/lib/client-cache";

interface TimeSeriesPoint {
  date: string;
  adoptions: number;
  movingAvg: number;
}

export function AdoptionsOverTimeWithMovingAvg() {
  const searchParams = useSearchParams();
  const queryString = searchParams?.toString() || "";

  const [data, setData] = useState<TimeSeriesPoint[]>([]);
  const [showMovingAvg, setShowMovingAvg] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchCachedData(`/api/analytics/timeseries/moving-average${queryString ? `?${queryString}` : ""}`)
      .then((json) => {
        if (isMounted) {
          setData(json.data || []);
          setLoading(false);
        }
      })
      .catch(() => { if (isMounted) setLoading(false); });
    return () => { isMounted = false; };
  }, [queryString]);

  if (loading) {
    return (
      <div className="h-[570px] min-h-[570px] max-h-[570px] w-full animate-pulse bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between p-5">
        <div className="h-6 w-48 bg-slate-100 rounded-md mb-4" />
        <div className="flex-1 bg-slate-50/80 rounded-xl my-2" />
      </div>
    );
  }

  return (
    <Card className="border border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-all rounded-2xl overflow-hidden min-w-0 w-full h-[570px] min-h-[570px] max-h-[570px] flex flex-col justify-between">
      <div className="py-3.5 px-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700 font-bold shadow-2xs">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 leading-none">Adoptions Over Time</h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">Daily volume vs. 30-day moving average</p>
          </div>
        </div>

        <label className="inline-flex items-center gap-2.5 bg-white border border-slate-200/80 px-3.5 py-1.5 rounded-full cursor-pointer select-none hover:bg-slate-50 transition-colors text-xs font-bold text-slate-700 shadow-2xs">
          <span>Moving Avg</span>
          <div className="relative inline-flex items-center">
            <input 
              type="checkbox" 
              checked={showMovingAvg} 
              onChange={(e) => setShowMovingAvg(e.target.checked)}
              className="sr-only peer" 
            />
            <div className="w-8 h-4.5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-3.5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-indigo-600" />
          </div>
        </label>
      </div>
      
      <CardContent className="p-5 flex-1 flex flex-col justify-center overflow-hidden min-w-0 w-full relative">
        <div className="w-full relative shrink-0" style={{ height: "450px", width: "100%", minHeight: "450px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAdoptionsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.45} />
                  <stop offset="50%" stopColor="#8b5cf6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} tickFormatter={(v) => Number(v).toLocaleString()} />
              <Tooltip 
                cursor={{ stroke: '#6366f1', strokeWidth: 1.5, strokeDasharray: "3 3" }}
                formatter={(val: any, name: any) => [Number(val).toLocaleString(), name === "movingAvg" ? "30-Day Moving Avg" : "Daily Volume"]}
                contentStyle={{ borderRadius: "10px", border: "1px solid #e2e8f0", backgroundColor: "#ffffff", fontSize: "12px", fontWeight: 600, boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.08)" }}
              />
              <Legend wrapperStyle={{ paddingTop: "12px", fontSize: "13px", fontWeight: 700, color: "#334155" }} />
              
              <Area 
                type="monotone" 
                dataKey="adoptions" 
                name="Daily Volume"
                stroke="#6366f1" 
                strokeWidth={2.5} 
                fillOpacity={1} 
                fill="url(#colorAdoptionsGradient)" 
              />

              {showMovingAvg && (
                <Line
                  type="monotone"
                  dataKey="movingAvg"
                  name="30-Day Moving Avg"
                  stroke="#f97316"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2, fill: "#f97316" }}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

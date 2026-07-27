"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, BarChart2 } from "lucide-react";
import { fetchCachedData } from "@/lib/client-cache";

interface DowItem {
  day_of_week: number;
  day_name: string;
  volume: number;
  intensity_ratio: number;
}

export function DayOfWeekHeatmap() {
  const searchParams = useSearchParams();
  const queryString = searchParams?.toString() || "";

  const [days, setDays] = useState<DowItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchCachedData(`/api/analytics/heatmap/dow${queryString ? `?${queryString}` : ""}`)
      .then((json) => {
        if (isMounted) {
          setDays(json.data || []);
          setLoading(false);
        }
      })
      .catch(() => { if (isMounted) setLoading(false); });
    return () => { isMounted = false; };
  }, [queryString]);

  const getSolidHeatmapStyling = (ratio: number) => {
    if (ratio >= 0.88) {
      return {
        card: "bg-indigo-600 text-white border-indigo-700 shadow-sm",
        label: "text-indigo-100 font-extrabold",
        num: "text-white font-black",
        badge: "bg-indigo-700 text-white border border-indigo-500 font-bold"
      };
    }
    if (ratio >= 0.70) {
      return {
        card: "bg-indigo-50/90 text-indigo-950 border-indigo-200/80 shadow-2xs",
        label: "text-indigo-600 font-extrabold",
        num: "text-indigo-950 font-extrabold",
        badge: "bg-indigo-100 text-indigo-800 border border-indigo-200 font-semibold"
      };
    }
    if (ratio >= 0.50) {
      return {
        card: "bg-teal-50/80 text-teal-950 border-teal-200/70",
        label: "text-teal-700 font-extrabold",
        num: "text-teal-950 font-bold",
        badge: "bg-teal-100 text-teal-800 border border-teal-200/80 font-semibold"
      };
    }
    return {
      card: "bg-slate-50 text-slate-800 border-slate-200/80",
      label: "text-slate-500 font-bold",
      num: "text-slate-800 font-bold",
      badge: "bg-slate-200/70 text-slate-700 border border-slate-300 font-medium"
    };
  };

  if (loading) {
    return (
      <div className="h-[190px] w-full animate-pulse bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between p-4">
        <div className="h-5 w-48 bg-slate-100 rounded-md" />
        <div className="h-[125px] bg-slate-50/80 rounded-xl my-2" />
      </div>
    );
  }

  return (
    <Card className="border border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-all rounded-2xl overflow-hidden min-w-0 w-full h-[190px] flex flex-col justify-between">
      <div className="py-2.5 px-4 sm:px-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0 gap-2">
        <div className="flex items-center gap-2 truncate">
          <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700 font-bold shadow-2xs shrink-0">
            <CalendarDays className="w-4 h-4" />
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-none truncate">Day-of-Week Volume Distribution</h3>
        </div>
        <span className="inline-flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] font-semibold text-slate-600 bg-white px-2 sm:px-2.5 py-0.5 rounded-full border border-slate-200 shadow-2xs shrink-0">
          <BarChart2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          <span className="hidden sm:inline">7-Day Adoption Velocity</span>
          <span className="sm:hidden">7-Day Velocity</span>
        </span>
      </div>

      <CardContent className="p-2.5 sm:p-3.5 sm:px-5 overflow-hidden min-w-0 w-full flex flex-col justify-center">
        {/* Strictly enforce grid-cols-7 across ALL viewports with compact mobile spacing so every single day is visible without overflow! */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5 md:gap-3 w-full h-[120px] max-h-[120px]">
          {days.map((item) => {
            const style = getSolidHeatmapStyling(item.intensity_ratio);
            const isPeak = item.intensity_ratio >= 0.88;
            const shortName = String(item.day_name || "").substring(0, 3);

            return (
              <div 
                key={item.day_name}
                className={`p-1.5 sm:p-2 rounded-xl border transition-all flex flex-col items-center justify-between text-center select-none h-full w-full overflow-hidden ${style.card}`}
              >
                <span className={`text-[9px] sm:text-xs tracking-wider uppercase truncate w-full ${style.label}`}>
                  {shortName}
                </span>

                <div className="my-0.5 truncate w-full">
                  <span className={`text-[11px] sm:text-base lg:text-lg tracking-tight block truncate font-extrabold ${style.num}`}>
                    {Number(item.volume || 0).toLocaleString()}
                  </span>
                </div>

                <div className="w-full px-0 sm:px-0.5 truncate">
                  <span className={`py-0.5 px-0.5 sm:px-1 rounded-md text-[8px] sm:text-[10px] uppercase tracking-wider block w-full text-center truncate ${style.badge}`}>
                    {isPeak ? "Peak" : `${Math.round(item.intensity_ratio * 100)}%`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { Info, TrendingUp, Sparkles } from "lucide-react";

interface TimeSeriesData {
  date: string;
  adoptions: number;
  forecast?: number | null;
}

export function TimeSeriesAreaChart({ data }: { data: TimeSeriesData[] }) {
  const t = useTranslations("Dashboard");
  const tReporting = useTranslations("Dashboard.reporting");

  if (!data || data.length === 0) return null;

  return (
    <Card className="border border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-all rounded-2xl overflow-hidden col-span-full w-full">
      <div className="py-3 px-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700 font-bold shadow-2xs">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm md:text-base font-extrabold text-slate-900 leading-none">{t("charts.adoptionsOverTime")}</h3>
            <span className="text-[11px] font-semibold text-slate-400 block mt-0.5">Historical trendline & forecasting models</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100/80">
            <Sparkles className="w-3 h-3" />
            Live Trendline
          </span>
          <div title={tReporting("tooltips.timeSeries")} className="p-1 text-slate-400 hover:text-indigo-600 transition-colors cursor-help">
            <Info className="w-4 h-4" />
          </div>
        </div>
      </div>

      <CardContent className="p-5 pt-4">
        <div className="h-[540px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAdoptionsArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} tickFormatter={(v) => v.toLocaleString()} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '10px 14px', fontWeight: 'bold' }}
                formatter={(value: any, name: any) => [Number(value).toLocaleString(), name === "adoptions" ? "Total Adoptions" : name]}
              />
              <Area type="monotone" dataKey="adoptions" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorAdoptionsArea)" name={t("charts.adoptionsOverTime")} />
              <Area type="monotone" dataKey="forecast" stroke="#f59e0b" strokeDasharray="5 5" strokeWidth={2.5} fillOpacity={0} name={t("charts.forecast")} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { Info } from "lucide-react";

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
    <Card className="col-span-full shadow-sm border-slate-200">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-xl font-bold">{t("charts.adoptionsOverTime")}</CardTitle>
          <div title={tReporting("tooltips.timeSeries")} className="cursor-help">
            <Info className="w-4 h-4 text-slate-400 hover:text-indigo-500 transition-colors" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAdoptions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => v.toLocaleString()} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Area type="monotone" dataKey="adoptions" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorAdoptions)" name={t("charts.adoptionsOverTime")} />
              <Area type="monotone" dataKey="forecast" stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={3} fillOpacity={0} name={t("charts.forecast")} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { BarChart2, Filter } from "lucide-react";

interface DataItem {
  name: string;
  value: number;
}

interface LocationBarChartProps {
  data: DataItem[];
  title: string;
  filterKey?: string;
}

const BAR_COLORS = [
  "#6366f1", // Indigo 500
  "#4f46e5", // Indigo 600
  "#818cf8", // Indigo 400
  "#10b981", // Emerald 500
  "#06b6d4", // Cyan 500
  "#8b5cf6", // Purple 500
  "#f59e0b", // Amber 500
];

export function CountryLocationBarChart({ data, title, filterKey }: LocationBarChartProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (!data || data.length === 0) return null;

  const handleBarClick = (item: any) => {
    if (filterKey && item && item.name) {
      const currentParams = new URLSearchParams(searchParams?.toString() || "");
      if (currentParams.get(filterKey) === item.name) {
        currentParams.delete(filterKey);
      } else {
        currentParams.set(filterKey, item.name);
      }
      router.push(`?${currentParams.toString()}`, { scroll: false });
    }
  };

  const chartHeight = Math.max(300, data.length * 40);

  return (
    <Card className="border border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-all rounded-2xl overflow-hidden flex flex-col justify-between min-w-0 w-full h-[400px]">
      <div className="py-2.5 px-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 font-bold shadow-2xs">
            <BarChart2 className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 leading-none truncate max-w-[200px] sm:max-w-xs">{title}</h3>
        </div>
        {filterKey && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50/80 px-2.5 py-0.5 rounded-full border border-emerald-100">
            <Filter className="w-3 h-3" />
            Click bar to filter
          </span>
        )}
      </div>

      <CardContent className="flex flex-col gap-3 overflow-hidden min-w-0 w-full p-4 pt-3 flex-1">
        <div 
          className="overflow-y-auto overflow-x-hidden pr-2 scrollbar-thin scrollbar-thumb-slate-200 w-full"
          style={{ height: "330px", maxHeight: "330px", minHeight: "330px", width: "100%" }}
        >
          <div style={{ height: `${chartHeight}px`, width: "100%", minWidth: 0 }}>
            <ResponsiveContainer width="100%" height={chartHeight}>
              <BarChart data={data} layout="vertical" margin={{ top: 5, right: 25, left: 5, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  stroke="#334155" 
                  fontSize={12} 
                  fontWeight="700"
                  tickLine={false} 
                  axisLine={false}
                  width={140}
                  tickFormatter={(value) => value && typeof value === "string" && value.length > 20 ? `${value.substring(0, 20)}...` : value}
                />
                <Tooltip 
                  cursor={{ fill: "#f8fafc" }}
                  formatter={(value: any, name: any) => [Number(value).toLocaleString(), "Adoptions"]}
                  contentStyle={{ borderRadius: "10px", border: "1px solid #e2e8f0", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)", fontWeight: "bold", padding: "8px 12px" }}
                />
                <Bar 
                  dataKey="value" 
                  radius={[0, 6, 6, 0]} 
                  barSize={20}
                  onClick={filterKey ? handleBarClick : undefined}
                  style={{ cursor: filterKey ? "pointer" : "default" }}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

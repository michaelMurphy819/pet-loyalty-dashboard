"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";

interface DataItem {
  name: string;
  value: number;
}

interface LocationBarChartProps {
  data: DataItem[];
  title: string;
  filterKey?: string;
}

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

  // Calculate dynamic height based on item count so scrolling feels smooth and spacious
  const chartHeight = Math.max(360, data.length * 36);

  return (
    <Card className="shadow-sm border-slate-200 flex flex-col justify-between overflow-hidden min-w-0 w-full h-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold truncate">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 overflow-hidden min-w-0 w-full p-6 pt-0">
        {/* Strictly bound the container height to 360px with inline styles to force a vertical scroll wheel */}
        <div 
          className="overflow-y-auto overflow-x-hidden pr-2 scrollbar-thin scrollbar-thumb-slate-200 w-full"
          style={{ height: "360px", maxHeight: "360px", minHeight: "360px", width: "100%" }}
        >
          <div style={{ height: `${chartHeight}px`, width: "100%", minWidth: 0 }}>
            <ResponsiveContainer width="100%" height={chartHeight}>
              <BarChart data={data} layout="vertical" margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  stroke="#475569" 
                  fontSize={12} 
                  fontWeight="bold"
                  tickLine={false} 
                  axisLine={false}
                  width={130}
                  tickFormatter={(value) => value && typeof value === "string" && value.length > 18 ? `${value.substring(0, 18)}...` : value}
                />
                <Tooltip 
                  cursor={{ fill: "#f1f5f9" }}
                  formatter={(value: any, name: any) => [Number(value).toLocaleString(), name]}
                  contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#6366f1" 
                  radius={[0, 4, 4, 0]} 
                  barSize={20}
                  onClick={filterKey ? handleBarClick : undefined}
                  style={{ cursor: filterKey ? "pointer" : "default" }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {filterKey && (
          <p className="text-xs text-slate-400 text-center mt-2 truncate">
            Click on any bar above to filter the dashboard. Scroll down to view more.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

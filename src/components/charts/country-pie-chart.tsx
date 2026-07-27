"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { PieChart as PieIcon, Filter } from "lucide-react";

interface DataItem {
  name: string;
  value: number;
}

interface CountryPieChartProps {
  data: DataItem[];
  title: string;
  filterKey?: string;
}

const COLORS = [
  "#6366f1", // Indigo 500
  "#10b981", // Emerald 500
  "#06b6d4", // Cyan 500
  "#f59e0b", // Amber 500
  "#8b5cf6", // Purple 500
  "#ec4899", // Pink 500
  "#14b8a6", // Teal 500
  "#3b82f6", // Blue 500
  "#d97706", // Amber 600
  "#7c3aed", // Violet 600
];

export function CountryPieChart({ data, title, filterKey }: CountryPieChartProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (!data || data.length === 0) return null;

  const handlePieClick = (item: any) => {
    if (filterKey && item && item.name && item.name !== "Other" && item.name !== "other") {
      const currentParams = new URLSearchParams(searchParams?.toString() || "");
      if (currentParams.get(filterKey) === item.name) {
        currentParams.delete(filterKey);
      } else {
        currentParams.set(filterKey, item.name);
      }
      router.push(`?${currentParams.toString()}`, { scroll: false });
    }
  };

  const processedData = [...data]
    .filter(d => d.name !== "Other" && d.name !== "other")
    .sort((a, b) => b.value - a.value);

  if (processedData.length === 0) return null;

  return (
    <Card className="border border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-all rounded-2xl overflow-hidden flex flex-col justify-between min-w-0 w-full h-[400px]">
      <div className="py-2.5 px-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700 font-bold shadow-2xs">
            <PieIcon className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 leading-none truncate max-w-[200px] sm:max-w-xs">{title}</h3>
        </div>
        {filterKey && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50/80 px-2.5 py-0.5 rounded-full border border-indigo-100">
            <Filter className="w-3 h-3" />
            Interactive Slice
          </span>
        )}
      </div>

      <CardContent className="flex flex-col gap-3 overflow-hidden min-w-0 w-full p-4 flex-1 justify-center">
        <div className="w-full relative shrink-0" style={{ height: "220px", minHeight: "220px", width: "100%" }}>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={processedData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={2}
                dataKey="value"
                onClick={filterKey ? handlePieClick : undefined}
                style={{ cursor: filterKey ? "pointer" : "default" }}
              >
                {processedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#ffffff" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any, name: any) => [Number(value).toLocaleString(), name]}
                contentStyle={{ borderRadius: "10px", border: "1px solid #e2e8f0", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)", fontWeight: "bold", padding: "8px 12px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div 
          className="overflow-y-auto overflow-x-hidden border-t border-slate-100 pt-2 px-1 scrollbar-thin scrollbar-thumb-slate-200 w-full"
          style={{ maxHeight: "100px", width: "100%", minWidth: "0" }}
        >
          <div className="flex flex-wrap gap-1.5 justify-center text-xs w-full max-w-full overflow-hidden">
            {processedData.map((entry, index) => {
              const isSelected = filterKey && searchParams?.get(filterKey) === entry.name;
              return (
                <div
                  key={`legend-${index}`}
                  onClick={() => filterKey && handlePieClick(entry)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg select-none max-w-full overflow-hidden truncate transition-all border ${
                    filterKey ? "cursor-pointer hover:bg-slate-100" : ""
                  } ${isSelected ? "bg-indigo-50 border-indigo-300 text-indigo-900 font-bold shadow-2xs" : "bg-slate-50/70 border-slate-200/60 text-slate-700 font-medium"}`}
                  title={`${entry.name}: ${entry.value.toLocaleString()}`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block shrink-0 shadow-2xs"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="truncate font-semibold max-w-[110px] capitalize">{entry.name}</span>
                  <span className="text-slate-400 font-bold shrink-0">({entry.value.toLocaleString()})</span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

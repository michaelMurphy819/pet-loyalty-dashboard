"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";

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
  "#6366f1", "#a855f7", "#ec4899", "#f43f5e", "#f59e0b", 
  "#10b981", "#3b82f6", "#06b6d4", "#8b5cf6", "#d97706", 
  "#059669", "#2563eb", "#db2777", "#e11d48", "#14b8a6", "#7c3aed"
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
    <Card className="shadow-sm border-slate-200 flex flex-col justify-between overflow-hidden min-w-0 w-full h-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold truncate">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 overflow-hidden min-w-0 w-full p-6 pt-0">
        {/* Explicit pixel height guarantees Recharts will always render the pie circle cleanly */}
        <div className="w-full relative shrink-0" style={{ height: "240px", minHeight: "240px", width: "100%" }}>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={processedData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={1}
                dataKey="value"
                onClick={filterKey ? handlePieClick : undefined}
                style={{ cursor: filterKey ? "pointer" : "default" }}
              >
                {processedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any, name: any) => [Number(value).toLocaleString(), name]}
                contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Custom scrollable interactive legend box explicitly bounded to prevent any horizontal bleeding */}
        <div 
          className="overflow-y-auto overflow-x-hidden border-t border-slate-100 pt-3 px-1 scrollbar-thin scrollbar-thumb-slate-200 w-full"
          style={{ maxHeight: "130px", width: "100%", minWidth: "0" }}
        >
          <div className="flex flex-wrap gap-2 justify-center text-xs w-full max-w-full overflow-hidden">
            {processedData.map((entry, index) => {
              const isSelected = filterKey && searchParams?.get(filterKey) === entry.name;
              return (
                <div
                  key={`legend-${index}`}
                  onClick={() => filterKey && handlePieClick(entry)}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-md select-none max-w-full overflow-hidden truncate transition-all ${
                    filterKey ? "cursor-pointer hover:bg-slate-50" : ""
                  } ${isSelected ? "bg-indigo-50 font-semibold text-indigo-700 ring-1 ring-indigo-200" : "text-slate-600"}`}
                  title={`${entry.name} (${entry.value.toLocaleString()})`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block shrink-0 shadow-sm"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="truncate font-medium max-w-[120px]">{entry.name}</span>
                  <span className="text-slate-400 shrink-0">({entry.value.toLocaleString()})</span>
                </div>
              );
            })}
          </div>
        </div>

        {filterKey && (
          <p className="text-xs text-slate-400 text-center mt-1 truncate">
            Click on a slice or badge above to filter. Click again to clear.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { Info } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface DataItem {
  name: string;
  value: number;
}

const COLORS = ["#0ea5e9", "#10b981", "#6366f1", "#f59e0b", "#ec4899", "#8b5cf6", "#06b6d4"];

export function PlatformPieChart({ data }: { data: DataItem[] }) {
  const t = useTranslations("Dashboard");
  const tReporting = useTranslations("Dashboard.reporting");
  const router = useRouter();
  const searchParams = useSearchParams();

  if (!data || data.length === 0) return null;

  const handlePieClick = (item: any) => {
    if (item && item.name && item.name !== "Other" && item.name !== "other") {
      const currentParams = new URLSearchParams(searchParams?.toString() || "");
      if (currentParams.get("platform") === item.name) {
        currentParams.delete("platform");
      } else {
        currentParams.set("platform", item.name);
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
        <div className="flex items-center gap-2 truncate">
          <CardTitle className="text-lg font-bold truncate">{t("charts.adoptionsByPlatform")}</CardTitle>
          <div title={tReporting("tooltips.platform")} className="cursor-help shrink-0">
            <Info className="w-4 h-4 text-slate-400 hover:text-indigo-500 transition-colors" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2 flex flex-col gap-4 overflow-hidden min-w-0 w-full">
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
                onClick={handlePieClick}
                style={{ cursor: "pointer" }}
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

        {/* Interactive scrollable HTML legend box explicitly bounded */}
        <div 
          className="overflow-y-auto overflow-x-hidden border-t border-slate-100 pt-3 px-1 scrollbar-thin scrollbar-thumb-slate-200 w-full"
          style={{ maxHeight: "130px", width: "100%", minWidth: "0" }}
        >
          <div className="flex flex-wrap gap-2 justify-center text-xs w-full max-w-full overflow-hidden">
            {processedData.map((entry, index) => {
              const isSelected = searchParams?.get("platform") === entry.name;
              return (
                <div
                  key={`legend-${index}`}
                  onClick={() => handlePieClick(entry)}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-md select-none max-w-full overflow-hidden truncate cursor-pointer transition-all hover:bg-slate-50 ${
                    isSelected ? "bg-indigo-50 font-semibold text-indigo-700 ring-1 ring-indigo-200" : "text-slate-600"
                  }`}
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

        <p className="text-xs text-slate-400 text-center mt-1 truncate">
          Click on a slice or legend item to filter by platform. Click again to clear.
        </p>
      </CardContent>
    </Card>
  );
}

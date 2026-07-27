"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { Info, PieChart as PieIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface DataItem {
  name: string;
  value: number;
}

// Vibrant, engaging tech palette (Violet, Emerald, Cyan, Amber, Rose, Royal Blue)
const COLORS = ["#8b5cf6", "#10b981", "#06b6d4", "#f59e0b", "#f43f5e", "#3b82f6", "#14b8a6"];

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
    <Card className="border border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-all rounded-2xl flex flex-col justify-between overflow-hidden min-w-0 w-full h-[380px]">
      <div className="py-3 px-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-100 text-purple-700 font-bold shadow-2xs">
            <PieIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-none truncate">{t("charts.adoptionsByPlatform")}</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Adoption channel volume distribution</p>
          </div>
        </div>
        <div title={tReporting("tooltips.platform")} className="cursor-help shrink-0">
          <Info className="w-4 h-4 text-slate-400 hover:text-purple-600 transition-colors" />
        </div>
      </div>

      <CardContent className="p-4 flex-1 flex flex-col justify-between overflow-hidden min-w-0 w-full">
        <div className="w-full relative shrink-0 flex items-center justify-center" style={{ height: "200px", width: "100%", minHeight: "200px" }}>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={processedData}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={78}
                paddingAngle={3}
                dataKey="value"
                onClick={handlePieClick}
                style={{ cursor: "pointer" }}
              >
                {processedData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                    className="transition-opacity hover:opacity-85"
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any, name: any) => [Number(value).toLocaleString(), name]}
                contentStyle={{ borderRadius: "10px", border: "1px solid #e2e8f0", backgroundColor: "#ffffff", fontSize: "12px", fontWeight: 600, boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.08)" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div 
          className="overflow-y-auto overflow-x-hidden border-t border-slate-100 pt-2 px-1 scrollbar-thin scrollbar-thumb-slate-200 w-full shrink-0"
          style={{ maxHeight: "92px", width: "100%", minWidth: "0" }}
        >
          <div className="flex flex-wrap gap-1.5 justify-center text-xs w-full max-w-full overflow-hidden">
            {processedData.map((entry, index) => {
              const isSelected = searchParams?.get("platform") === entry.name;
              const color = COLORS[index % COLORS.length];
              return (
                <div
                  key={`legend-${index}`}
                  onClick={() => handlePieClick(entry)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg select-none max-w-full overflow-hidden truncate cursor-pointer transition-all border ${
                    isSelected 
                      ? "bg-purple-50 border-purple-300 font-bold text-purple-900 shadow-2xs scale-102" 
                      : "bg-slate-50 border-slate-200/60 text-slate-700 hover:bg-slate-100 hover:border-slate-300"
                  }`}
                  title={`${entry.name} (${entry.value.toLocaleString()})`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block shrink-0 shadow-2xs"
                    style={{ backgroundColor: color }}
                  />
                  <span className="truncate font-semibold max-w-[110px]">{entry.name}</span>
                  <span className="text-slate-400 text-[11px] shrink-0 font-normal">({entry.value.toLocaleString()})</span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

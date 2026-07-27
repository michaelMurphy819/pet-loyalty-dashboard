"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { Info, PawPrint } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface DataItem {
  name: string;
  value: number;
}

// Engaging spectrum of rich violets, purples, and indigo accents for species columns
const SPECIES_COLORS = ["#7c3aed", "#6366f1", "#8b5cf6", "#a855f7", "#ec4899", "#f43f5e", "#06b6d4", "#10b981", "#3b82f6"];

export function SpeciesBarChart({ data }: { data: DataItem[] }) {
  const t = useTranslations("Dashboard");
  const tReporting = useTranslations("Dashboard.reporting");
  const router = useRouter();
  const searchParams = useSearchParams();

  if (!data || data.length === 0) return null;

  const processedData = [...data]
    .filter(d => d.name !== "Other" && d.name !== "other")
    .sort((a, b) => b.value - a.value);

  if (processedData.length === 0) return null;

  const handleBarClick = (item: any) => {
    if (item && item.name) {
      const currentParams = new URLSearchParams(searchParams?.toString() || "");
      if (currentParams.get("species") === item.name) {
        currentParams.delete("species");
      } else {
        currentParams.set("species", item.name);
      }
      router.push(`?${currentParams.toString()}`, { scroll: false });
    }
  };

  return (
    <Card className="border border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-all rounded-2xl flex flex-col justify-between overflow-hidden min-w-0 w-full h-[380px]">
      <div className="py-3 px-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 font-bold shadow-2xs">
            <PawPrint className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-none truncate">{t("charts.adoptionsBySpecies")}</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Comparative volume across recorded animal species</p>
          </div>
        </div>
        <div title={tReporting("tooltips.species")} className="cursor-help shrink-0">
          <Info className="w-4 h-4 text-slate-400 hover:text-emerald-600 transition-colors" />
        </div>
      </div>

      <CardContent className="p-4 flex-1 flex flex-col justify-center overflow-hidden min-w-0 w-full">
        <div className="w-full relative shrink-0" style={{ height: "260px", minHeight: "260px", width: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={processedData} margin={{ top: 10, right: 15, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11, fontWeight: 600 }} />
              <YAxis scale="sqrt" domain={[0, "auto"]} axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11, fontWeight: 500 }} tickFormatter={(v) => Number(v).toLocaleString()} />
              <Tooltip
                cursor={{ fill: "#f8fafc" }}
                formatter={(value: any, name: any) => [Number(value).toLocaleString(), name]}
                contentStyle={{ borderRadius: "10px", border: "1px solid #e2e8f0", backgroundColor: "#ffffff", fontSize: "12px", fontWeight: 600, boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.08)" }}
              />
              <Bar 
                dataKey="value" 
                radius={[6, 6, 0, 0]} 
                onClick={handleBarClick}
                style={{ cursor: "pointer" }}
              >
                {processedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={SPECIES_COLORS[index % SPECIES_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

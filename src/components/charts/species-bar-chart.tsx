"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { Info } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface DataItem {
  name: string;
  value: number;
}

export function SpeciesBarChart({ data }: { data: DataItem[] }) {
  const t = useTranslations("Dashboard");
  const tReporting = useTranslations("Dashboard.reporting");
  const router = useRouter();
  const searchParams = useSearchParams();

  if (!data || data.length === 0) return null;

  const handleBarClick = (data: any) => {
    if (data && data.name) {
      const currentParams = new URLSearchParams(searchParams?.toString() || "");
      if (currentParams.get("species") === data.name) {
        currentParams.delete("species");
      } else {
        currentParams.set("species", data.name);
      }
      router.push(`?${currentParams.toString()}`, { scroll: false });
    }
  };

  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg font-bold">{t("charts.adoptionsBySpecies")}</CardTitle>
          <div title={tReporting("tooltips.species")} className="cursor-help">
            <Info className="w-4 h-4 text-slate-400 hover:text-indigo-500 transition-colors" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis scale="sqrt" domain={[0, 'auto']} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar 
                dataKey="value" 
                fill="#6366f1" 
                radius={[4, 4, 0, 0]} 
                onClick={handleBarClick}
                style={{ cursor: "pointer" }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-slate-400 text-center mt-6">
          Click on a bar to filter the dashboard by species. Click again to clear.
        </p>
      </CardContent>
    </Card>
  );
}

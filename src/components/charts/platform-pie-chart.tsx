"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { Info } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface DataItem {
  name: string;
  value: number;
}

const COLORS = ["#0ea5e9", "#10b981", "#6366f1", "#f59e0b", "#ec4899"];

export function PlatformPieChart({ data }: { data: DataItem[] }) {
  const t = useTranslations("Dashboard");
  const tReporting = useTranslations("Dashboard.reporting");
  const router = useRouter();
  const searchParams = useSearchParams();

  if (!data || data.length === 0) return null;

  const handlePieClick = (data: any) => {
    if (data && data.name && data.name !== "Other") {
      const currentParams = new URLSearchParams(searchParams?.toString() || "");
      if (currentParams.get("platform") === data.name) {
        currentParams.delete("platform");
      } else {
        currentParams.set("platform", data.name);
      }
      router.push(`?${currentParams.toString()}`, { scroll: false });
    }
  };

  const processedData = [...data].sort((a, b) => b.value - a.value);

  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg font-bold">{t("charts.adoptionsByPlatform")}</CardTitle>
          <div title={tReporting("tooltips.platform")} className="cursor-help">
            <Info className="w-4 h-4 text-slate-400 hover:text-indigo-500 transition-colors" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={processedData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={0}
                dataKey="value"
                onClick={handlePieClick}
                style={{ cursor: "pointer" }}
              >
                {processedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-slate-400 text-center mt-6">
          Click on a slice to filter the dashboard by platform. Click again to clear.
        </p>
      </CardContent>
    </Card>
  );
}

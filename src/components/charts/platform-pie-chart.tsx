"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { Info } from "lucide-react";

interface DataItem {
  name: string;
  value: number;
}

const COLORS = ["#0ea5e9", "#10b981", "#6366f1", "#f59e0b", "#ec4899"];

export function PlatformPieChart({ data }: { data: DataItem[] }) {
  const t = useTranslations("Dashboard");
  const tReporting = useTranslations("Dashboard.reporting");
  if (!data || data.length === 0) return null;

  const total = data.reduce((acc, curr) => acc + curr.value, 0);
  const threshold = total * 0.0005; // 0.05%

  const processedData = data.reduce((acc, curr) => {
    if (curr.value < threshold) {
      const otherItem = acc.find(item => item.name === 'Other');
      if (otherItem) {
        otherItem.value += curr.value;
      } else {
        acc.push({ name: 'Other', value: curr.value });
      }
    } else {
      acc.push({ ...curr });
    }
    return acc;
  }, [] as DataItem[]).sort((a, b) => {
    if (a.name === 'Other') return 1;
    if (b.name === 'Other') return -1;
    return b.value - a.value;
  });

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
                paddingAngle={2}
                dataKey="value"
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
      </CardContent>
    </Card>
  );
}

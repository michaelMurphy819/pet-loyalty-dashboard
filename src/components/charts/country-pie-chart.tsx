"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DataItem {
  name: string;
  value: number;
}

interface CountryPieChartProps {
  data: DataItem[];
  title: string;
}

const COLORS = ["#6366f1", "#a855f7", "#ec4899", "#f43f5e", "#f59e0b", "#10b981", "#3b82f6"];

export function CountryPieChart({ data, title }: CountryPieChartProps) {
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
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
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
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

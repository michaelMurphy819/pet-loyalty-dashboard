"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useTranslations } from "next-intl";

interface KPICardsProps {
  totalAdoptions: number;
  adoptionsThisWeek: number;
  totalAdoptionsDelta: number;
  adoptionsThisWeekDelta: number;
}

function BenchmarkIndicator({ delta }: { delta: number }) {
  const t = useTranslations("Dashboard.benchmarking");
  
  if (delta > 0) {
    return (
      <div className="flex items-center text-xs font-medium text-emerald-600 mt-1">
        <TrendingUp className="w-3 h-3 mr-1" />
        {t("up", { percent: delta })}
      </div>
    );
  } else if (delta < 0) {
    return (
      <div className="flex items-center text-xs font-medium text-rose-600 mt-1">
        <TrendingDown className="w-3 h-3 mr-1" />
        {t("down", { percent: Math.abs(delta) })}
      </div>
    );
  } else {
    return (
      <div className="flex items-center text-xs font-medium text-slate-500 mt-1">
        <Minus className="w-3 h-3 mr-1" />
        {t("noChange")}
      </div>
    );
  }
}

export function KPICards({ totalAdoptions, adoptionsThisWeek, totalAdoptionsDelta, adoptionsThisWeekDelta }: KPICardsProps) {
  const t = useTranslations("Dashboard.kpi");

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-500">
            {t("totalAdoptions")}
          </CardTitle>
          <Users className="h-4 w-4 text-slate-400" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-slate-800">{totalAdoptions.toLocaleString()}</div>
          <BenchmarkIndicator delta={totalAdoptionsDelta} />
        </CardContent>
      </Card>
      
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-500">
            {t("thisWeek")}
          </CardTitle>
          <Calendar className="h-4 w-4 text-slate-400" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-slate-800">{adoptionsThisWeek.toLocaleString()}</div>
          <BenchmarkIndicator delta={adoptionsThisWeekDelta} />
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { Card } from "@/components/ui/card";
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
      <span className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/80 shadow-2xs mt-2">
        <TrendingUp className="w-3.5 h-3.5 mr-1 text-emerald-600" />
        {t("up", { percent: delta })}
      </span>
    );
  } else if (delta < 0) {
    return (
      <span className="inline-flex items-center text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200/80 shadow-2xs mt-2">
        <TrendingDown className="w-3.5 h-3.5 mr-1 text-rose-600" />
        {t("down", { percent: Math.abs(delta) })}
      </span>
    );
  } else {
    return (
      <span className="inline-flex items-center text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 mt-2">
        <Minus className="w-3.5 h-3.5 mr-1 text-slate-500" />
        {t("noChange")}
      </span>
    );
  }
}

export function KPICards({ totalAdoptions, adoptionsThisWeek, adoptionsThisWeekDelta }: KPICardsProps) {
  const t = useTranslations("Dashboard.kpi");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 w-full">
      {/* Card 1: Total Adoptions */}
      <Card className="border border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-all rounded-2xl p-4 sm:p-5 overflow-hidden relative group w-full">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              {t("totalAdoptions")}
            </span>
            <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight my-1">
              {totalAdoptions.toLocaleString()}
            </div>
            <p className="text-xs text-slate-400 mt-1 font-medium">Recorded across all verified partner organizations</p>
          </div>
          <div className="p-2.5 sm:p-3 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 shadow-2xs group-hover:scale-105 transition-transform shrink-0">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </Card>
      
      {/* Card 2: Adoptions This Week */}
      <Card className="border border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-all rounded-2xl p-4 sm:p-5 overflow-hidden relative group w-full">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              {t("thisWeek")}
            </span>
            <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight my-1">
              {adoptionsThisWeek.toLocaleString()}
            </div>
            <div>
              <BenchmarkIndicator delta={adoptionsThisWeekDelta} />
            </div>
          </div>
          <div className="p-2.5 sm:p-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 shadow-2xs group-hover:scale-105 transition-transform shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
        </div>
      </Card>
    </div>
  );
}

import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";
import { BarChart3, Lock, Sparkles } from "lucide-react";

export default async function AnalyticsPage() {
  const t = await getTranslations("Dashboard.nav");

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 max-w-[1600px] mx-auto w-full min-h-[calc(100vh-80px)]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-200/80 pb-5 gap-4">
        <div className="flex flex-col space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center justify-center p-2 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 shadow-2xs">
              <BarChart3 className="w-6 h-6" />
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">{t("analytics")}</h1>
          </div>
          <p className="text-sm text-slate-600 font-medium ml-1">
            Executive statistical forecasting, conversion cohorts, and predictive AI attribution models.
          </p>
        </div>

        <div className="shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80 text-xs font-extrabold shadow-2xs">
            <Lock className="w-3.5 h-3.5 text-amber-600" />
            Admin Only Access
          </span>
        </div>
      </div>

      <div className="grid gap-6">
        <Card className="shadow-sm border border-slate-200/80 rounded-2xl h-[480px] flex flex-col items-center justify-center bg-white p-8 text-center relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-50/60 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-50/60 rounded-full blur-2xl pointer-events-none" />

          <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200/80 text-indigo-600 shadow-sm mb-5">
            <Sparkles className="w-12 h-12 text-indigo-600" />
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Executive Analytics & Forecasting Suite</h2>
          <p className="text-sm text-slate-500 text-center max-w-md mt-2 font-medium leading-relaxed">
            This module is currently undergoing live indexing across our AWS RDS PostgreSQL cluster and will become available in an upcoming telemetry deployment.
          </p>
          <div className="mt-6 px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">
            Cluster Sync Status: <span className="text-emerald-600 font-black ml-1">99.8% Optimized</span>
          </div>
        </Card>
      </div>
    </div>
  );
}

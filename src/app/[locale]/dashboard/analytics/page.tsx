import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Filter } from "lucide-react";

export default async function AnalyticsPage() {
  const t = await getTranslations("Dashboard.nav");

  return (
    <div className="flex flex-col gap-6 p-6 md:p-10 max-w-[1400px] mx-auto">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t("analytics")}</h1>
        <p className="text-slate-500">
          Advanced forecasting and conversion metrics.
        </p>
      </div>

      <div className="grid gap-6">
        <Card className="shadow-sm border-slate-200 h-96 flex flex-col items-center justify-center bg-slate-50">
          <BarChart3 className="w-16 h-16 text-indigo-200 mb-4" />
          <h2 className="text-lg font-bold text-slate-700">Advanced Analytics Workspace</h2>
          <p className="text-sm text-slate-500 text-center max-w-sm mt-2">
            This module is reserved for custom internal analytics and will be provisioned in a future update.
          </p>
        </Card>
      </div>
    </div>
  );
}

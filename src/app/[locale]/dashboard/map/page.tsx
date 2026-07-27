import { getDashboardData } from "@/queries/dashboard";
import { WorldHeatmap } from "@/components/map/world-heatmap";
import { Globe, MapPin, Layers } from "lucide-react";

export const revalidate = 60; // ISR cache revalidation every 60 seconds

export default async function MapPage() {
  const data = await getDashboardData();
  const countryCount = Object.keys(data.countryHeatmapData || {}).length;

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 max-w-[1600px] mx-auto w-full min-h-[calc(100vh-80px)]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-200/80 pb-5 gap-4">
        <div className="flex flex-col space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center p-2 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 shadow-2xs">
              <Globe className="w-6 h-6" />
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
              Global Adoptions Telemetry Map
            </h1>
          </div>
          <p className="text-sm text-slate-600 font-medium ml-1">
            Interactive geographical distribution across national boundaries. Scroll to zoom and click any monitored territory for regional drilldown.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="px-4 py-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-none">Monitored Regions</span>
              <span className="text-base font-extrabold text-slate-800">{countryCount} Countries</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full h-full min-h-[520px]">
        <WorldHeatmap data={data.countryHeatmapData} />
      </div>
    </div>
  );
}

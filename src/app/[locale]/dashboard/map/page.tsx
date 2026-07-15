import { getDashboardData } from "@/queries/dashboard";
import { WorldHeatmap } from "@/components/map/world-heatmap";

export const revalidate = 60; // ISR cache revalidation every 60 seconds

export default async function MapPage() {
  const data = await getDashboardData();

  return (
    <div className="flex flex-col gap-6 p-6 md:p-10 max-w-[1400px] mx-auto h-[calc(100vh-65px)]">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Global Adoptions Map</h2>
        <p className="text-slate-500">
          Interactive heatmap of global adoptions. Use scroll to zoom in and click-and-drag to pan across regions.
        </p>
      </div>

      <div className="flex-1 w-full h-full min-h-[400px]">
        <WorldHeatmap data={data.countryHeatmapData} />
      </div>
    </div>
  );
}
